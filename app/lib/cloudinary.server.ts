// Cloudinary utilities for server-side operations
import fs from 'fs'
import path from 'path'

// Configuration for Cloudinary
export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dkyvp47ua',
}

/**
 * Load the Cloudinary mapping file - server-side only
 */
export function loadCloudinaryMapping() {
  try {
    const mappingPath = path.join(process.cwd(), 'cloudinary-mapping.json')
    if (fs.existsSync(mappingPath)) {
      const mappingContent = fs.readFileSync(mappingPath, 'utf8')
      return JSON.parse(mappingContent)
    }
  } catch (error) {
    console.warn('Failed to load Cloudinary mapping file:', error)
  }
  return {}
}

/**
 * Generate a normalized Cloudinary URL for a local file path
 * This is used as a fallback when the mapping file doesn't have an entry
 */
export function generateCloudinaryUrl(localPath) {
  // Handle file paths consistently - remove leading slash and extract filename
  const cleanPath = localPath.replace(/^\//, '')
  const parts = cleanPath.split('/')

  if (parts.length < 3 || parts[0] !== 'photos') {
    // Not a photo path, return as is
    return localPath
  }

  // Get the filename and normalize it
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
