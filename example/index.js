import React, { useState } from "react";
import PT from "prop-types";
import ReactDOM from "react-dom";
import { LightgalleryProvider, LightgalleryItem } from "../src/index.js";
//
import "./styles.css";
import "lightgallery.js/dist/css/lightgallery.css";

const GROUP1 = [
    [
        "https://images.unsplash.com/flagged/photo-1551706646-9c816bfbff8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1567&q=80",
        "https://images.unsplash.com/flagged/photo-1551706646-9c816bfbff8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=90&q=80"
    ],
    [
        "https://images.unsplash.com/photo-1551633550-64761da5342b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1001&q=80",
        "https://images.unsplash.com/photo-1551633550-64761da5342b?ixlib=rb-1.2.1&auto=format&fit=crop&w=90&q=80"
    ]
];

const GROUP2 = [
    "https://images.unsplash.com/photo-1551833726-deb5e781c68f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
    "https://images.unsplash.com/photo-1551803021-92431219e83e?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
    "https://images.unsplash.com/photo-1551852284-ce16dd4d63d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
];

const PhotoItem = ({ image, thumb, group }) => (
    <div style={{ maxWidth: "250px", width: "200px", padding: "5px" }}>
        <LightgalleryItem group={group} src={image} thumb={thumb}>
            <img src={image} style={{ width: "100%" }} />
        </LightgalleryItem>
    </div>
);
PhotoItem.propTypes = {
    image: PT.string.isRequired,
    thumb: PT.string,
    group: PT.string.isRequired
};

function App() {
    const [visible, setVisible] = useState(true);
    return (
        <>
            <button onClick={() => setVisible(!visible)}>
                Change visibility
            </button>
            <div>
                {visible ? (
                    <LightgalleryProvider
                        onBeforeOpen={() => console.info("onBeforeOpen")}
                        onAfterOpen={() => console.info("onAfterOpen")}
                        onSlideItemLoad={() => console.info("onSlideItemLoad")}
                        onBeforeSlide={() => console.info("onBeforeSlide")}
                        onAfterSlide={() => console.info("onAfterSlide")}
                        onBeforePrevSlide={() =>
                            console.info("onBeforePrevSlide")
                        }
                        onBeforeNextSlide={() =>
                            console.info("onBeforeNextSlide")
                        }
                        onDragstart={() => console.info("onDragstart")}
                        onDragmove={() => console.info("onDragmove")}
                        onDragend={() => console.info("onDragend")}
                        onSlideClick={() => console.info("onSlideClick")}
                        onBeforeClose={() => console.info("onBeforeClose")}
                        onCloseAfter={() => console.info("onCloseAfter")}
                    >
                        <h1 style={{ textAlign: "center" }}>Group 1</h1>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            {GROUP1.map((p, idx) => (
                                <PhotoItem
                                    key={idx}
                                    image={p[0]}
                                    thumb={p[1]}
                                    group="group1"
                                />
                            ))}
                        </div>
                        <h1 style={{ textAlign: "center" }}>Group 2</h1>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            {GROUP2.map((p, idx) => (
                                <PhotoItem key={idx} image={p} group="group2" />
                            ))}
                        </div>
                    </LightgalleryProvider>
                ) : (
                    <p>Unvisible</p>
                )}
            </div>
        </>
    );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
