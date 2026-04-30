import { useEffect, useState } from "react";
import { IMAGE_PLACEHOLDER } from "../../config/constants";
import ProductThumbnails from "./ProductThumbnails";

export default function ProductImageViewer({
    images = [],
    showThumbnails = true,
    hoverZoom = false,
    rounded = "rounded-lg sm:rounded-xl",
    initialImage = null,
}) {
    const validImages = images.length > 0 ? images : [IMAGE_PLACEHOLDER];

    const safeInitial =
        initialImage && validImages.includes(initialImage) ? initialImage : validImages[0];

    const [selected, setSelected] = useState(safeInitial);

    useEffect(() => {
        const nextInitial =
            initialImage && validImages.includes(initialImage) ? initialImage : validImages[0];

        setSelected(nextInitial);
    }, [initialImage, images]);

    return (
        <div className="relative group aspect-[4/3] sm:aspect-[3/2] lg:aspect-[4/3]">
            <img
                src={selected}
                alt="Product image"
                className={`
                    w-full h-full object-cover shadow
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
