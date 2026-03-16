const fs = require('fs')

const config = fs.readFileSync('app/config.ts', 'utf8')
const page = fs.readFileSync('app/projects/[project]/page.tsx', 'utf8')
const manifest = JSON.parse(
  fs.readFileSync('content/photos.manifest.json', 'utf8'),
)

if (!config.includes("project_folder: 'come_muted_2026'")) {
  throw new Error('Come Muted 2026 slug is missing in config')
}
if (!config.includes('sections: [')) {
  throw new Error('Come Muted 2026 sections config is missing')
}
if (!config.includes("title: 'Come Unmuted'")) {
  throw new Error('Come Unmuted section title is missing in config')
}
if (!config.includes("title: 'Come Muted'")) {
  throw new Error('Come Muted section title is missing in config')
}
if (!config.includes("'DSCF3535_scale_down_65.jpg'")) {
  throw new Error('DSCF3535_scale_down_65.jpg missing from config sections')
}
if (!config.includes("'DSCF3539_scale_down_65.jpg'")) {
  throw new Error('DSCF3539_scale_down_65.jpg missing from config sections')
}
if (!config.includes("'R0008230_scale_down_65.jpg'")) {
  throw new Error('R0008230_scale_down_65.jpg missing from config sections')
}
if (!config.includes("'DSCF3374.jpg'")) {
  throw new Error('DSCF3374.jpg missing from config sections')
}
if (!config.includes("'DSCF3616.jpg'")) {
  throw new Error('DSCF3616.jpg missing from config sections')
}
if (!page.includes('album.sections')) {
  throw new Error('project page does not render album sections')
}

const album = manifest.albums.find((item) => item.slug === 'come_muted_2026')
if (!album) {
  throw new Error('come_muted_2026 album missing from manifest')
}
if (
  !album.images.some((item) => item.filename === 'DSCF3535_scale_down_65.jpg')
) {
  throw new Error('DSCF3535_scale_down_65.jpg missing from manifest album')
}
if (
  !album.images.some((item) => item.filename === 'DSCF3539_scale_down_65.jpg')
) {
  throw new Error('DSCF3539_scale_down_65.jpg missing from manifest album')
}
if (
  !album.images.some((item) => item.filename === 'R0008230_scale_down_65.jpg')
) {
  throw new Error('R0008230_scale_down_65.jpg missing from manifest album')
}
if (!album.images.some((item) => item.filename === 'DSCF3374.jpg')) {
  throw new Error('DSCF3374.jpg missing from manifest album')
}
if (!album.images.some((item) => item.filename === 'DSCF3616.jpg')) {
  throw new Error('DSCF3616.jpg missing from manifest album')
}

console.log('come muted sections test passed')
