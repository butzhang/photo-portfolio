const fs = require('fs')

const content = fs.readFileSync('app/lib/photosManifest.ts', 'utf8')
if (!content.includes('export function loadManifest')) {
  throw new Error('photosManifest exports missing: loadManifest')
}
if (!content.includes('export function getAlbumBySlug')) {
  throw new Error('photosManifest exports missing: getAlbumBySlug')
}
console.log('photosManifest exports test passed')
