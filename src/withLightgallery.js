import React from "react";
import { useLightgallery } from "./useLightgallery";
import hoistNonReactStatic from "hoist-non-react-statics";

export const withLightgallery = (WrappedComponent) => {
    const WithLightgallery = (props) => {
        const { openGallery } = useLightgallery();
        return <WrappedComponent {...props} openGallery={openGallery} />;
    };
    hoistNonReactStatic(WithLightgallery, WrappedComponent);
    WithLightgallery.displayName = `withLightgallary(${WrappedComponent.displayName})`;
    return WithLightgallery;
};

export default withLightgallery;
