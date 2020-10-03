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
        thumb: PT.string,
        subHtml: PT.oneOfType([PT.string, PT.object]),
        downloadUrl: PT.string,
        itemClassName: PT.string,
        poster: PT.string,
    };
    static contextType = lightgalleryContext;

    state = {
        id: uniqid(),
    };

    componentDidMount() {
        this.register();
    }

    componentWillUnmount() {
        this.unregister();
    }

    /**
     * Register this slide in provider
     */
    register = () => {
        const { src, thumb = src, subHtml = "", downloadUrl = "", poster = "", } = this.props;
        this.context.registerPhoto(this.state.id, this.props.group, {
            src,
            thumb,
            subHtml,
            downloadUrl,
            poster,
        });
    };

    /**
     * Unregister this slide in provider
     */
    unregister = () => {
        this.context.unregisterPhoto(this.state.id, this.props.group);
    };

    /**
     * Open this slide
     */
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
