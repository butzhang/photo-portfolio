const fs = require('fs')

const content = fs.readFileSync('app/components/CarouselClient.tsx', 'utf8')

if (!content.includes('onTouchStart')) {
  throw new Error('carousel is missing onTouchStart handler for mobile swipe')
}

if (!content.includes('onTouchEnd')) {
  throw new Error('carousel is missing onTouchEnd handler for mobile swipe')
}

if (!content.includes('goToNext') || !content.includes('goToPrevious')) {
  throw new Error('carousel swipe navigation helpers are missing')
}

console.log('carousel swipe static test passed')
