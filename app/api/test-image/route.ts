import { NextResponse } from 'next/server'

export async function GET() {
  // Test response with a specific image URL - using a properly formatted URL
  const testImageUrl =
    'https://res.cloudinary.com/dkyvp47ua/image/upload/photography-portfolio/light.jpg'

  // Also include direct cloudinary access URL as fallback
  const fallbackUrl =
    'https://res.cloudinary.com/dkyvp47ua/image/upload/v1/photography-portfolio/light.jpg'

  console.log('Test API: Returning test image URLs:')
  console.log('Primary URL:', testImageUrl)
  console.log('Fallback URL:', fallbackUrl)

  return NextResponse.json({
    url: testImageUrl,
    fallbackUrl: fallbackUrl,
    success: true,
  })
}
