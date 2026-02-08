function normalizeSegment(value) {
  return value
    .replace(/ /g, '_')
    .replace(/\(/g, '')
    .replace(/\)/g, '')
    .replace(/\[/g, '')
    .replace(/\]/g, '')
    .replace(/'/g, '')
    .replace(/"/g, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
}

function buildPublicId(rootFolder, albumSlug, filename) {
  const nameWithoutExt = filename.replace(/\.[^.]+$/i, '')
  const normalizedName = normalizeSegment(nameWithoutExt)
  return `${rootFolder}/${albumSlug}/${normalizedName}`
}

function buildCloudinaryUrl(cloudName, rootFolder, albumSlug, filename) {
  const extMatch = filename.match(/\.[^.]+$/i)
  const ext = extMatch ? extMatch[0] : ''
  const publicId = buildPublicId(rootFolder, albumSlug, filename)
  return `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}${ext}`
}

function deriveTitleFromSlug(slug) {
  return slug
    .split('_')
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : part))
    .join(' ')
}

module.exports = {
  normalizeSegment,
  buildPublicId,
  buildCloudinaryUrl,
  deriveTitleFromSlug,
}
