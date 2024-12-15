import path from 'path'
import sizeOf from 'image-size'
import CarouselClient from './components/CarouselClient'

export default function Page() {
  const images = [
    { path: '/photos/divided_by/light.jpg', title: null },
    { path: '/photos/divided_by/car.jpg', title: null },
    {
      path: '/photos/reflections_on_reality/_1001206_sm_web_use.jpg',
      title: null,
    },
    {
      path: '/photos/reflections_on_reality/L1010485_sm_web_use.jpg',
      title: null,
    },
    { path: '/photos/street_select/DSCF7723_sm_web_use.jpg', title: null },
    { path: '/photos/street_select/L1010783_sm_web_use.jpg', title: null },
  ]

  const imageDimensions = images.map((img) => {
    const filePath = path.join(
      process.cwd(),
      'public',
      img.path.replace(/^\//, ''),
    )
    const { width, height } = sizeOf(filePath)
    if (!width || !height) {
      throw new Error(`Could not determine dimensions for image: ${img.path}`)
    }
    return {
      src: img.path,
      width,
      height,
      title: img.title,
    }
  })

  return (
    <section className="w-full relative">
      {/* No need for extra px here, the layout container sets the max width */}
      <CarouselClient images={imageDimensions} />
    </section>
  )
}
