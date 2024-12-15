'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'

interface ImageItem {
  src: string
  width: number
  height: number
  title: string | null
}

export default function CarouselClient({ images }: { images: ImageItem[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Optional auto-scroll: uncomment to enable
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [images.length])

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const { src, width, height, title } = images[currentIndex]

  return (
    <div className="w-full flex flex-col items-center relative">
      {title && (
        <p className="text-sm font-light mb-2 max-w-md text-center leading-relaxed mt-4">
          {title}
        </p>
      )}
      <div className="relative w-full flex items-center justify-center mt-8 overflow-hidden">
        <div className="relative">
          <Image
            src={src}
            alt={title || `Portfolio image ${currentIndex + 1}`}
            width={width}
            height={height}
            className="max-w-full h-auto transition-opacity duration-500"
            priority
          />
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-[-3rem] p-3 bg-white/70 dark:bg-black/50 hover:bg-white dark:hover:bg-black text-black dark:text-white transition-colors duration-300"
                style={{ top: '50%', transform: 'translateY(-50%)' }}
                aria-label="Previous image"
              >
                &larr;
              </button>
              <button
                onClick={handleNext}
                className="absolute right-[-3rem] p-3 bg-white/70 dark:bg-black/50 hover:bg-white dark:hover:bg-black text-black dark:text-white transition-colors duration-300"
                style={{ top: '50%', transform: 'translateY(-50%)' }}
                aria-label="Next image"
              >
                &rarr;
              </button>
            </>
          )}
        </div>
      </div>

      {images.length > 1 && (
        <div className="flex space-x-2 mt-6">
          {images.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full cursor-pointer ${
                i === currentIndex
                  ? 'bg-black dark:bg-white'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
              onClick={() => setCurrentIndex(i)}
              aria-label={`Go to image ${i + 1}`}
            ></div>
          ))}
        </div>
      )}
    </div>
  )
}
