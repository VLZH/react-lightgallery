import React, { useState } from "react";
import PT from "prop-types";
import ReactDOM from "react-dom";
import {
    LightgalleryProvider,
    LightgalleryItem,
    withLightgallery,
    useLightgallery,
} from "../dist/index.js";
//
import "./styles.css";
import "lightgallery.js/dist/css/lightgallery.css";

const GROUP1 = [
    [
        "https://images.unsplash.com/photo-1592549585866-486f41343aaf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
        "https://images.unsplash.com/photo-1592549585866-486f41343aaf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
    ],
    [
        "https://images.unsplash.com/photo-1594614271360-0ed9a570ae15?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
        "https://images.unsplash.com/photo-1594614271360-0ed9a570ae15?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
    ],
];

const GROUP2 = [
    "https://images.unsplash.com/photo-1594818898109-44704fb548f6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
    "https://images.unsplash.com/photo-1594818896795-35ad7bcf3c6a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
    "https://images.unsplash.com/photo-1594818896744-57eca4d47b07?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
    "https://images.unsplash.com/photo-1594818897077-aec41f55241f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1951&q=80",
];

const GROUP3 = [
    {"imageUrl": "https://images.unsplash.com/photo-1594818898109-44704fb548f6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"},
    {"imageUrl": "https://images.unsplash.com/photo-1594818898109-44704fb548f6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"},
    {
        "preview": "https://img.youtube.com/vi/71I9gVaQ0Zk/maxresdefault.jpg",
        "poster": "https://img.youtube.com/vi/71I9gVaQ0Zk/maxresdefault.jpg", 
        "videoUrl": "https://www.youtube.com/embed/71I9gVaQ0Zk",
    }
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
    group: PT.string.isRequired,
};

const VideoItem = ({ src, group, preview, poster }) => (
    <div style={{ maxWidth: "250px", width: "200px", padding: "5px" }}>
        <LightgalleryItem group={group} src={src} title="Demo" poster={poster}>
            <img src={preview} style={{ width: "100%" }} />
        </LightgalleryItem>
    </div>
);
VideoItem.propTypes = {
    src: PT.string.isRequired, 
    preview: PT.string,
    group: PT.string.isRequired,
    poster: PT.string,
};

const OpenButtonWithHoc = withLightgallery(
    ({ openGallery, className, ...rest }) => {
        return (
            <button
                {...rest}
                onClick={() => {
                    openGallery("group1");
                }}
                className={["button is-primary", className || ""].join(" ")}
            />
        );
    }
);

const OpenButtonWithHook = ({ className, index, ...rest }) => {
    const { openGallery } = useLightgallery();
    return (
        <button
            {...rest}
            onClick={() => openGallery("group2", index)}
            className={["button is-primary", className || ""].join(" ")}
        />
    );
};
OpenButtonWithHook.propTypes = {
    className: PT.string,
    index: PT.number,
};

function App() {
    const [visible, setVisible] = useState(true);
    return (
        <div className="content">
            <button
                className="button is-light"
                style={{
                    position: "absolute",
                }}
                onClick={() => setVisible(!visible)}
            >
                {visible ? (
                    <i className="fas fa-eye-slash"></i>
                ) : (
                    <i className="fas fa-eye"></i>
                )}
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
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            {GROUP1.map((p, idx) => (
                                <PhotoItem
                                    key={idx}
                                    image={p[0]}
                                    thumb={p[1]}
                                    group="group1"
                                />
                            ))}
                        </div>
                        <h2 style={{ textAlign: "center" }}>Group 2</h2>

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            {GROUP2.map((p, idx) => (
                                <PhotoItem key={idx} image={p} group="group2" />
                            ))}
                        </div>

                        <h2 style={{ textAlign: "center" }}>Group 3 with video</h2>

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            {GROUP3.map((o, idx) => (
                                <>
                                    {o.imageUrl && <PhotoItem key={idx} image={o.imageUrl} group="group3" />}
                                    {o.videoUrl && <VideoItem key={idx} src={o.videoUrl} group="group3" preview={o.preview} poster={o.poster} />}
                                </>
                            ))}
                        </div>

                        <h2 style={{ textAlign: "center" }}>Buttons</h2>

                        <div className="buttons mt-4">
                            <OpenButtonWithHoc className="mr-2">
                                Open first photos group (using hoc)
                            </OpenButtonWithHoc>
                            <OpenButtonWithHook>
                                Open second photos group (using hook)
                            </OpenButtonWithHook>
                            <OpenButtonWithHook index={3}>
                                Open second photos group with index 3 (using
                                hook)
                            </OpenButtonWithHook>
                        </div>
                    </LightgalleryProvider>
                ) : null}
            </div>
        </div>
    );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
