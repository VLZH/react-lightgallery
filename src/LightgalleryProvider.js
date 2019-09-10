import React, { Component, createRef } from "react";
import { createPortal } from "react-dom";
import PT from "prop-types";
import debounce from "lodash/debounce";
import { isBrowser } from "browser-or-node";
//
import lightgalleryContext from "./lightgalleryContext";
import { addPrefix } from "./utils";

if (isBrowser) {
    import("lightgallery.js").then(() => {
        console.info("lightgallery.js is loaded");
        import("lg-fullscreen.js").then(() => {
            // console.info("lg-fullscreen.js is loaded");
        });
        import("lg-zoom.js").then(() => {
            // console.info("lg-zoom.js is loaded");
        });
        import("lg-thumbnail.js").then(() => {
            // console.info("lg-thumbnail.js is loaded");
        });
        import("lg-video.js").then(() => {
            // console.info("lg-video.js is loaded");
        });
    });
}

export class LightgalleryProvider extends Component {
    static propTypes = {
        children: PT.any,
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
        onCloseAfter: PT.func
    };

    groups = {};
    gallery_element = createRef();
    listeners = {};

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
            // TODO log about error
            portalTarget = portalElementSelector
                ? document.querySelector(portalElementSelector)
                : document.body;
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
