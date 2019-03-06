# About

This package is wrapper for: [lightgallery.js](https://sachinchoolur.github.io/lightgallery.js)

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
const PhotoItem = ({ image, url, title }) => (
    <Item>
        <LightgalleryItem group="any" src={image}>
            <Link href={url}>
                <Image src={image} />
                <ItemTitle>
                    <LinesEllipsis
                        text={title}
                        maxLine="2"
                        ellipsis="..."
                        trimRight
                        basedOn="letters"
                    />
                </ItemTitle>
            </Link>
        </LightgalleryItem>
    </Item>
);
```

# DEMO

[![Edit react-lightgallery1](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/mo45kpo92j?fontsize=14)

# TODO

-   API Reference
-   Support of video
-   Write tests
-   Write d.ts
