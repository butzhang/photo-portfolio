// This script will help upload your local images to Cloudinary
// Run with: node scripts/upload-to-cloudinary.js

const fs = require('fs')
const path = require('path')
const cloudinary = require('cloudinary').v2
const dotenv = require('dotenv')

// Load environment variables from .env file
dotenv.config()

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

// Folder where your images are stored locally
const PHOTOS_DIR = path.join(process.cwd(), 'public', 'photos')

// The folder in Cloudinary where you want to store your images
const CLOUDINARY_FOLDER = 'photography-portfolio'

// To store mapping of local paths to Cloudinary URLs
const urlMapping = {}

// Function to normalize filenames (replace spaces with underscores, etc.)
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
    .replace(/[^a-zA-Z0-9_-.]/g, '_') // Replace any other special chars with underscore

  return normalizedName + ext
}

// Function to recursively scan directories and upload files
async function uploadDirectory(dirPath, baseFolder = '') {
  const files = fs.readdirSync(dirPath)

  for (const file of files) {
    const filePath = path.join(dirPath, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      // Create a new folder path for Cloudinary
      const folderName = file
      console.log(`Processing directory: ${folderName}`)

      // Recursively process subdirectory
      await uploadDirectory(filePath, folderName)
    } else if (stat.isFile()) {
      // Check if it's an image file
      const ext = path.extname(file).toLowerCase()
      if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
        // Normalize filename to avoid encoding issues
        const normalizedFileName = normalizeFilename(file)

        // Format the public ID with the normalized filename
        const publicId = `${CLOUDINARY_FOLDER}/${normalizedFileName}`

        // Store the original local path for mapping
        const localPath = `/photos/${baseFolder}/${file}`

        console.log(`Uploading: ${filePath} to ${publicId}`)
        console.log(`Normalized from: ${file} to: ${normalizedFileName}`)

        try {
          // Upload the file to Cloudinary with normalized name
          const result = await cloudinary.uploader.upload(filePath, {
            public_id: publicId.replace(/\.[^/.]+$/, ''), // Remove file extension from public_id
            overwrite: false, // Skip images that already exist
            resource_type: 'image',
          })

          console.log(`Successfully uploaded: ${filePath}`)
          console.log(`Cloudinary URL: ${result.secure_url}`)

          // Store mapping from local path to actual Cloudinary URL
          urlMapping[localPath] = result.secure_url
        } catch (error) {
          console.error(`Error uploading ${filePath}:`, error)
        }
      }
    }
  }
}

// Function to load existing mapping from cloudinary-mapping.json
function loadExistingMapping() {
  const mappingPath = path.join(process.cwd(), 'cloudinary-mapping.json')
  if (fs.existsSync(mappingPath)) {
    try {
      const mappingContent = fs.readFileSync(mappingPath, 'utf8')
      return JSON.parse(mappingContent)
    } catch (error) {
      console.warn('Error loading existing mapping:', error)
    }
  }
  return {}
}

// Main function
async function main() {
  console.log('Starting upload to Cloudinary...')

  if (
    !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    console.error(
      'Error: Cloudinary credentials not found in environment variables.',
    )
    console.error('Please create a .env file with the following variables:')
    console.error('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name')
    console.error('CLOUDINARY_API_KEY=your_api_key')
    console.error('CLOUDINARY_API_SECRET=your_api_secret')
    return
  }

  try {
    // Load existing mapping
    const existingMapping = loadExistingMapping()
    console.log(
      `Loaded ${Object.keys(existingMapping).length} existing mappings`,
    )

    // Start with the existing mapping
    Object.assign(urlMapping, existingMapping)

    // Process each project folder separately
    const projectFolders = fs.readdirSync(PHOTOS_DIR)
    for (const folder of projectFolders) {
      const folderPath = path.join(PHOTOS_DIR, folder)
      if (fs.statSync(folderPath).isDirectory()) {
        console.log(`Processing project folder: ${folder}`)
        await uploadDirectory(folderPath, folder)
      }
    }

    // Save mapping to a file
    const mappingPath = path.join(process.cwd(), 'cloudinary-mapping.json')
    fs.writeFileSync(mappingPath, JSON.stringify(urlMapping, null, 2))
    console.log(`Mapping saved to ${mappingPath}`)
    console.log(`Total mappings: ${Object.keys(urlMapping).length}`)

    console.log('Upload completed successfully!')
  } catch (error) {
    console.error('Error during upload process:', error)
  }
}

// Run the script
main()
