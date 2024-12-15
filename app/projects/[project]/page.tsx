import fs from 'fs'
import path from 'path'
import Image from 'next/image'
import { projects } from '../../config'

export async function generateStaticParams() {
  // This tells Next.js which projects to pre-render
  return projects.map((p) => ({
    project: p.project_folder,
  }))
}

export default function ProjectPage({
  params,
}: {
  params: { project: string }
}) {
  const projectId = params.project

  // Find the project in the config
  const project = projects.find((p) => p.project_folder === projectId)
  if (!project) {
    // If no project found, you can return a 404 UI or throw an error
    return <div>Project not found</div>
  }

  // Path to the project folder in public
  const projectPath = path.join(
    process.cwd(),
    'public',
    'photos',
    project.project_folder,
  )

  // Read the directory to get all image files
  let images: string[] = []
  try {
    images = fs
      .readdirSync(projectPath)
      .filter((file) => /\.(jpe?g|png|gif|webp|avif)$/i.test(file))
  } catch (error) {
    // Handle case where directory doesn't exist or is empty
    console.error(error)
  }

  return (
    <main className="w-full flex flex-col items-center justify-start px-8 md:px-12 lg:px-20 pt-10">
      <h1 className="text-2xl font-serif tracking-wide mb-2 lowercase">
        {project.title}
      </h1>
      <p className="text-sm font-light mb-10 max-w-md text-center leading-relaxed">
        {/* You can add a subtitle or description of the project here, or leave blank */}
      </p>

      <div className="w-full max-w-5xl flex flex-col gap-8">
        {images.map((img) => (
          <div key={img} className="relative w-full h-auto">
            <Image
              src={`/photos/${project.project_folder}/${img}`}
              alt={img}
              width={1600} // or the known width of your images
              height={1200} // or adjust based on aspect ratio
              className="w-full h-auto object-contain"
              priority={true}
            />
          </div>
        ))}
      </div>
    </main>
  )
}
