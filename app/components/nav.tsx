import Link from "next/link";
import { ThemeSwitch } from "./theme-switch";
import { metaData } from "../config";

const navItems = {
  "/blog": { name: "blog" },
  "/projects": { name: "projects" },
  "/photos": { name: "photos" },
};

export function Navbar() {
  return (
    <nav className="lg:mb-16 mb-12 py-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="flex items-center">
          <Link
            href="/"
            className="text-xl font-serif tracking-wide lowercase hover:opacity-80 transition-opacity"
          >
            {metaData.title}
          </Link>
        </div>
        <div className="flex flex-row gap-6 mt-6 md:mt-0 md:ml-auto items-center">
          {Object.entries(navItems).map(([path, { name }]) => (
            <Link
              key={path}
              href={path}
              className="font-sans font-light text-sm transition-all hover:underline"
            >
              {name}
            </Link>
          ))}
          <ThemeSwitch />
        </div>
      </div>
    </nav>
  );
}
