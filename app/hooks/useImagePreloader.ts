'use client'

import { useEffect, useState } from 'react'

// This hook will preload a list of images
export default function useImagePreloader(imageSrcs: string[]) {
  const [imagesPreloaded, setImagesPreloaded] = useState<
    Record<string, boolean>
  >({})

  useEffect(() => {
    // Skip if no images or if already preloaded
    if (!imageSrcs || imageSrcs.length === 0) return

    // Create a copy of the current state
    const newPreloadedState = { ...imagesPreloaded }

    // Preload each image that hasn't been loaded yet
    imageSrcs.forEach((src) => {
      // Skip if already preloaded
      if (newPreloadedState[src]) return

      const img = new Image()

      img.onload = () => {
        // Update state when image is loaded
        setImagesPreloaded((prev) => ({
          ...prev,
          [src]: true,
        }))
      }

      img.onerror = () => {
        // Mark as loaded even on error to avoid repeated attempts
        setImagesPreloaded((prev) => ({
          ...prev,
          [src]: true,
        }))
        console.error(`Failed to preload image: ${src}`)
      }

      // Start loading
      img.src = src
    })
  }, [imageSrcs])

  return imagesPreloaded
}
