'use client'

// Cloudinary utilities and URL handling

// Configuration for Cloudinary
export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dkyvp47ua',
}

// Client-side mapping state
let cloudinaryMapping = {}

// Function to load mapping from the API (client-side)
export async function fetchCloudinaryMapping() {
  try {
    console.log('Client: Fetching Cloudinary mapping from API...')
    const response = await fetch('/api/cloudinary-mapping')

    console.log('Client: API response status:', response.status)

    if (response.ok) {
      const data = await response.json()
      console.log(
        'Client: Received mapping with',
        Object.keys(data).length,
        'entries',
      )
      cloudinaryMapping = data
      return data
    } else {
      // Handle error responses
      const errorText = await response.text()
      console.error('Client: API error response:', response.status, errorText)
      return {}
    }
  } catch (error) {
    console.error('Client: Failed to fetch Cloudinary mapping from API:', error)
  }
  return {}
}

/**
 * Convert a local image path to a Cloudinary URL using the mapping file
 * @param {string} localPath - Path to local image, e.g. /photos/project_folder/image.jpg
 * @returns {string} Cloudinary URL or local path if mapping not found
 */
export function getCloudinaryUrl(localPath) {
  // If we already have a Cloudinary URL or other remote URL, return it as is
  if (localPath.startsWith('http')) {
    return localPath
  }

  // If USE_LOCAL_IMAGES is set in dev mode, use local paths
  if (
    process.env.NODE_ENV === 'development' &&
    process.env.USE_LOCAL_IMAGES === 'true'
  ) {
    return localPath
  }

  // Check if we have a mapping for this local path
  if (cloudinaryMapping[localPath]) {
    return cloudinaryMapping[localPath]
  }

  // We want to use Cloudinary URLs in all environments
  // Generate a URL based on the path even during development

  // Fallback: Generate a URL based on the path
  // Handle file paths consistently - remove leading slash and extract filename
  const cleanPath = localPath.replace(/^\//, '')
  const parts = cleanPath.split('/')

  if (parts.length < 3 || parts[0] !== 'photos') {
    // Not a photo path, return as is
    return localPath
  }

  // Get the filename and normalize it (replace spaces with underscores)
  const fileName = parts[parts.length - 1]

  // Make sure we keep the original file extension
  const fileExtMatch = fileName.match(/\.(jpe?g|png|gif|webp|avif)$/i)
  const fileExt = fileExtMatch ? fileExtMatch[0] : '.jpg'

  // Remove extension for normalization
  const nameWithoutExt = fileName.replace(/\.(jpe?g|png|gif|webp|avif)$/i, '')

  // Normalize the filename
  const normalizedName = nameWithoutExt
    .replace(/ /g, '_')
    .replace(/\(/g, '')
    .replace(/\)/g, '')
    .replace(/\[/g, '')
    .replace(/\]/g, '')
    .replace(/'/g, '')
    .replace(/"/g, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_')

  // Generate URL with normalized filename plus original extension
  return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/photography-portfolio/${normalizedName}${fileExt}`
}

/**
 * Get Cloudinary URL with transformations
 * @param {string} localPath - Path to local image
 * @param {Object} options - Transformation options
 * @returns {string} Cloudinary URL with transformations
 */
export function getOptimizedCloudinaryUrl(localPath, options = {}) {
  const { width, height, crop, quality, format } = options

  // Start with base URL
  const baseUrl = getCloudinaryUrl(localPath)

  // If it's not a Cloudinary URL, return as is
  if (!baseUrl.includes('res.cloudinary.com')) {
    return baseUrl
  }

  // Extract parts to add transformations
  const [prefix, suffix] = baseUrl.split('/upload/')

  // Build transformation string
  const transformations = []

  if (width) transformations.push(`w_${width}`)
  if (height) transformations.push(`h_${height}`)
  if (crop) transformations.push(`c_${crop}`)
  if (quality) transformations.push(`q_${quality}`)
  if (format) transformations.push(`f_${format}`)

  // If no transformations specified, return original URL
  if (transformations.length === 0) {
    return baseUrl
  }

  // Add transformations to URL
  return `${prefix}/upload/${transformations.join(',')}/${suffix}`
}
