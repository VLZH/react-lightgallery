# About

This package is react wrapper for: [lightgallery.js](https://sachinchoolur.github.io/lightgallery.js)

![npm](https://img.shields.io/npm/dm/react-lightgallery) ![GitHub issues](https://img.shields.io/github/issues-raw/vlzh/react-lightgallery) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/react-lightgallery)

# Installation

```bash
yarn add react-lightgallery
```

or

```bash
npm install --save react-lightgallery
```

# Run example

```
git clone git@github.com:VLZH/react-lightgallery.git
# go to the project folder
cd ./react-lightgallery
# install dependencies
yarn install
# run example
yarn start:example
```

## Live demo

[![Edit react-lightgallery1](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/mo45kpo92j?fontsize=14)

# Usage

Import `.css` file in your code:

```javascript
// some Root.js file
import "lightgallery.js/dist/css/lightgallery.css";
```

Add the **provider** to your a high-level component

```javascript
// some Root.js file
import React from "react";
import { LightgalleryProvider } from "react-lightgallery";

class App extends React.Component {
    render() {
        return (
            <LightgalleryProvider
                lightgallerySettings={
                    {
                        // settings: https://sachinchoolur.github.io/lightgallery.js/docs/api.html
                    }
                }
                galleryClassName="my_custom_classname"
            >
                // your components
            </LightgalleryProvider>
        );
    }
}
```

The Provider is the manager of `photo-groups` in a case when you want to have several sets of photos, also this is settings storage for lightgallery.js

Wrap some elements by `<LightgalleryItem>`

```javascript
// some PhotoItem.js file
import { LightgalleryItem } from "react-lightgallery";

const PhotoItem = ({ image, url, title }) => (
    <div>
        <LightgalleryItem group="any" src={image}>
            <a href={url}>
                <img src={image} />
                <ItemTitle>
                    <LinesEllipsis
                        text={title}
                        maxLine="2"
                        ellipsis="..."
                        trimRight
                        basedOn="letters"
                    />
                </ItemTitle>
            </a>
        </LightgalleryItem>
    </div>
);
```

# Props

## LightgalleryProvider

| Prop                  | Type     | Default                                                                | Required | Description                                                                                                         |
| --------------------- | -------- | ---------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------- |
| lightgallerySettings  | Object   | {}                                                                     | no       | Setting for lightgallery. [More information](https://sachinchoolur.github.io/lightgallery.js/docs/api.html#options) |
| galleryClassName      | String   | "react_lightgallery_gallery"                                           | no       | Class name of gallery target element                                                                                |
| portalElementSelector | String   | body                                                                   | no       | Portal target element for adding divelement(lightgallery target element)                                            |
| plugins               | String[] | [ "lg-fullscreen.js", "lg-thumbnail.js", "lg-video.js", "lg-zoom.js" ] | no       | List of enabled plugins                                                                                             |

### List of supported plugins

-   lg-autoplay.js
-   lg-fullscreen.js
-   lg-hash.js
-   lg-pager.js
-   lg-thumbnail.js
-   lg-video.js
-   lg-zoom.js
-   lg-share.j

### Supported Events

You can access to events by using these **props**:

| Prop              | Type     |
| ----------------- | -------- |
| onAfterOpen       | Function |
| onSlideItemLoad   | Function |
| onBeforeSlide     | Function |
| onAfterSlide      | Function |
| onBeforePrevSlide | Function |
| onBeforeNextSlide | Function |
| onDragstart       | Function |
| onDragmove        | Function |
| onDragend         | Function |
| onSlideClick      | Function |
| onBeforeClose     | Function |
| onCloseAfter      | Function |

Example of using events:

```javascript
class App extends React.Component {
    render() {
        return (
            <LightgalleryProvider
                onAfterSlide={(event, lightgallery_object) => {
                    console.log(lightgallery_object);
                    console.log(
                        `Prev slide index: ${event.detail.prevIndex}; Current index: ${event.detail.index}`
                    );
                }}
            >
                // your components
            </LightgalleryProvider>
        );
    }
}
```

## LightgalleryItem

| Prop          | Type   | Default                   | Required | Description                                                     |
| ------------- | ------ | ------------------------- | -------- | --------------------------------------------------------------- |
| group         | String | undefined                 | yes      | Name of group of photos set                                     |
| src           | String | undefined                 | yes      | Url to image                                                    |
| thumb         | String | undefined           | no       | Url to thumbnail image                                                    |
| poster         | String | undefined           | no       | Url to poster image. Required to avoid autoplay for video items                                                    |
| downloadUrl   | String | undefined                 | no       | Link for download link                                          |
| subHtml       | String | undefined                 | no       | id or class name of an object(div) which contain your sub html. |
| itemClassName | String | "react_lightgallery_item" | no       | class name of wrapper(div) of children                          |

# HOCs and Hooks

> ⚠️ Note!  
> You should to use this HOCs and hooks only inside of `LightgalleryProvider`

## useLightgallery

React hook that returns `openGallery` function for opening of a group.

### Example

```javascript
import React, { useCallback } from "react";
import { useLightgallery } from "react-lightgallery";

function MySuperButton({ group_name }) {
    const { openGallery } = useLightgallery();

    const open = useCallback(() => {
        openGallery(group_name, 5); // you must to define target group, index (second parameter) is optional
    }, [group_name]);

    return <button onClick={open}>Open gallery</button>;
}
```

## withLightgallery

React HOC for providing `openGallery` function.

### Example

```javascript
import React, { useCallback } from "react";
import { withLightgallery } from "react-lightgallery";

@withLightgallery
class MySuperButton(){
    open = () => {
        this.props.openGallery("very_cool_group")
    }

    render() {
        return <button onClick={this.open}>Open gallery</button>;
    }
}
```

# TODO

-   Rewrite to typescript
-   Remove lightgallery.js and plugins imports and provide this job to user(developer) (new major version)
-   Write tests
-   Support of video
-   Access to specific events through LightgalleryItem, like: `onOpen`, `onLeave`, `onEnter`
-   More options from lightgallery for LightgalleryItem
