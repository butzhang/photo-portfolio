import Image from 'next/image'
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

  const sections =
    album.sections && album.sections.length > 0
      ? album.sections
      : [{ title: '', subtitle: '', images: album.images }]

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

      <div className="w-full max-w-[1200px] flex flex-col gap-16">
        {sections.map((section, sectionIndex) => (
          <section
            key={`${section.title || 'section'}-${sectionIndex}`}
            className={
              sectionIndex > 0 ? 'pt-10 border-t border-neutral-200' : ''
            }
          >
            {section.title && (
              <h2 className="mb-8 text-center tracking-[0.24em] text-xs uppercase text-neutral-500">
                {section.title}
              </h2>
            )}
            {section.subtitle && (
              <div className="text-sm font-light mb-8 max-w-md text-center leading-relaxed mx-auto">
                <ReactMarkdown>{section.subtitle}</ReactMarkdown>
              </div>
            )}
            <div className="w-full flex flex-col gap-8">
              {section.images.map((image) => {
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
                    <Image
                      src={image.url}
                      alt={image.filename}
                      width={originalWidth}
                      height={originalHeight}
                      className={`w-full h-auto object-contain ${className}`}
                    />
                  </div>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}
