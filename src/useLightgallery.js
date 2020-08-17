import { useContext } from "react";
import { lightgalleryContext } from "./lightgalleryContext";

export const useLightgallery = () => {
    const { hasGroup, openGallery: _openGallery } = useContext(
        lightgalleryContext
    );
    const openGallery = (group_name, index = 1) => {
        if (!group_name) {
            throw new Error(
                "You must to provide 'group_name' on call function 'openGallery'"
            );
        }
        if (!hasGroup(group_name)) {
            throw new Error(`Group '${group_name}' is not exists`);
        }
        _openGallery(index, group_name);
    };
    return { openGallery };
};

export default useLightgallery;
