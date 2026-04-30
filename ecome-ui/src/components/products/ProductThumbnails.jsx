export default function ProductThumbnails({ images = [], selectedImage, onSelect }) {
    if (!images || images.length <= 1) return null;

    return (
        <div className="flex gap-3 mt-2">
            {images.map((img, i) => {
                const isActive = selectedImage === img;

                return (
                    <img
                        key={i}
                        src={img}
                        alt="Thumbnail"
                        onClick={() => onSelect(img)}
                        className={`
                            w-14 h-14 sm:w-20 sm:h-20
                            object-cover rounded-lg cursor-pointer
                            border transition-all duration-200
                            ${
                                isActive
                                    ? "border-sky-500 ring-2 ring-sky-300 dark:ring-sky-600"
                                    : "border-gray-300 dark:border-gray-700 hover:opacity-80"
                            }
                        `}
                    />
                );
            })}
        </div>
    );
}
