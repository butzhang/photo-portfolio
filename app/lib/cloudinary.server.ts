// This is a server-only module that loads the Cloudinary mapping
// It should not be imported from client components

import fs from 'fs'
import path from 'path'

/**
 * Load the Cloudinary mapping file
 * @returns {Object} The mapping of local paths to Cloudinary URLs
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
 * @param {string} localPath - The local file path
 * @param {string} cloudName - The Cloudinary cloud name
 * @returns {string} The Cloudinary URL
 */
export function generateCloudinaryUrl(localPath, cloudName) {
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
    .replace(/[^a-zA-Z0-9_\-.]/g, '_')

  // Generate URL with normalized filename
  return `https://res.cloudinary.com/${cloudName}/image/upload/photography-portfolio/${normalizedFileName}`
}
