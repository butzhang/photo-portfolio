const fs = require('fs')
const paths = [
  'app/api/cloudinary-mapping/route.ts',
  'app/lib/cloudinary.ts',
  'app/lib/cloudinary.server.ts',
  'app/lib/cloudinaryLoader.server.tsx',
]
const stillThere = paths.filter((p) => fs.existsSync(p))
if (stillThere.length) {
  throw new Error(`Deprecated files still exist: ${stillThere.join(', ')}`)
}
console.log('deprecated cloudinary files removed')
