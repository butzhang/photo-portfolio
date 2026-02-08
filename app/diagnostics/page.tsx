'use client'

import { useState } from 'react'
import { ImageUrlCheck } from '../utils/image-checker'

export default function DiagnosticPage() {
  const [cloudName, setCloudName] = useState('dkyvp47ua')
  const [publicId, setPublicId] = useState('photography-portfolio/R00027822025')
  const [customUrl, setCustomUrl] = useState('')

  // Generate different URL patterns to test
  const testUrls = [
    {
      name: 'Basic Format',
      url: `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}.jpg`,
    },
    {
      name: 'With Version',
      url: `https://res.cloudinary.com/${cloudName}/image/upload/v1/${publicId}.jpg`,
    },
    {
      name: 'With Folder',
      url: `https://res.cloudinary.com/${cloudName}/image/upload/photography-portfolio/R00027822025.jpg`,
    },
    {
      name: 'With Transformation',
      url: `https://res.cloudinary.com/${cloudName}/image/upload/c_scale,w_500/${publicId}.jpg`,
    },
    {
      name: 'Default Image',
      url: `https://res.cloudinary.com/${cloudName}/image/upload/sample`,
    },
  ]

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Cloudinary Diagnostic Tool</h1>

      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="cloudName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Cloud Name
          </label>
          <input
            type="text"
            id="cloudName"
            value={cloudName}
            onChange={(e) => setCloudName(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label
            htmlFor="publicId"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Public ID
          </label>
          <input
            type="text"
            id="publicId"
            value={publicId}
            onChange={(e) => setPublicId(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Test Auto-Generated URLs</h2>
        {testUrls.map((test, index) => (
          <ImageUrlCheck key={index} url={test.url} name={test.name} />
        ))}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Test Custom URL</h2>
        <div className="mb-4">
          <input
            type="text"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="Enter a Cloudinary URL to test"
            className="w-full p-2 border rounded"
          />
        </div>

        {customUrl && <ImageUrlCheck url={customUrl} name="Custom URL" />}
      </div>

      <div className="bg-blue-50 p-4 rounded border border-blue-200">
        <h3 className="font-bold text-blue-800 mb-2">Troubleshooting Tips</h3>
        <ul className="list-disc pl-5 text-sm text-blue-700">
          <li>Verify your Cloudinary cloud name is correct</li>
          <li>
            Check if your public ID includes or excludes the file extension
          </li>
          <li>Try with and without folder paths</li>
          <li>Confirm your images are publicly accessible</li>
          <li>
            Try a sample image (like &apos;sample&apos;) to verify basic access
          </li>
        </ul>
      </div>
    </div>
  )
}
