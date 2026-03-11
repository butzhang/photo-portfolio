import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { getAllAlbums, loadManifest } from 'app/lib/photosManifest'

export const metadata: Metadata = {
  title: 'Photos',
  description: 'Photo collections by Ke Zhang',
}

export default function Photos() {
  const manifest = loadManifest()
  const albums = getAllAlbums(manifest)

  return (
    <section className="w-full">
      <h1 className="mb-8 text-2xl font-medium tracking-tight">Photos</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {albums.map((album) => {
          const cover = album.images[0]
          if (!cover || !cover.width || !cover.height) {
            return null
          }

          return (
            <Link
              key={album.slug}
              href={`/projects/${album.slug}`}
              className="group block"
            >
              <div className="overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                <Image
                  src={cover.url}
                  alt={album.title}
                  width={cover.width}
                  height={cover.height}
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>
              <div className="pt-2">
                <p className="font-medium tracking-tight">{album.title}</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {album.images.length} photos
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
