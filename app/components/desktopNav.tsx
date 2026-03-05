import Link from 'next/link'
import { projects } from '../config'
import { ThemeSwitch } from './theme-switch'

export default function DesktopNav() {
  return (
    <div className="hidden sm:flex items-center gap-6">
      {/* Example: Desktop shows the "projects" dropdown and other links */}
      <div className="relative group">
        <span className="font-light text-sm lowercase cursor-default hover:opacity-80 transition-all">
          projects
        </span>
        <div className="absolute left-0 top-full mt-0 py-2 w-48 bg-white dark:bg-neutral-900 hidden group-hover:block z-50 shadow">
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

      {/* Add other desktop-only links here if needed */}
      {/* Example: <Link href="/blog" className="font-light text-sm lowercase hover:opacity-80">blog</Link> */}

      <ThemeSwitch />
    </div>
  )
}
