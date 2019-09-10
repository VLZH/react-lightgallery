# About

This package is react wrapper for: [lightgallery.js](https://sachinchoolur.github.io/lightgallery.js)

# Instalation

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
# go to project folder
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

| Prop                  | Type   | Default                      | Required | Description                                                                                                         |
|-----------------------|--------|------------------------------|----------|---------------------------------------------------------------------------------------------------------------------|
| lightgallerySettings  | Object | {}                           | no       | Setting for lightgallery. [More information](https://sachinchoolur.github.io/lightgallery.js/docs/api.html#options) |
| galleryClassName      | String | "react_lightgallery_gallery" | no       | Class name of gallery target element                                                                                |
| portalElementSelector | String | body                         | no       | Portal target element for adding divelement(lightgallery target element)                                            |

### Supported Events
You can access to events by using these **props**:

| Prop              | Type     |
|-------------------|----------|
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
                onAfterSlide={(event) => {
                    console.log(`Prev slide index: ${event.detail.prevIndex}; Current index: ${event.detail.index}`)
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
| downloadUrl   | String | undefined                 | no       | Link for download link                                          |
| subHtml       | String | undefined                 | no       | id or class name of an object(div) which contain your sub html. |
| itemClassName | String | "react_lightgallery_item" | no       | class name of wrapper(div) of children                          |

# TODO

- Access to specific events through LightgalleryItem, like: `onOpen`, `onLeave`, `onEnter`
- More options from lightgallery for LightgalleryItem
- Optional plugins
- Support of video
- Write tests
- Write d.ts
