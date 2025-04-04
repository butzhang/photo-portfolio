'use client'

import { useState } from 'react'
import Image from 'next/image'

// A simple component to test different Cloudinary URL formats
export default function CloudinaryTest() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const cloudName = 'dkyvp47ua'

  // Test several different URL formats to see which one works
  const testUrls = [
    {
      name: 'Basic Format',
      url: `https://res.cloudinary.com/${cloudName}/image/upload/photography-portfolio/R00027822025.jpg`,
    },
    {
      name: 'With Public ID',
      url: `https://res.cloudinary.com/${cloudName}/image/upload/v1/photography-portfolio/street_select_2025/L1009491_og_2025.jpg`,
    },
    {
      name: 'Direct Asset ID',
      url: `https://res.cloudinary.com/${cloudName}/image/upload/681976813a53b5532430992bf53b8f88`,
    },
    {
      name: 'Sample Image',
      url: `https://res.cloudinary.com/${cloudName}/image/upload/sample`,
    },
  ]

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Cloudinary URL Test</h1>

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testUrls.map((test, index) => (
          <div key={index} className="border p-4 rounded">
            <h2 className="font-bold mb-2">{test.name}</h2>
            <p className="text-xs mb-2 break-all">{test.url}</p>
            <div className="relative h-48 bg-gray-200">
              <Image
                src={test.url}
                alt={`Test ${index + 1}`}
                fill
                style={{ objectFit: 'contain' }}
                unoptimized={true}
                onError={() => setErrorMessage(`Failed to load: ${test.name}`)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
