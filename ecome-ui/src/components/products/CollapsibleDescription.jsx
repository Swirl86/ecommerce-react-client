import { useEffect, useRef, useState } from "react";

export default function CollapsibleDescription({ text }) {
    const [expanded, setExpanded] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);

    const ref = useRef(null);

    const MAX_HEIGHT = 128; // ~8 rader (32px * 4)

    useEffect(() => {
        if (ref.current) {
            const contentHeight = ref.current.scrollHeight;
            setIsOverflowing(contentHeight > MAX_HEIGHT);
        }
    }, [text]);

    return (
        <div className="relative">
            <p
                ref={ref}
                className={`
                    text-gray-700 dark:text-gray-300 leading-relaxed
                    overflow-hidden transition-all duration-300
                `}
                style={{
                    maxHeight: expanded ? "none" : MAX_HEIGHT,
                }}
            >
                {text || "No description available."}
            </p>

            {/* Fade-out gradient when collapsed */}
            {!expanded && isOverflowing && (
                <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white dark:from-gray-800 pointer-events-none" />
            )}

            {/* Toggle button only if needed */}
            {isOverflowing && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="mt-2 text-sky-600 dark:text-sky-400 hover:underline text-sm"
                >
                    {expanded ? "Show less" : "Read more"}
                </button>
            )}
        </div>
    );
}
