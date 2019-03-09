# About

This package is react wrapper for: [lightgallery.js](https://sachinchoolur.github.io/lightgallery.js)

# Instalation

```
yarn add react-lightgallery
```

or

```
npm install --save react-lightgallery
```

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

| Prop                  | Type   | Default                      | Required | Description                                                              |
| --------------------- | ------ | ---------------------------- | -------- | ------------------------------------------------------------------------ |
| lightgallerySettings  | Object | {}                           | no       | Setting for lightgallery                                                 |
| galleryClassName      | String | "react_lightgallery_gallery" | no       | Class name of gallery target element                                     |
| portalElementSelector | String | body                         | no       | Portal target element for adding divelement(lightgallery target element) |

## LightgalleryItem

| Prop          | Type   | Default                   | Required | Description                                                     |
| ------------- | ------ | ------------------------- | -------- | --------------------------------------------------------------- |
| group         | String | undefined                 | yes      | Name of group of photos set                                     |
| src           | String | undefined                 | yes      | Url to image                                                    |
| downloadUrl   | String | undefined                 | no       | Link for download link                                          |
| subHtml       | String | undefined                 | no       | id or class name of an object(div) which contain your sub html. |
| itemClassName | String | "react_lightgallery_item" | no       | class name of wrapper(div) of children                          |

# DEMO

[![Edit react-lightgallery1](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/mo45kpo92j?fontsize=14)

# TODO

-   API Reference
-   Support of video
-   More options from lightgallery for LightgalleryItem
-   Write tests
-   Write d.ts
