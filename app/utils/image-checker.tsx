'use client'

import { useState, useEffect } from 'react'

// A hook to test if a URL is valid
export function useImageUrlChecker(url: string) {
  const [status, setStatus] = useState<'loading' | 'valid' | 'invalid'>(
    'loading',
  )
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!url) {
      setStatus('invalid')
      setErrorMessage('No URL provided')
      return
    }

    setStatus('loading')
    setErrorMessage(null)

    const img = new Image()

    img.onload = () => {
      setStatus('valid')
    }

    img.onerror = (e) => {
      console.error('Image load error:', e)
      setStatus('invalid')
      setErrorMessage(`Failed to load: ${url}`)
    }

    img.src = url

    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [url])

  return { status, errorMessage }
}

// A component to display a URL check result
export function ImageUrlCheck({ url, name }: { url: string; name: string }) {
  const { status, errorMessage } = useImageUrlChecker(url)

  return (
    <div className="border p-4 mb-4 rounded">
      <h3 className="font-bold">{name}</h3>
      <div className="text-xs mt-1 mb-2 break-all">{url}</div>

      <div
        className={`
        px-3 py-1 text-sm rounded-full inline-block
        ${status === 'loading' ? 'bg-yellow-100 text-yellow-800' : ''}
        ${status === 'valid' ? 'bg-green-100 text-green-800' : ''}
        ${status === 'invalid' ? 'bg-red-100 text-red-800' : ''}
      `}
      >
        {status === 'loading'
          ? 'Checking...'
          : status === 'valid'
            ? 'URL is valid'
            : `URL is invalid: ${errorMessage || 'Unknown error'}`}
      </div>
    </div>
  )
}
