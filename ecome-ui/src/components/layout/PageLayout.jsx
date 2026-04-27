export default function PageLayout({ sidebar, children }) {
    return (
        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Sidebar */}
            <aside className="max-w-[200px]">{sidebar}</aside>

            {/* Main content */}
            <section className="md:col-span-3">{children}</section>
        </div>
    );
}
