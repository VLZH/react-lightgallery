import React, { Component, createContext, createRef } from "react";
import { createPortal } from "react-dom";
import PT from "prop-types";
import uniqid from "uniqid";
import debounce from "lodash/debounce";
import { isBrowser } from "browser-or-node";
if (isBrowser) {
    import("lightgallery.js").then(() => {
        console.info("lightgallery.js is loaded");
        import("lg-fullscreen.js").then(() => {
            console.info("lg-fullscreen.js is loaded");
        });
        import("lg-zoom.js").then(() => {
            console.info("lg-zoom.js is loaded");
        });
        import("lg-thumbnail.js").then(() => {
            console.info("lg-thumbnail.js is loaded");
        });
    });
}

const lightgalleryContext = createContext();
const addPrefix = str => `react_lightgallery_${str}`;

class LightgalleryProvider extends Component {
    static propTypes = {
        children: PT.any,
        // https://sachinchoolur.github.io/lightgallery.js/docs/api.html#lightgallery-core
        lightgallerySettings: PT.object,
        galleryClassName: PT.string,
        portalElementSelector: PT.string
    };

    groups = {};

    gallery_element = createRef();

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
        // destroy previous gallery
        if (window.lgData && window.lgData[this.getLgUid()]) {
            window.lgData[this.getLgUid()].destroy(true);
        }
        // open new gallery
        const current_group = this.groups[group_name];
        lightGallery(this.gallery_element.current, {
            ...(this.props.lightgallerySettings || {}),
            dynamic: true,
            dynamicEl: current_group,
            index: current_group.findIndex(i => i.id === item_id)
        });
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
                {isBrowser &&
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

class LightgalleryItem extends Component {
    static propTypes = {
        children: PT.any,
        group: PT.string.isRequired,
        src: PT.string.isRequired,
        subHtml: PT.oneOfType([PT.string, PT.object]),
        downloadUrl: PT.string,
        itemClassName: PT.string
    };
    static contextType = lightgalleryContext;
    state = {
        id: uniqid()
    };

    componentDidMount() {
        this.register();
    }

    componentWillUnmount() {
        this.unregister();
    }

    /**
     * Register this photo in provider
     */
    register = () => {
        this.context.registerPhoto(this.state.id, this.props.group, {
            src: this.props.src,
            thumb: this.props.src,
            subHtml: this.props.subHtml || "",
            downloadUrl: this.props.downloadUrl || ""
        });
    };

    /**
     * Unregister this photo in provider
     */
    unregister = () => {
        this.context.unregisterPhoto(this.state.id, this.props.group);
    };

    open = () => {
        this.context.openGallery(this.state.id, this.props.group);
    };

    render() {
        const { itemClassName = addPrefix("item"), children } = this.props;
        return (
            <div className={itemClassName} onClick={this.open}>
                {children}
            </div>
        );
    }
}

export { LightgalleryProvider, LightgalleryItem };
