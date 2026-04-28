import { useState } from "react";
import { IMAGE_PLACEHOLDER } from "../../config/constants";
import ProductThumbnails from "./ProductThumbnails";

export default function ProductImageViewer({
    images = [],
    showThumbnails = true,
    height = "h-[480px]",
    hoverZoom = false,
    rounded = "rounded-xl",
    initialImage = null,
}) {
    const validImages = images.length > 0 ? images : [IMAGE_PLACEHOLDER];

    const [selected, setSelected] = useState(initialImage || validImages[0]);

    return (
        <div className="relative">
            <img
                src={selected}
                alt="Product image"
                className={`
                    w-full object-cover shadow mb-4
                    ${height}
                    ${rounded}
                    ${hoverZoom ? "transition-transform duration-300 group-hover:scale-105" : ""}
                `}
            />

            {showThumbnails && validImages.length > 1 && (
                <ProductThumbnails
                    images={validImages}
                    selectedImage={selected}
                    onSelect={setSelected}
                />
            )}
        </div>
    );
}
