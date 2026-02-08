'use client'

import { useState, useEffect } from 'react'

type TestResult = {
  name: string
  url: string
  success: boolean
  error?: string
}

// Test component to diagnose Cloudinary URL formats
export default function DiagnosticsPage() {
  const [cloudName, setCloudName] = useState('dkyvp47ua')
  const [imageId, setImageId] = useState('L1000529_small-small_version-2')
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Generate different URL patterns to test
  const generateTestURLs = () => {
    return [
      {
        name: 'Basic',
        url: `https://res.cloudinary.com/${cloudName}/image/upload/photography-portfolio/${imageId}.jpg`,
      },
      {
        name: 'With divided_by folder',
        url: `https://res.cloudinary.com/${cloudName}/image/upload/photography-portfolio/divided_by/${imageId}.jpg`,
      },
      {
        name: 'Raw image name',
        url: `https://res.cloudinary.com/${cloudName}/image/upload/${imageId}.jpg`,
      },
      {
        name: 'Asset ID style',
        url: `https://res.cloudinary.com/${cloudName}/image/upload/v1/${imageId}.jpg`,
      },
      {
        name: 'Simple format with different filename',
        url: `https://res.cloudinary.com/${cloudName}/image/upload/photography-portfolio/light.jpg`,
      },
    ]
  }

  // Test all URL variations
  const testUrls = async () => {
    setIsLoading(true)
    const urls = generateTestURLs()

    const results = await Promise.all(
      urls.map(async (item) => {
        try {
          const success = await checkImageUrl(item.url)
          return {
            ...item,
            success,
          }
        } catch (error) {
          console.error(`Error testing ${item.name}:`, error)
          return {
            ...item,
            success: false,
            error: error.message,
          }
        }
      }),
    )

    setTestResults(results)
    setIsLoading(false)
  }

  // Check if an image URL loads successfully
  const checkImageUrl = (url: string) => {
    return new Promise<boolean>((resolve) => {
      const img = new Image()
      img.onload = () => resolve(true)
      img.onerror = () => resolve(false)
      img.src = url
    })
  }

  useEffect(() => {
    // Auto-run tests when component loads
    testUrls()
  }, [])

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Cloudinary URL Diagnostics</h1>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
        <p className="text-yellow-800">
          Based on the error message (
          <code className="bg-yellow-100 px-1">
            photography-portfolio/divided_by/L1000529_small-small_version-2.jpg
          </code>
          ), it appears Cloudinary is expecting a URL format that includes the
          project folder.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="border p-4 rounded">
          <h2 className="text-xl font-bold mb-4">Test Parameters</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Cloudinary Cloud Name
            </label>
            <input
              type="text"
              value={cloudName}
              onChange={(e) => setCloudName(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Image ID (without extension)
            </label>
            <input
              type="text"
              value={imageId}
              onChange={(e) => setImageId(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <button
            onClick={testUrls}
            disabled={isLoading}
            className={`px-4 py-2 rounded ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isLoading ? 'Testing...' : 'Test URL Patterns'}
          </button>
        </div>

        <div className="border p-4 rounded">
          <h2 className="text-xl font-bold mb-4">Upload Information</h2>

          <ol className="list-decimal ml-6 space-y-2">
            <li>
              Check if you&apos;ve run{' '}
              <code className="bg-gray-100 px-1">npm run upload-images</code> to
              upload your images to Cloudinary
            </li>
            <li>
              Make sure your .env file has the correct Cloudinary credentials
            </li>
            <li>
              Try logging into your Cloudinary dashboard to see the exact Public
              IDs of your images
            </li>
            <li>
              Test a simple image upload directly through the Cloudinary
              dashboard
            </li>
          </ol>

          <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded">
            <p>
              The upload script in{' '}
              <code className="bg-blue-100 px-1">
                scripts/upload-to-cloudinary.js
              </code>{' '}
              has been updated to match the URL format from your error message.
            </p>
          </div>
        </div>
      </div>

      {/* Test Results */}
      <div className="border p-4 rounded mb-8">
        <h2 className="text-xl font-bold mb-4">Test Results</h2>

        {testResults.length === 0 && !isLoading ? (
          <div className="p-4 bg-gray-100 rounded">No tests run yet</div>
        ) : isLoading ? (
          <div className="p-4 bg-gray-100 rounded">Testing URLs...</div>
        ) : (
          <div className="space-y-4">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded ${
                  result.success
                    ? 'bg-green-100 border-green-200'
                    : 'bg-red-50 border-red-200'
                } border`}
              >
                <div className="flex items-center">
                  <span
                    className={`inline-block w-5 h-5 rounded-full mr-2 ${
                      result.success ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  >
                    <span className="text-white flex items-center justify-center h-full">
                      {result.success ? '✓' : '✗'}
                    </span>
                  </span>
                  <h3 className="font-bold">{result.name}</h3>
                </div>
                <div className="mt-2">
                  <code className="block p-2 bg-gray-800 text-white rounded text-xs overflow-auto">
                    {result.url}
                  </code>
                </div>
              </div>
            ))}

            {/* Summary */}
            <div className="p-4 border rounded bg-gray-50">
              <h3 className="font-bold mb-2">Summary</h3>
              <p>
                {testResults.filter((r) => r.success).length} out of{' '}
                {testResults.length} URLs worked.
              </p>
              {testResults.some((r) => r.success) && (
                <div className="mt-2 p-3 bg-green-50 text-green-800 rounded">
                  <p className="font-medium">Working URL Format:</p>
                  <code className="block p-2 mt-1 bg-green-100 rounded text-xs">
                    {testResults.find((r) => r.success)?.url}
                  </code>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-100 rounded">
        <h2 className="text-lg font-bold mb-2">Manual Testing</h2>
        <p className="mb-4">
          Try opening these URLs directly in your browser to see if they work:
        </p>

        <ol className="list-decimal ml-6 space-y-2">
          <li>
            <a
              href={`https://res.cloudinary.com/${cloudName}/image/upload/photography-portfolio/light.jpg`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Simple test image: light.jpg
            </a>
          </li>
          <li>
            <a
              href={`https://res.cloudinary.com/${cloudName}/image/upload/photography-portfolio/divided_by/light.jpg`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              With folder: divided_by/light.jpg
            </a>
          </li>
        </ol>
      </div>
    </div>
  )
}
