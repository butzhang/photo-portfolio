import ReactMarkdown from 'react-markdown'

import { loadManifest, getAlbumBySlug } from '../../lib/photosManifest'

export async function generateStaticParams() {
  const manifest = loadManifest()
  return manifest.albums.map((album) => ({ project: album.slug }))
}

export default async function ProjectPage({
  params,
}: {
  params: { project: string }
}) {
  const manifest = loadManifest()
  const album = getAlbumBySlug(manifest, params.project)

  if (!album) {
    return <div>Project not found</div>
  }

  return (
    <main className="w-full flex flex-col items-center justify-start px-8 mt-6">
      <h1 className="text-xl md:text-2xl font-serif tracking-wide mb-2 text-center">
        {album.title.toWellFormed()}
      </h1>
      {album.subtitle && (
        <div className="text-sm font-light mb-10 max-w-md text-center leading-relaxed">
          <ReactMarkdown>{album.subtitle}</ReactMarkdown>
        </div>
      )}

      {/* Use same 1200px max width for consistency */}
      <div className="w-full max-w-[1200px] flex flex-col gap-8">
        {album.images.map((image) => {
          if (!image) {
            return null
          }

          const originalWidth = image.width
          const originalHeight = image.height

          // If dimensions cannot be determined, skip rendering this image
          if (!originalWidth || !originalHeight) {
            return null
          }

          const isPortrait = originalHeight > originalWidth * 1.2
          const className = isPortrait ? 'max-w-[700px] mx-auto' : ''

          return (
            <div key={image.filename} className="relative w-full h-auto">
              <img
                src={image.url}
                alt={image.filename}
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
