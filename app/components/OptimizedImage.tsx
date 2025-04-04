'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Blurhash } from 'react-blurhash'

interface OptimizedImageProps {
  src: string
  alt: string
  width: number
  height: number
  blurHash?: string
  className?: string
  priority?: boolean
  sizes?: string
  loading?: 'lazy' | 'eager'
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  blurHash = 'LEHV6nWB2yk8pyo0adR*.7kCMdnj', // Default blurhash (light bluish placeholder)
  className = '',
  priority = false,
  sizes = '100vw',
  loading = 'lazy',
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)

  // We'll use width and height directly in the style

  return (
    <div
      className="relative overflow-hidden"
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      {/* BlurHash placeholder */}
      {!isLoaded && !isError && (
        <div className="absolute inset-0">
          <Blurhash
            hash={blurHash}
            width="100%"
            height="100%"
            resolutionX={32}
            resolutionY={32}
            punch={1}
          />
        </div>
      )}

      {/* Actual image */}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`${className} transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        priority={priority}
        sizes={sizes}
        loading={loading}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setIsError(true)
          setIsLoaded(true)
        }}
      />

      {/* Error state */}
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <span className="text-red-500">Failed to load image</span>
        </div>
      )}
    </div>
  )
}
