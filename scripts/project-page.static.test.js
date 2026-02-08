const fs = require('fs')
const content = fs.readFileSync('app/projects/[project]/page.tsx', 'utf8')
if (
  content.includes("from 'fs'") ||
  content.includes("from 'path'") ||
  content.includes('image-size')
) {
  throw new Error('page.tsx still depends on filesystem')
}
console.log('project page static test passed')
