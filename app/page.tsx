import path from 'path'
import sizeOf from 'image-size'
import CarouselClient from './components/CarouselClient'

export default function Page() {
  const images = [
    {
      path: '/photos/divided_by/L1000529_small-small_version-2.jpg',
      title: '',
    },
    { path: '/photos/divided_by/light.jpg', title: null },
    { path: '/photos/divided_by/car.jpg', title: null },
    {
      path: '/photos/reflections_on_reality/L1011420 1_sm_web_use.jpg',
      title: null,
    },
    {
      path: '/photos/reflections_on_reality/_1001206_sm_web_use.jpg',
      title: null,
    },
    {
      path: '/photos/reflections_on_reality/L1010485_sm_web_use.jpg',
      title: null,
    },
    { path: '/photos/street_select/L1010783_sm_web_use.jpg', title: null },
    { path: '/photos/hometown_2015/leica295dr_sm_web_use 1.jpg', title: null },
    { path: '/photos/donghu/000385_sm_web_use.jpg', title: null },
    { path: '/photos/donghu/leica568wuhan_sm_web_use.jpg', title: null },
    { path: '/photos/Graduation/rolleflex466_sm_web_use.jpg', title: null },
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

    // Extract project_folder from the path: /photos/{project_folder}/{image_name}
    // Splitting by '/' yields ['', 'photos', '{project_folder}', '{image_name}']
    const parts = img.path.split('/')
    const project_folder = parts[2]

    // Construct link to the project's page
    const link = `/projects/${project_folder}`

    return {
      src: img.path,
      width,
      height,
      title: img.title,
      link,
    }
  })

  return (
    <section className="w-full relative">
      <CarouselClient images={imageDimensions} />
    </section>
  )
}
