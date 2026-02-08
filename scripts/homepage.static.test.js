const fs = require('fs')
const content = fs.readFileSync('app/page.tsx', 'utf8')
if (
  content.includes('fetchCloudinaryMapping') ||
  content.includes('cloudinary')
) {
  throw new Error('homepage still uses cloudinary mapping')
}
console.log('homepage static test passed')
