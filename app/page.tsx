import CarouselClient from './components/CarouselClient'
import { getAllAlbums, loadManifest } from './lib/photosManifest'

export const dynamic = 'force-dynamic'

type CarouselImage = {
  src: string
  width: number
  height: number
  title: string
  link: string
}

function collectImages(
  albums: ReturnType<typeof getAllAlbums>,
): CarouselImage[] {
  const items: CarouselImage[] = []
  for (const album of albums) {
    for (const image of album.images) {
      if (!image) {
        continue
      }

      items.push({
        src: image.url,
        width: image.width,
        height: image.height,
        title: album.title,
        link: `/projects/${album.slug}`,
      })
    }
  }
  return items
}

function pickRandomImages(images: CarouselImage[], count: number) {
  const shuffled = [...images]
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

export default function Page() {
  const manifest = loadManifest()
  const albums = getAllAlbums(manifest)
  const images = pickRandomImages(collectImages(albums), 10)

  return (
    <section className="w-full relative pt-1">
      {images.length === 0 ? (
        <div
          className="w-full flex justify-center items-center text-gray-500"
          style={{ minHeight: '60vh' }}
        >
          No images available.
        </div>
      ) : (
        <CarouselClient images={images} />
      )}
    </section>
  )
}
