'use client'

import { useState } from 'react'
import Link from 'next/link'
import { projects } from '../config'
import { ThemeSwitch } from './theme-switch'

export default function MobileNav() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="flex sm:hidden items-center">
      {/* Hamburger icon */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="p-2 focus:outline-none"
      >
        <div className="w-5 h-[2px] bg-black dark:bg-white mb-[5px]"></div>
        <div className="w-5 h-[2px] bg-black dark:bg-white mb-[5px]"></div>
        <div className="w-5 h-[2px] bg-black dark:bg-white"></div>
      </button>

      {menuOpen && (
        <div className="fixed inset-0 bg-white dark:bg-black z-50 flex flex-col p-8">
          <button
            className="ml-auto p-2 text-2xl hover:opacity-80 focus:outline-none"
            onClick={() => setMenuOpen(false)}
          >
            &times;
          </button>
          <nav className="mt-4 space-y-4">
            <div>
              <span className="block font-bold">projects &raquo;</span>
              <div className="ml-4 space-y-2">
                {projects.map((project) => (
                  <Link
                    key={project.project_folder}
                    href={`/projects/${project.project_folder}`}
                    className="block font-light hover:opacity-80 lowercase"
                    onClick={() => setMenuOpen(false)}
                  >
                    {project.title}
                  </Link>
                ))}
              </div>
            </div>

            {/* Add other mobile-only links here if needed */}
            {/* Example: <Link href="/blog" className="block font-light hover:opacity-80 lowercase" onClick={() => setMenuOpen(false)}>blog</Link> */}

            <ThemeSwitch />
          </nav>
        </div>
      )}
    </div>
  )
}
