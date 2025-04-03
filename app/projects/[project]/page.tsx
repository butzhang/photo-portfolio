import fs from 'fs'
import path from 'path'
import ReactMarkdown from 'react-markdown'
import sizeOf from 'image-size'
import { getCloudinaryUrl } from '../../lib/cloudinary'

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

    if (project.excludes && project.excludes.length > 0) {
      images = images.filter((img) => !project.excludes!.includes(img))
    }

    if (project.imageOrder && project.imageOrder.length > 0) {
      const ordered = project.imageOrder.filter((img) => images.includes(img))
      const remaining = images
        .filter((img) => !project.imageOrder!.includes(img))
        .sort()
      images = [...ordered, ...remaining]
    } else {
      images.sort()
    }
  } catch (error) {
    console.error(error)
  }

  return (
    <main className="w-full flex flex-col items-center justify-start px-8 mt-6">
      <h1 className="text-xl md:text-2xl font-serif tracking-wide mb-2 text-center">
        {project.title.toWellFormed()}
      </h1>
      {project.subtitle && (
        <div className="text-sm font-light mb-10 max-w-md text-center leading-relaxed">
          <ReactMarkdown>{project.subtitle}</ReactMarkdown>
        </div>
      )}

      {/* Use same 1200px max width for consistency */}
      <div className="w-full max-w-[1200px] flex flex-col gap-8">
        {images.map((img) => {
          const imagePath = path.join(projectPath, img)
          const dimensions = sizeOf(imagePath)
          const originalWidth = dimensions.width
          const originalHeight = dimensions.height

          // If dimensions cannot be determined, skip rendering this image
          if (!originalWidth || !originalHeight) {
            return null
          }

          const isPortrait = originalHeight > originalWidth * 1.2
          const className = isPortrait ? 'max-w-[700px] mx-auto' : ''

          // Local path for the image
          const localImagePath = `/photos/${project.project_folder}/${img}`

          // Get the Cloudinary URL
          const cloudinaryUrl = getCloudinaryUrl(localImagePath)

          return (
            <div key={img} className="relative w-full h-auto">
              <img
                src={cloudinaryUrl}
                alt={img}
                width={originalWidth}
                height={originalHeight}
                className={`w-full h-auto object-contain ${className}`}
                loading="lazy"
              />
            </div>
          )
        })}
      </div>
    </main>
  )
}
