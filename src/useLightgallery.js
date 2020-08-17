import { useContext } from "react";
import { lightgalleryContext } from "./lightgalleryContext";

export const useLightgallery = () => {
    const { hasGroup, openGalleryByIndex: _openGalleryByIndex } = useContext(
        lightgalleryContext
    );
    const openGallery = (group_name, item_idx = 0) => {
        if (!group_name) {
            throw new Error(
                "You must to provide 'group_name' on call function 'openGallery'"
            );
        }
        if (!hasGroup(group_name)) {
            throw new Error(`Group '${group_name}' is not exists`);
        }
        _openGalleryByIndex(item_idx, group_name);
    };
    return { openGallery };
};

export default useLightgallery;
