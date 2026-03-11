'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  useState,
  useEffect,
  useRef,
  type MouseEvent,
  type TouchEvent,
} from 'react'

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
  const touchStartXRef = useRef<number | null>(null)
  const touchStartYRef = useRef<number | null>(null)
  const didSwipeRef = useRef(false)
  const SWIPE_THRESHOLD_PX = 40

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const goToPrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length,
    )
  }

  // Auto-scroll logic: move to next image every 'interval' ms
  useEffect(() => {
    if (images.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, interval)

    return () => clearInterval(timer)
  }, [images.length, interval])

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if (images.length <= 1) {
      return
    }

    const touch = event.touches[0]
    touchStartXRef.current = touch.clientX
    touchStartYRef.current = touch.clientY
    didSwipeRef.current = false
  }

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (
      images.length <= 1 ||
      touchStartXRef.current === null ||
      touchStartYRef.current === null
    ) {
      return
    }

    const touch = event.changedTouches[0]
    const deltaX = touch.clientX - touchStartXRef.current
    const deltaY = touch.clientY - touchStartYRef.current

    if (
      Math.abs(deltaX) >= SWIPE_THRESHOLD_PX &&
      Math.abs(deltaX) > Math.abs(deltaY)
    ) {
      if (deltaX < 0) {
        goToNext()
      } else {
        goToPrevious()
      }
      didSwipeRef.current = true
    }

    touchStartXRef.current = null
    touchStartYRef.current = null
  }

  const handleTouchCancel = () => {
    touchStartXRef.current = null
    touchStartYRef.current = null
  }

  const handleImageClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!didSwipeRef.current) {
      return
    }
    event.preventDefault()
    didSwipeRef.current = false
  }

  const { src, width, height, title, link } = images[currentIndex]
  const currentLabel = String(currentIndex + 1).padStart(2, '0')
  const totalLabel = String(images.length).padStart(2, '0')

  return (
    <div
      className="w-full flex flex-col items-center pb-8 md:pb-10"
      style={{ touchAction: 'pan-y' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
    >
      <div className="relative w-full max-w-[1200px] mt-6 px-1 md:px-4">
        <Link href={link} onClick={handleImageClick} className="block">
          <Image
            src={src}
            alt={title || `Portfolio image ${currentIndex + 1}`}
            width={width}
            height={height}
            className="max-h-[72vh] max-w-full object-contain transition-opacity duration-500 cursor-pointer"
          />
        </Link>
      </div>

      <div className="w-full max-w-[1200px] px-1 md:px-4 mt-4">
        <div className="flex items-center justify-between pt-1">
          <p className="text-[11px] md:text-xs uppercase tracking-[0.22em] text-neutral-600 dark:text-neutral-300">
            {title || 'Untitled'}
          </p>
          <p className="text-[11px] md:text-xs tabular-nums text-neutral-500 dark:text-neutral-400">
            {currentLabel} / {totalLabel}
          </p>
        </div>
      </div>

      {/* Dots navigation */}
      {images.length > 1 && (
        <div className="mt-4 flex justify-center">
          <div className="flex items-center gap-1.5 rounded-full px-1 py-1">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-1 rounded-full transition-all ${
                  i === currentIndex
                    ? 'w-7 bg-neutral-900 dark:bg-neutral-100'
                    : 'w-2 bg-neutral-300 dark:bg-neutral-600'
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
