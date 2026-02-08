'use client'

import { useState } from 'react'

export default function TestImage() {
  const [imageError, setImageError] = useState(false)
  const imagePath = '/photos/edge_of_city/R00027822025.jpg' // This file definitely exists

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Image Test Page</h1>

      {imageError && (
        <div className="p-4 bg-red-100 text-red-800 rounded mb-4">
          Image failed to load
        </div>
      )}

      <div className="border p-4 rounded mb-4">
        <h2 className="font-bold mb-2">Regular IMG tag</h2>
        <img
          src={imagePath}
          alt="Test image"
          className="max-w-full"
          onError={() => {
            console.error('Image load error with IMG tag')
            setImageError(true)
          }}
        />
      </div>

      <div className="mt-4">
        <p className="text-sm">Image path: {imagePath}</p>
      </div>
    </div>
  )
}
