'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getCloudinaryUrl, fetchCloudinaryMapping } from './lib/cloudinary'

export default function Page() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [imageUrls, setImageUrls] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  // Define local image paths - they will be converted to Cloudinary URLs using our mapping
  const images = [
    {
      localPath: '/photos/edge_of_city/R00027822025.jpg',
      alt: 'Edge of City',
      title: '',
      link: '/projects/edge_of_city',
    },
    {
      localPath: '/photos/sf_trail/R0001368_small.jpg',
      alt: 'SF Trail',
      title: '',
      link: '/projects/sf_trail',
    },
    {
      localPath: '/photos/sf_trail/R0001862_small-2.jpg',
      alt: 'SF Trail 2',
      title: '',
      link: '/projects/sf_trail',
    },
    {
      localPath: '/photos/street_select_2025/L1009491_og_2025.jpg',
      alt: 'Street Select',
      title: '',
      link: '/projects/street_select_2025',
    },
    {
      localPath: '/photos/divided_by/L1000529_small-small_version-2.jpg',
      alt: 'Divided By',
      title: '',
      link: '/projects/divided_by',
    },
    {
      localPath: '/photos/divided_by/light.jpg',
      alt: 'Light',
      title: null,
      link: '/projects/divided_by',
    },
    {
      localPath: '/photos/divided_by/car.jpg',
      alt: 'Car',
      title: null,
      link: '/projects/divided_by',
    },
    {
      localPath: '/photos/reflections_on_reality/L1011420 1_sm_web_use.jpg',
      alt: 'Reflections on Reality 1',
      title: null,
      link: '/projects/reflections_on_reality',
    },
    {
      localPath: '/photos/reflections_on_reality/_1001206_sm_web_use.jpg',
      alt: 'Reflections on Reality 2',
      title: null,
      link: '/projects/reflections_on_reality',
    },
  ]

  // Load Cloudinary mapping and process images
  useEffect(() => {
    async function loadImages() {
      try {
        setIsLoading(true)
        console.log('Fetching Cloudinary mapping...')
        const mappingData = await fetchCloudinaryMapping()
        console.log(
          'Mapping data received:',
          Object.keys(mappingData).length,
          'entries',
        )

        // Process each image to get the Cloudinary URL or fallback
        const processedImages = images.map((img) => {
          const cloudinaryUrl = getCloudinaryUrl(img.localPath)
          console.log(`Image ${img.localPath} → ${cloudinaryUrl}`)
          return {
            ...img,
            src: cloudinaryUrl,
          }
        })

        // Create a mapping for easy access
        const urlMap = {}
        processedImages.forEach((img) => {
          urlMap[img.localPath] = img.src
        })

        setImageUrls(urlMap)
        setIsLoading(false)
      } catch (error) {
        console.error('Error loading images:', error)
        setIsLoading(false)
      }
    }

    loadImages()
  }, [])

  // Auto-scroll logic
  useEffect(() => {
    if (images.length <= 1 || isLoading) return

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [images.length, isLoading])

  // Current image - with fallback to local path during loading
  const currentImage = images[currentIndex]
  const currentImageSrc =
    imageUrls[currentImage.localPath] || currentImage.localPath

  // Show loading placeholder during initial load
  if (isLoading) {
    return (
      <section
        className="w-full flex justify-center items-center"
        style={{ minHeight: '60vh' }}
      >
        <div className="text-gray-500">Loading gallery...</div>
      </section>
    )
  }

  // Force using Cloudinary URLs - don't use local fallbacks

  return (
    <section className="w-full relative">
      {/* Main carousel - uses full width */}
      <div className="w-full">
        <Link href={currentImage.link}>
          <img
            src={currentImageSrc}
            alt={currentImage.alt}
            className="w-full h-auto transition-opacity duration-500 cursor-pointer"
          />
        </Link>
      </div>

      {/* Navigation Dots - maintaining original styling */}
      <div className="flex space-x-2 mt-6 justify-center">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setCurrentIndex(i)
            }}
            className={`w-2 h-2 rounded-full cursor-pointer ${
              i === currentIndex
                ? 'bg-black dark:bg-white'
                : 'bg-gray-300 dark:bg-gray-600'
            }`}
            aria-label={`Go to image ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
