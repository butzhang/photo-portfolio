import fs from 'fs'
import path from 'path'
import Image from 'next/image'
import { projects } from '../../config'

export async function generateStaticParams() {
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
  const project = projects.find((p) => p.project_folder === projectId)

  if (!project) {
    return <div>Project not found</div>
  }

  const projectPath = path.join(
    process.cwd(),
    'public',
    'photos',
    project.project_folder,
  )

  let images: string[] = []
  try {
    images = fs
      .readdirSync(projectPath)
      .filter((file) => /\.(jpe?g|png|gif|webp|avif)$/i.test(file))

    // Filter out excluded images
    if (project.excludes && project.excludes.length > 0) {
      images = images.filter((img) => !project.excludes.includes(img))
    }

    // Order images if imageOrder is specified
    if (project.imageOrder && project.imageOrder.length > 0) {
      const ordered = project.imageOrder.filter((img) => images.includes(img))
      const remaining = images
        .filter((img) => !project.imageOrder!.includes(img))
        .sort()
      images = [...ordered, ...remaining]
    } else {
      images.sort() // alphabetical if no imageOrder
    }
  } catch (error) {
    console.error(error)
  }

  return (
    <main className="w-full flex flex-col items-center justify-start px-8 md:px-12 lg:px-20 mt-6">
      <h1 className="text-xl md:text-2xl font-serif tracking-wide mb-2 lowercase text-center">
        {project.title}
      </h1>
      {/* If you add a subtitle in the project config, you can display it here */}
      {project.subtitle && (
        <p className="text-sm font-light mb-10 max-w-md text-center leading-relaxed lowercase">
          {project.subtitle}
        </p>
      )}

      <div className="w-full max-w-5xl flex flex-col gap-8">
        {images.map((img) => (
          <div key={img} className="relative w-full h-auto">
            <Image
              src={`/photos/${project.project_folder}/${img}`}
              alt={img}
              width={1600}
              height={1200}
              className="w-full h-auto object-contain"
              priority={true}
            />
          </div>
        ))}
      </div>
    </main>
  )
}
