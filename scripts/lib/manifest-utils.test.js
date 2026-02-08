const assert = require('assert')
const {
  normalizeSegment,
  buildPublicId,
  buildCloudinaryUrl,
  deriveTitleFromSlug,
} = require('./manifest-utils')

assert.strictEqual(normalizeSegment('My Folder (2025)'), 'My_Folder_2025')
assert.strictEqual(
  buildPublicId('photography-portfolio', 'sf_trail', 'R0001368_small.jpg'),
  'photography-portfolio/sf_trail/R0001368_small',
)
assert.strictEqual(
  buildCloudinaryUrl(
    'demo',
    'photography-portfolio',
    'sf_trail',
    'R0001368_small.jpg',
  ),
  'https://res.cloudinary.com/demo/image/upload/photography-portfolio/sf_trail/R0001368_small.jpg',
)
assert.strictEqual(
  deriveTitleFromSlug('street_select_2025'),
  'Street Select 2025',
)
console.log('manifest-utils tests passed')
