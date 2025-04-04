import { NextResponse } from 'next/server'
import { loadCloudinaryMapping } from '../../lib/cloudinary.server'

export async function GET() {
  try {
    console.log('API: Loading Cloudinary mapping from server...')
    const mappingData = loadCloudinaryMapping()

    const entryCount = Object.keys(mappingData).length
    console.log(`API: Loaded ${entryCount} entries from mapping file`)

    if (entryCount > 0) {
      return NextResponse.json(mappingData)
    } else {
      console.error('API: No entries found in mapping file')
      return NextResponse.json({}, { status: 404 })
    }
  } catch (error) {
    console.error('API: Error loading Cloudinary mapping:', error)
    return NextResponse.json(
      { error: 'Failed to load mapping' },
      { status: 500 },
    )
  }
}
