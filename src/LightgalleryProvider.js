import React, { Component, createRef } from "react";
import { createPortal } from "react-dom";
import PT from "prop-types";
import debounce from "lodash/debounce";
import { isBrowser } from "browser-or-node";
//
import lightgalleryContext from "./lightgalleryContext";
import { addPrefix } from "./utils";

const PLUGINS_LIST = [
    "lg-autoplay.js",
    "lg-fullscreen.js",
    "lg-hash.js",
    "lg-pager.js",
    "lg-thumbnail.js",
    "lg-video.js",
    "lg-zoom.js",
    "lg-share.js"
];

const DEFAULT_PLUGINS = [
    "lg-fullscreen.js",
    "lg-thumbnail.js",
    "lg-video.js",
    "lg-zoom.js"
];

export class LightgalleryProvider extends Component {
    static defaultProps = {
        plugins: DEFAULT_PLUGINS
    };

    static propTypes = {
        children: PT.any,
        plugins: PT.arrayOf(PT.oneOf(PLUGINS_LIST)),
        // https://sachinchoolur.github.io/lightgallery.js/docs/api.html#lightgallery-core
        lightgallerySettings: PT.object,
        galleryClassName: PT.string,
        portalElementSelector: PT.string,
        // events
        onBeforeOpen: PT.func,
        onAfterOpen: PT.func,
        onSlideItemLoad: PT.func,
        onBeforeSlide: PT.func,
        onAfterSlide: PT.func,
        onBeforePrevSlide: PT.func,
        onBeforeNextSlide: PT.func,
        onDragstart: PT.func,
        onDragmove: PT.func,
        onDragend: PT.func,
        onSlideClick: PT.func,
        onBeforeClose: PT.func,
        onCloseAfter: PT.func,
        //
        onLightgalleryImport: PT.func
    };

    groups = {};
    gallery_element = createRef();
    listeners = {};

    componentDidMount() {
        const { plugins, onLightgalleryImport } = this.props;
        if (isBrowser && !window.lgData) {
            import("lightgallery.js").then(() => {
                if (plugins.includes("lg-autoplay.js")) {
                    import("lg-autoplay.js").then();
                }
                if (plugins.includes("lg-fullscreen.js")) {
                    import("lg-fullscreen.js").then();
                }
                if (plugins.includes("lg-hash.js")) {
                    import("lg-hash.js").then();
                }
                if (plugins.includes("lg-pager.js")) {
                    import("lg-pager.js").then();
                }
                if (plugins.includes("lg-thumbnail.js")) {
                    import("lg-thumbnail.js").then();
                }
                if (plugins.includes("lg-video.js")) {
                    import("lg-video.js").then();
                }
                if (plugins.includes("lg-zoom.js")) {
                    import("lg-zoom.js").then();
                }
                if (plugins.includes("lg-share.js")) {
                    import("lg-share.js").then();
                }
                if (onLightgalleryImport) {
                    onLightgalleryImport();
                }
            });
        }
    }

    componentWillUnmount() {
        this.destroyExistGallery();
    }

    _forceUpdate = debounce(this.forceUpdate, 50);

    getLgUid = () => {
        if (this.gallery_element.current)
            return this.gallery_element.current.getAttribute("lg-uid");
    };

    registerPhoto = (item_id, group_name, options) => {
        this.groups = {
            ...this.groups,
            [group_name]: [
                ...(this.groups[group_name] || []),
                { ...options, id: item_id }
            ]
        };
        this._forceUpdate();
    };

    unregisterPhoto = (item_id, group_name) => {
        this.groups = {
            ...this.groups,
            [group_name]: this.groups[group_name].filter(
                opts => opts.id !== item_id
            )
        };
        this._forceUpdate();
    };

    destroyExistGallery = () => {
        if (
            typeof window === "object" &&
            window.lgData &&
            window.lgData[this.getLgUid()]
        ) {
            this.removeListeners();
            window.lgData[this.getLgUid()].destroy(true);
        }
    };

    /**
     * @prop {string} event_type - event name/type
     */
    setUpListener = (event_type, additional_handler) => {
        const el = this.gallery_element.current;
        const handler = event => {
            if (this.props[event_type]) {
                // handler in props
                this.props[event_type](event);
            }
            if (additional_handler) {
                additional_handler();
            }
        };
        el.addEventListener(event_type, handler);
        if (this.listeners[event_type]) {
            console.error(`Event ${event_type} already exist in listeners`);
        }
        this.listeners[event_type] = handler;
    };

    /**
     * Remove listener from slider-element
     * @prop {string} event_type - event name/type
     */
    removeListener = event_type => {
        const el = this.gallery_element.current;
        if (this.listeners[event_type]) {
            el.removeEventListener(event_type, this.listeners[event_type]);
            delete this.listeners[event_type];
        }
    };

    removeListeners = () => {
        for (const key in this.listeners) {
            this.removeListener(key);
        }
    };

    setupListeners = () => {
        const destroy_listener = () => {
            setTimeout(() => {
                this.destroyExistGallery();
            }, 0);
        };
        this.setUpListener("onBeforeOpen");
        this.setUpListener("onAfterOpen");
        this.setUpListener("onSlideItemLoad");
        this.setUpListener("onBeforeSlide");
        this.setUpListener("onAfterSlide");
        this.setUpListener("onBeforePrevSlide");
        this.setUpListener("onBeforeNextSlide");
        this.setUpListener("onDragstart");
        this.setUpListener("onDragmove");
        this.setUpListener("onDragend");
        this.setUpListener("onSlideClick");
        this.setUpListener("onBeforeClose");
        this.setUpListener("onCloseAfter", destroy_listener);
    };

    openGallery = (item_id, group_name) => {
        if (!this.gallery_element.current) {
            console.error(
                "Error on trying to open gallery; ref 'gallery_element' is not defined"
            );
            return;
        }
        if (!this.groups.hasOwnProperty(group_name)) {
            console.error("Trying to open undefined group");
            return;
        }
        this.destroyExistGallery();
        // open new gallery
        const current_group = this.groups[group_name];
        lightGallery(this.gallery_element.current, {
            ...(this.props.lightgallerySettings || {}),
            dynamic: true,
            dynamicEl: current_group,
            index: current_group.findIndex(i => i.id === item_id)
        });
        this.setupListeners();
    };

    render() {
        const {
            galleryClassName = addPrefix("gallery"),
            portalElementSelector
        } = this.props;
        let portalTarget = null;
        if (isBrowser) {
            portalTarget = document.body;
            if (portalElementSelector) {
                const el = document.querySelector(portalElementSelector);
                if (!el) {
                    console.error(
                        "There is cannot to find element by selector: `${portalElementSelector}` lightgallery element will be added to document.body"
                    );
                }
                portalTarget = el;
            }
        }
        return (
            <lightgalleryContext.Provider
                value={{
                    registerPhoto: this.registerPhoto,
                    unregisterPhoto: this.unregisterPhoto,
                    openGallery: this.openGallery
                }}
            >
                {this.props.children}
                {portalTarget &&
                    createPortal(
                        <div
                            className={galleryClassName}
                            ref={this.gallery_element}
                        />,
                        portalTarget
                    )}
            </lightgalleryContext.Provider>
        );
    }
}
