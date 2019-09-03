import React, { Component } from "react";
import PT from "prop-types";
import uniqid from "uniqid";
//
import lightgalleryContext from "./lightgalleryContext";
import { addPrefix } from "./utils";

export class LightgalleryItem extends Component {
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
