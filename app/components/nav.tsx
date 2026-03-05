import Link from 'next/link'
import { ThemeSwitch } from './theme-switch'
import { metaData, projects } from '../config'

const navItems = {
  '/projects': { name: 'projects' },
}

export function Navbar() {
  return (
    <nav className="flex justify-between items-center w-full relative font-serif">
      <Link
        href="/"
        className="text-xl tracking-wide hover:opacity-80 transition-opacity lowercase"
      >
        {metaData.title}
      </Link>
      <div className="flex flex-row gap-6 items-center">
        {Object.entries(navItems).map(([path, { name }]) => {
          if (name.toLowerCase() === 'projects') {
            // Instead of making "projects" clickable, just show text
            return (
              <div key={path} className="relative group">
                <span className="font-light text-sm transition-all hover:opacity-80 lowercase cursor-default select-none">
                  {name}
                </span>
                {/* Dropdown menu */}
                <div
                  className="absolute left-0 top-full mt-0 py-2 w-48 bg-white dark:bg-neutral-900 hidden group-hover:block z-50 shadow"
                  // Removing vertical gap (mt-2) and putting mt-0 so there's no gap between the trigger and dropdown.
                >
                  {projects.map((project) => (
                    <Link
                      key={project.project_folder}
                      href={`/projects/${project.project_folder}`}
                      className="block px-4 py-2 text-sm font-light lowercase hover:opacity-80 transition-colors"
                    >
                      {project.title}
                    </Link>
                  ))}
                </div>
              </div>
            )
          } else {
            return (
              <Link
                key={path}
                href={path}
                className="font-light text-sm transition-all hover:opacity-80 lowercase"
              >
                {name}
              </Link>
            )
          }
        })}
        <ThemeSwitch />
      </div>
    </nav>
  )
}
