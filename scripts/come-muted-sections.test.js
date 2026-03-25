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
if (!config.includes("'R0008409 2.jpg'")) {
  throw new Error('R0008409 2.jpg missing from config sections')
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
if (!config.includes("'DSC_2303.JPG'")) {
  throw new Error('DSC_2303.JPG missing from config sections')
}
if (!config.includes("'DSC_2530.JPG'")) {
  throw new Error('DSC_2530.JPG missing from config sections')
}
if (!config.includes("'DSC_2577.jpg'")) {
  throw new Error('DSC_2577.jpg missing from config sections')
}
if (!config.includes("'DSC_2582.jpg'")) {
  throw new Error('DSC_2582.jpg missing from config sections')
}
if (!config.includes("'DSC_2598 1.JPG'")) {
  throw new Error('DSC_2598 1.JPG missing from config sections')
}
if (!config.includes("'DSCF3635.jpg'")) {
  throw new Error('DSCF3635.jpg missing from archive config')
}
if (!page.includes('album.sections')) {
  throw new Error('project page does not render album sections')
}

const mutedSectionBlock =
  config.match(
    /title: 'Come Muted'[\s\S]*?imageOrder: \[([\s\S]*?)\],\n\s*}/,
  )?.[1] || ''
if (!mutedSectionBlock.includes("'DSC_2598 1.JPG'")) {
  throw new Error('DSC_2598 1.JPG should be in Come Muted section')
}
if (!mutedSectionBlock.includes("'R0008409 2.jpg'")) {
  throw new Error('R0008409 2.jpg should be in Come Muted section')
}

const unmutedSectionBlock =
  config.match(
    /title: 'Come Unmuted'[\s\S]*?imageOrder: \[([\s\S]*?)\],\n\s*},\n\s*],/,
  )?.[1] || ''
for (const filename of [
  "'DSC_2303.JPG'",
  "'DSC_2530.JPG'",
  "'DSC_2577.jpg'",
  "'DSC_2582.jpg'",
]) {
  if (!unmutedSectionBlock.includes(filename)) {
    throw new Error(`${filename} should be in Come Unmuted section`)
  }
}

const archiveBlock =
  config.match(
    /title: '2025-2026 Archive'[\s\S]*?imageOrder: \[([\s\S]*?)\]/,
  )?.[1] || ''
if (!archiveBlock.includes("'DSCF3635.jpg'")) {
  throw new Error('DSCF3635.jpg should be in 2025-2026 Archive imageOrder')
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
if (!album.images.some((item) => item.filename === 'R0008409 2.jpg')) {
  throw new Error('R0008409 2.jpg missing from manifest album')
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
if (!album.images.some((item) => item.filename === 'DSC_2303.JPG')) {
  throw new Error('DSC_2303.JPG missing from manifest album')
}
if (!album.images.some((item) => item.filename === 'DSC_2530.JPG')) {
  throw new Error('DSC_2530.JPG missing from manifest album')
}
if (!album.images.some((item) => item.filename === 'DSC_2577.jpg')) {
  throw new Error('DSC_2577.jpg missing from manifest album')
}
if (!album.images.some((item) => item.filename === 'DSC_2582.jpg')) {
  throw new Error('DSC_2582.jpg missing from manifest album')
}
if (!album.images.some((item) => item.filename === 'DSC_2598 1.JPG')) {
  throw new Error('DSC_2598 1.JPG missing from manifest album')
}

const archiveAlbum = manifest.albums.find(
  (item) => item.slug === '2025-2026_archive',
)
if (!archiveAlbum) {
  throw new Error('2025-2026_archive album missing from manifest')
}
if (!archiveAlbum.images.some((item) => item.filename === 'DSCF3635.jpg')) {
  throw new Error('DSCF3635.jpg missing from 2025-2026_archive manifest album')
}

console.log('come muted sections test passed')
