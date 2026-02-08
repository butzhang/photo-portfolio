'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

interface ImageItem {
  src: string
  width: number
  height: number
  title: string | null
  link: string
}

interface CarouselClientProps {
  images: ImageItem[]
  autoScroll?: boolean // Optionally control whether to auto-scroll
  interval?: number // How often to change images, in ms
}

export default function CarouselClient({
  images,
  interval = 5000,
}: CarouselClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-scroll logic: move to next image every 'interval' ms
  useEffect(() => {
    if (images.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, interval)

    return () => clearInterval(timer)
  }, [images.length, interval])

  const { src, width, height, title, link } = images[currentIndex]
  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full max-w-[1300px] flex items-center justify-center mt-12">
        <Link href={link}>
          <img
            src={src}
            alt={title || `Portfolio image ${currentIndex + 1}`}
            width={width}
            height={height}
            className="max-h-[68vh] max-w-full object-contain transition-opacity duration-500 cursor-pointer"
          />
        </Link>
      </div>

      {/* Dots navigation */}
      {images.length > 1 && (
        <div className="mt-4 flex justify-center">
          <div className="flex items-center gap-2 rounded-full px-2 py-1">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2.5 w-2.5 rounded-full transition-all ${
                  i === currentIndex
                    ? 'bg-neutral-900 dark:bg-neutral-100'
                    : 'bg-neutral-300 dark:bg-neutral-600'
                }`}
                aria-label={`Go to image ${i + 1}`}
              ></button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
