// Cloudinary utilities and URL handling
import { useState, useEffect } from 'react'

// Configuration for Cloudinary
export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dkyvp47ua',
}

// Pre-load cloudinary mapping if available at build time
// This will be populated on the server or fetched on the client
let cloudinaryMapping = {}

// Function to load mapping from the API (client-side)
export async function fetchCloudinaryMapping() {
  try {
    const response = await fetch('/api/cloudinary-mapping')
    if (response.ok) {
      const data = await response.json()
      cloudinaryMapping = data
      return data
    }
  } catch (error) {
    console.warn('Failed to fetch Cloudinary mapping from API:', error)
  }
  return {}
}

// File system operations can only happen on the server
if (typeof window === 'undefined') {
  try {
    // This will only run on the server
    // Using dynamic imports to avoid ESLint warnings
    const fs = await import('fs').then((module) => module.default)
    const path = await import('path').then((module) => module.default)

    const mappingPath = path.join(process.cwd(), 'cloudinary-mapping.json')
    if (fs.existsSync(mappingPath)) {
      const mappingContent = fs.readFileSync(mappingPath, 'utf8')
      cloudinaryMapping = JSON.parse(mappingContent)
    }
  } catch (error) {
    console.warn('Failed to load Cloudinary mapping file:', error)
  }
} else {
  // On client side, initialize the fetch
  fetchCloudinaryMapping().catch(console.error)
}

// React hook to use cloudinary mapping in components
export function useCloudinaryMapping() {
  const [mapping, setMapping] = useState(cloudinaryMapping)
  const [isLoading, setIsLoading] = useState(
    Object.keys(cloudinaryMapping).length === 0,
  )

  useEffect(() => {
    // If we already have mapping data, don't fetch again
    if (Object.keys(cloudinaryMapping).length > 0) {
      setMapping(cloudinaryMapping)
      setIsLoading(false)
      return
    }

    // Otherwise fetch from API
    setIsLoading(true)
    fetchCloudinaryMapping()
      .then((data) => {
        setMapping(data)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching Cloudinary mapping:', error)
        setIsLoading(false)
      })
  }, [])

  return { mapping, isLoading }
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
  const normalizedFileName = fileName
    .replace(/ /g, '_')
    .replace(/\(/g, '')
    .replace(/\)/g, '')
    .replace(/\[/g, '')
    .replace(/\]/g, '')
    .replace(/'/g, '')
    .replace(/"/g, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_')

  // Generate URL with normalized filename
  return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/photography-portfolio/${normalizedFileName}`
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
