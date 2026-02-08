const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')
const cloudinary = require('cloudinary').v2
const sizeOf = require('image-size')

const {
  buildPublicId,
  buildCloudinaryUrl,
  deriveTitleFromSlug,
} = require('./lib/manifest-utils')

// Load environment variables from .env file
dotenv.config()

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const CLOUDINARY_FOLDER = 'photography-portfolio'
const PHOTOS_DIR = path.join(process.cwd(), 'public', 'photos')
const OUTPUT_PATH = path.join(process.cwd(), 'content', 'photos.manifest.json')

function getImageFiles(dirPath) {
  return fs
    .readdirSync(dirPath)
    .filter((file) => /\.(jpe?g|png|gif|webp|avif)$/i.test(file))
    .sort()
}

function ensureCredentials() {
  if (
    !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    console.log('Cloudinary credentials not found in environment variables.')
    console.log('Please create a .env file with:')
    console.log('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name')
    console.log('CLOUDINARY_API_KEY=your_api_key')
    console.log('CLOUDINARY_API_SECRET=your_api_secret')
    process.exit(1)
  }
}

async function uploadImage({ filePath, albumSlug, filename }) {
  const publicId = buildPublicId(CLOUDINARY_FOLDER, albumSlug, filename)

  try {
    await cloudinary.uploader.upload(filePath, {
      public_id: publicId,
      overwrite: false,
      resource_type: 'image',
    })
    return { uploaded: true }
  } catch (error) {
    return { uploaded: false, error }
  }
}

async function main() {
  ensureCredentials()

  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  })

  if (!fs.existsSync(PHOTOS_DIR)) {
    console.error(`Photos directory not found: ${PHOTOS_DIR}`)
    process.exit(1)
  }

  const albumFolders = fs
    .readdirSync(PHOTOS_DIR)
    .filter((folder) =>
      fs.statSync(path.join(PHOTOS_DIR, folder)).isDirectory(),
    )
    .sort()

  const manifest = {
    generatedAt: new Date().toISOString(),
    cloudName: CLOUD_NAME,
    rootFolder: CLOUDINARY_FOLDER,
    albums: [],
  }

  let totalImages = 0
  let uploadedCount = 0

  for (const albumSlug of albumFolders) {
    const albumPath = path.join(PHOTOS_DIR, albumSlug)
    const files = getImageFiles(albumPath)

    const images = []

    for (const filename of files) {
      totalImages += 1
      const filePath = path.join(albumPath, filename)
      const dimensions = sizeOf(filePath)
      const width = dimensions.width || 0
      const height = dimensions.height || 0

      const uploadResult = await uploadImage({
        filePath,
        albumSlug,
        filename,
      })

      if (uploadResult.uploaded) {
        uploadedCount += 1
      } else if (uploadResult.error) {
        const message =
          uploadResult.error.message ||
          uploadResult.error.error?.message ||
          String(uploadResult.error)
        console.warn(`Upload skipped for ${filePath}: ${message}`)
      }

      images.push({
        filename,
        width,
        height,
        url: buildCloudinaryUrl(
          CLOUD_NAME,
          CLOUDINARY_FOLDER,
          albumSlug,
          filename,
        ),
      })
    }

    manifest.albums.push({
      slug: albumSlug,
      title: deriveTitleFromSlug(albumSlug),
      subtitle: '',
      images,
    })
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(manifest, null, 2))

  console.log(`Manifest written to ${OUTPUT_PATH}`)
  console.log(`Albums: ${manifest.albums.length}`)
  console.log(`Images: ${totalImages}`)
  console.log(`Uploaded this run: ${uploadedCount}`)
}

main().catch((error) => {
  console.error('Upload + manifest generation failed:', error)
  process.exit(1)
})
