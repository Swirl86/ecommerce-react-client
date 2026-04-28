import { H3 } from "../typography";

export default function ProductFeatures({ features = [] }) {
    if (!features.length) return null;

    return (
        <div className="mt-6">
            <H3>Features</H3>
            <ul className="list-disc ml-6 mt-2 text-gray-700 dark:text-gray-300">
                {features.map((f, i) => (
                    <li key={i}>{f}</li>
                ))}
            </ul>
        </div>
    );
}
