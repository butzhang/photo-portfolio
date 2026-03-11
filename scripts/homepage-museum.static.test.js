const fs = require('fs')

const page = fs.readFileSync('app/page.tsx', 'utf8')
const carousel = fs.readFileSync('app/components/CarouselClient.tsx', 'utf8')
const globalCss = fs.readFileSync('app/global.css', 'utf8')

if (page.includes('home-museum')) {
  throw new Error(
    'homepage should not use home-museum wrapper in no-frame mode',
  )
}

if (!carousel.includes('tabular-nums')) {
  throw new Error('carousel is missing museum-style index counter')
}

if (!carousel.includes('tracking-[0.22em]')) {
  throw new Error('carousel is missing editorial title treatment')
}

if (!carousel.includes('h-1 rounded-full')) {
  throw new Error('carousel is missing bar-style dot indicators')
}

if (globalCss.includes('body:has(.home-museum)')) {
  throw new Error('global css still contains home-museum full-page styling')
}

if (carousel.includes('bg-[#ebe6db]')) {
  throw new Error('carousel still has framed panel background in no-frame mode')
}

console.log('homepage museum static test passed')
