// This script will generate a mapping of your local image paths to Cloudinary URLs
// Run with: node scripts/generate-cloudinary-map.js

const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')

// Load environment variables from .env file
dotenv.config()

// Folder where your images are stored locally
const PHOTOS_DIR = path.join(process.cwd(), 'public', 'photos')

// The cloud name from your Cloudinary account
const CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'your_cloud_name'

// The folder in Cloudinary where your images are stored
const CLOUDINARY_FOLDER = 'photography-portfolio'

// Function to normalize filenames (remove spaces, special chars)
function normalizeFilename(filename) {
  // Remove file extension
  const ext = path.extname(filename)
  const nameWithoutExt = path.basename(filename, ext)

  // Replace spaces and other problematic characters with underscores
  const normalizedName = nameWithoutExt
    .replace(/ /g, '_') // Replace spaces with underscores
    .replace(/\(/g, '') // Remove parentheses
    .replace(/\)/g, '')
    .replace(/\[/g, '') // Remove brackets
    .replace(/\]/g, '')
    .replace(/'/g, '') // Remove apostrophes
    .replace(/"/g, '') // Remove quotes
    .replace(/[^a-zA-Z0-9_-]/g, '_') // Replace any other special chars with underscore

  return normalizedName + ext
}

// Function to recursively scan directories and map files
async function mapDirectory(dirPath, baseFolder = '') {
  const files = fs.readdirSync(dirPath)
  let mapping = {}

  for (const file of files) {
    const filePath = path.join(dirPath, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      // Create a new folder path
      const folderName = file

      // Recursively process subdirectory
      const subMapping = await mapDirectory(filePath, folderName)
      mapping = { ...mapping, ...subMapping }
    } else if (stat.isFile()) {
      // Check if it's an image file
      const ext = path.extname(file).toLowerCase()
      if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
        // Local path relative to public directory
        const localPath = `/photos/${path.join(baseFolder, file)}`

        // Normalize the filename for Cloudinary
        const normalizedFileName = normalizeFilename(file)

        // Cloudinary URL
        const cloudinaryUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${CLOUDINARY_FOLDER}/${normalizedFileName}`

        // Add to mapping
        mapping[localPath] = cloudinaryUrl
      }
    }
  }

  return mapping
}

// Main function
async function main() {
  console.log('Generating Cloudinary URL mapping...')

  if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
    console.warn(
      'Warning: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME not found in environment variables.',
    )
    console.warn(
      'Using placeholder value. Please create a .env file with this variable.',
    )
  }

  try {
    const mapping = {}

    // Process each project folder separately
    const projectFolders = fs.readdirSync(PHOTOS_DIR)
    for (const folder of projectFolders) {
      const folderPath = path.join(PHOTOS_DIR, folder)
      if (fs.statSync(folderPath).isDirectory()) {
        console.log(`Processing project folder: ${folder}`)
        const folderMapping = await mapDirectory(folderPath, folder)
        Object.assign(mapping, folderMapping)
      }
    }

    // Write mapping to file
    const outputPath = path.join(process.cwd(), 'cloudinary-mapping.json')
    fs.writeFileSync(outputPath, JSON.stringify(mapping, null, 2))

    console.log(`Mapping saved to ${outputPath}`)
    console.log(`Found ${Object.keys(mapping).length} images`)
  } catch (error) {
    console.error('Error during mapping process:', error)
  }
}

// Run the script
main()
