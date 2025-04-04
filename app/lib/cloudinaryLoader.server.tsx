// Server component that loads image data with Cloudinary URLs
// No React import needed for server component
import {
  loadCloudinaryMapping,
  generateCloudinaryUrl,
} from './cloudinary.server'

interface ImagePathProps {
  localPath: string
  alt: string
  title: string | null
  link: string
}

interface ProcessedImageProps extends ImagePathProps {
  src: string
}

/**
 * Process a list of images with local paths, converting them to Cloudinary URLs
 * This function runs on the server
 */
export function getCloudinaryImages(
  images: ImagePathProps[],
): ProcessedImageProps[] {
  // Load the mapping file
  const mapping = loadCloudinaryMapping()

  // Environment variables
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dkyvp47ua'
  const useLocalImages = process.env.USE_LOCAL_IMAGES === 'true'

  // Process each image
  return images.map((image) => {
    // If using local images in development, don't convert to Cloudinary
    if (process.env.NODE_ENV === 'development' && useLocalImages) {
      return { ...image, src: image.localPath }
    }

    // If we have a mapping for this path, use that
    if (mapping[image.localPath]) {
      return { ...image, src: mapping[image.localPath] }
    }

    // Otherwise, generate a URL
    const cloudinaryUrl = generateCloudinaryUrl(image.localPath, cloudName)
    return { ...image, src: cloudinaryUrl }
  })
}
