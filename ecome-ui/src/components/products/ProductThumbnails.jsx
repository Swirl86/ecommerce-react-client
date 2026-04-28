export default function ProductThumbnails({ images = [], selectedImage, onSelect }) {
    if (!images || images.length <= 1) return null;

    return (
        <div className="flex gap-3">
            {images.map((img, i) => (
                <img
                    key={i}
                    src={img}
                    alt="Thumbnail"
                    onClick={() => onSelect(img)}
                    className={`
                        w-20 h-20 object-cover rounded-lg cursor-pointer border
                        ${
                            selectedImage === img
                                ? "border-sky-500"
                                : "border-gray-300 dark:border-gray-700"
                        }
                    `}
                />
            ))}
        </div>
    );
}
