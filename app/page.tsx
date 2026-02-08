import CarouselClient from './components/CarouselClient'
import { getAllAlbums, loadManifest } from './lib/photosManifest'

export default function Page() {
  const manifest = loadManifest()
  const albums = getAllAlbums(manifest)
  const images = albums
    .map((album) => {
      const firstImage = album.images[0]
      if (!firstImage) {
        return null
      }
      return {
        src: firstImage.url,
        width: firstImage.width,
        height: firstImage.height,
        title: album.title,
        link: `/projects/${album.slug}`,
      }
    })
    .filter(Boolean)

  return (
    <section className="w-full relative">
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
