import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const mappingPath = path.join(process.cwd(), 'cloudinary-mapping.json')

    if (fs.existsSync(mappingPath)) {
      const mappingContent = fs.readFileSync(mappingPath, 'utf8')
      const mappingData = JSON.parse(mappingContent)

      return NextResponse.json(mappingData)
    } else {
      return NextResponse.json({}, { status: 404 })
    }
  } catch (error) {
    console.error('Error loading Cloudinary mapping:', error)
    return NextResponse.json(
      { error: 'Failed to load mapping' },
      { status: 500 },
    )
  }
}
