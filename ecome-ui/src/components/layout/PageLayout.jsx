export default function PageLayout({ sidebar, children }) {
    return (
        <div
            className="
                max-w-7xl mx-auto px-4 py-10
                min-h-[80vh]
                grid grid-cols-1
                lg:grid-cols-[minmax(240px,280px)_1fr]
                gap-10
            "
        >
            {/* Sidebar: hidden until lg */}
            <aside className="hidden lg:block lg:sticky lg:top-24">{sidebar}</aside>

            {/* Main content */}
            <section>{children}</section>
        </div>
    );
}
