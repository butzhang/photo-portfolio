'use client'

import Image from 'next/image'
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
  autoScroll = true,
  interval = 5000,
}: CarouselClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-scroll logic: move to next image every 'interval' ms
  useEffect(() => {
    if (!autoScroll || images.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, interval)

    return () => clearInterval(timer)
  }, [images.length, autoScroll, interval])

  const { src, width, height, title, link } = images[currentIndex]

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full max-w-7xl flex items-center justify-center mt-8">
        <Link href={link}>
          <Image
            src={src}
            alt={title || `Portfolio image ${currentIndex + 1}`}
            width={width}
            height={height}
            className="max-w-full h-auto transition-opacity duration-500 cursor-pointer"
            priority
          />
        </Link>
      </div>

      {/* Dots navigation */}
      {images.length > 1 && (
        <div className="flex space-x-2 mt-6">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full cursor-pointer ${
                i === currentIndex
                  ? 'bg-black dark:bg-white'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
              aria-label={`Go to image ${i + 1}`}
            ></button>
          ))}
        </div>
      )}
    </div>
  )
}
