import { Link } from "react-router-dom";

export default function LogoSwitcher({ to = "/" }) {
    return (
        <Link to={to} className="flex items-center">
            {/* Light mode logo */}
            <img
                src="/images/logo-dark.png"
                alt="E‑ComE logo"
                className="h-14 w-auto dark:hidden"
            />

            {/* Dark mode logo */}
            <img
                src="/images/logo-light.png"
                alt="E‑ComE logo"
                className="h-14 w-auto hidden dark:block"
            />
        </Link>
    );
}
