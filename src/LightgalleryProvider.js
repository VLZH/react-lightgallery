import React, { Component, createRef } from "react";
import { createPortal } from "react-dom";
import PT from "prop-types";
import debounce from "lodash/debounce";
import { isBrowser } from "browser-or-node";
//
import { lightgalleryContext } from "./lightgalleryContext";
import { addPrefix } from "./utils";

const PLUGINS_LIST = [
    "lg-autoplay.js",
    "lg-fullscreen.js",
    "lg-hash.js",
    "lg-pager.js",
    "lg-thumbnail.js",
    "lg-video.js",
    "lg-zoom.js",
    "lg-share.js",
];

const DEFAULT_PLUGINS = [
    "lg-fullscreen.js",
    "lg-thumbnail.js",
    "lg-video.js",
    "lg-zoom.js",
];

export class LightgalleryProvider extends Component {
    static defaultProps = {
        plugins: DEFAULT_PLUGINS,
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
        // special callback that will call on loading of lightgallery.js
        onLightgalleryImport: PT.func,
    };

    gallery_element = createRef();

    _groups = {};
    // keep event handlers for deleting they from element
    _listeners = {};
    // this component will unmount and we must prevent forceUpdate call from children
    _will_unmount = false;

    componentDidMount() {
        this.loadLightgalleryJS();
    }

    componentWillUnmount() {
        this.destroy();
    }

    _forceUpdate = debounce(this.forceUpdate, 50);

    /**
     * Lightgallery.js have a lot of browser-only code
     * For minimize bundle size on first load of page we will load lightgallery.js only using dynamic import
     * If lightgallery already loaded on page we will ignore load operation
     */
    loadLightgalleryJS = () => {
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
    };

    destroy = () => {
        this._will_unmount = true;
        this._forceUpdate.cancel();
        this.destroyExistGallery();
    };

    /**
     * Get unique id of gallery (Example: 'lg3')
     */
    getLgUid = () => {
        if (this.gallery_element.current)
            return this.gallery_element.current.getAttribute("lg-uid");
    };

    hasGroup = (group_name) => {
        return this._groups.hasOwnProperty(group_name);
    };

    /**
     * Register new photo in group
     * After first operation we will add deferred task for rerender
     */
    registerPhoto = (item_uid, group_name, options) => {
        this._groups = {
            ...this._groups,
            [group_name]: [
                ...(this._groups[group_name] || []),
                { ...options, uid: item_uid },
            ],
        };
        this._forceUpdate();
    };

    /**
     * Remove photo from group.
     * After first operation we will add deferred task for rerender.
     * If this gallery already marked as to be unmount we will ignore this operations, firstly for ignoring calling _forceUpdate
     */
    unregisterPhoto = (item_uid, group_name) => {
        if (this._will_unmount) return;
        this._groups = {
            ...this._groups,
            [group_name]: this._groups[group_name].filter(
                (opts) => opts.uid !== item_uid
            ),
        };
        this._forceUpdate();
    };

    /**
     * Get lightgallery object
     */
    getLightgalleryObject = () => {
        return window.lgData[this.getLgUid()];
    };

    /**
     * Destroy already exists lightgallery and remove all listeners
     */
    destroyExistGallery = () => {
        if (
            typeof window === "object" &&
            window.lgData &&
            window.lgData[this.getLgUid()]
        ) {
            this.removeListeners();
            this.getLightgalleryObject().destroy(true);
        }
    };

    /**
     * Register new listener on gallery HTMLElement
     * @prop {string} event_type - event name/type
     * @prop {function} system_handler - system handler for correct working of this component
     */
    setUpListener = (event_type, system_handler) => {
        const el = this.gallery_element.current;
        const handler = (event) => {
            if (this.props[event_type]) {
                this.props[event_type](event, this.getLightgalleryObject());
            }
            if (system_handler) {
                system_handler();
            }
        };
        el.addEventListener(event_type, handler);
        // TODO: remove extra check
        if (this._listeners[event_type]) {
            console.error(`Event ${event_type} already exist in _listeners`);
        }
        this._listeners[event_type] = handler;
    };

    /**
     * Remove listener from slider-element
     * @prop {string} event_type - event name/type
     */
    removeListener = (event_type) => {
        const el = this.gallery_element.current;
        // TODO: remove extra check
        if (this._listeners[event_type]) {
            el.removeEventListener(event_type, this._listeners[event_type]);
            delete this._listeners[event_type];
        }
    };

    removeListeners = () => {
        for (const key in this._listeners) {
            this.removeListener(key);
        }
    };

    /**
     * Setup listeners for events of interest to us
     */
    setupListeners = () => {
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
        this.setUpListener("onCloseAfter", () => {
            setTimeout(() => {
                this.destroyExistGallery();
            }, 0);
        });
    };

    /**
     * Returns group by name, if group with specific name does not exist this function print error message to console.
     * @param {String} group_name name of group
     */
    getGroupByName = (group_name) => {
        if (!this.hasGroup(group_name)) {
            console.error(
                `Trying to open undefined group with name '${group_name}'`
            );
            return;
        }
        const current_group = this._groups[group_name];
        return current_group;
    };

    /**
     * Open gallery with specific item by item unique id.
     * @param {String} item_uid unique id of item
     * @param {String} group_name name of group
     */
    openGallery = (item_uid, group_name) => {
        const current_group = this.getGroupByName(group_name);
        const index = Math.max(
            current_group.findIndex((i) => i.uid === item_uid),
            0
        );
        this.openGalleryByIndex(index, group_name);
    };

    /**
     * @param {Number} item_idx number of slide
     * @param {String} group_name name of group
     */
    openGalleryByIndex = (item_idx = 0, group_name) => {
        if (!this.gallery_element.current) {
            console.error(
                "Error on trying to open gallery; ref 'gallery_element' is not defined"
            );
            return;
        }
        // force destroy previous gallery (most expected that gallery already destroyed on closing of gallery)
        this.destroyExistGallery();
        // open new gallery
        const current_group = this.getGroupByName(group_name);
        lightGallery(this.gallery_element.current, {
            ...(this.props.lightgallerySettings || {}),
            dynamic: true,
            dynamicEl: current_group,
            index: item_idx,
        });
        this.setupListeners();
    };

    render() {
        const {
            galleryClassName = addPrefix("gallery"),
            portalElementSelector,
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
                    openGallery: this.openGallery,
                    openGalleryByIndex: this.openGalleryByIndex,
                    hasGroup: this.hasGroup,
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
