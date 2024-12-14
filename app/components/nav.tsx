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
    <nav className="flex justify-between items-center w-full">
      <Link
        href="/"
        className="text-xl font-serif tracking-wide hover:opacity-80 transition-opacity"
      >
        {metaData.title.toWellFormed()}
      </Link>
      <div className="flex flex-row gap-6 items-center">
        {Object.entries(navItems).map(([path, { name }]) => (
          <Link
            key={path}
            href={path}
            className="font-sans font-light text-sm transition-all hover:underline"
          >
            {name.toWellFormed()}
          </Link>
        ))}
        <ThemeSwitch />
      </div>
    </nav>
  );
}
