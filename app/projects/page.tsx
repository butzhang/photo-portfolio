import React from 'react'
import type { Metadata } from 'next'
import { projects } from '../config'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'My Projects',
}

export default function Projects() {
  const orderedProjects = [...projects].sort((a, b) =>
    b.project_folder.localeCompare(a.project_folder),
  )

  return (
    <section>
      <h1 className="mb-8 text-2xl font-medium tracking-tight">Projects</h1>
      <div className="space-y-6">
        {orderedProjects.map((project) => (
          <a
            key={project.project_folder}
            href={`/projects/${project.project_folder}`}
            className="block group hover:opacity-80 transition-opacity duration-200"
          >
            <div className="flex flex-col">
              <div className="w-full flex justify-between items-baseline">
                <span className="text-black dark:text-white font-medium tracking-tight">
                  {project.title}
                </span>
              </div>
              {project.subtitle ? (
                <p className="prose prose-neutral dark:prose-invert pt-3 whitespace-pre-line">
                  {project.subtitle}
                </p>
              ) : null}
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
