import manifestData from '../../content/photos.manifest.json'
import { projects } from '../config'

export interface ManifestImage {
  filename: string
  width: number
  height: number
  url: string
}

export interface ManifestAlbum {
  slug: string
  title: string
  subtitle?: string | null
  images: ManifestImage[]
}

export interface PhotosManifest {
  generatedAt: string
  cloudName: string
  rootFolder: string
  albums: ManifestAlbum[]
}

interface ProjectConfig {
  title: string
  project_folder: string
  subtitle?: string
  imageOrder?: string[]
  excludes?: string[]
}

function deriveTitleFromSlug(slug: string) {
  return slug
    .split('_')
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : part))
    .join(' ')
}

function applyImageOrder(images: ManifestImage[], order: string[] = []) {
  if (order.length === 0) {
    return [...images].sort((a, b) => a.filename.localeCompare(b.filename))
  }

  const imageMap = new Map(images.map((image) => [image.filename, image]))
  const ordered = order.map((name) => imageMap.get(name)).filter(Boolean)
  const remaining = images
    .filter((image) => !order.includes(image.filename))
    .sort((a, b) => a.filename.localeCompare(b.filename))

  return [...ordered, ...remaining]
}

function applyProjectOverrides(album: ManifestAlbum, project?: ProjectConfig) {
  if (!project) {
    return {
      ...album,
      title: album.title || deriveTitleFromSlug(album.slug),
      subtitle: album.subtitle || '',
      images: [...album.images].sort((a, b) =>
        a.filename.localeCompare(b.filename),
      ),
    }
  }

  const excludes = project.excludes || []
  const filteredImages = album.images.filter(
    (image) => !excludes.includes(image.filename),
  )

  return {
    ...album,
    title: project.title || album.title || deriveTitleFromSlug(album.slug),
    subtitle: project.subtitle || album.subtitle || '',
    images: applyImageOrder(filteredImages, project.imageOrder || []),
  }
}

export function loadManifest() {
  return manifestData as PhotosManifest
}

export function getAlbumBySlug(manifest: PhotosManifest, slug: string) {
  const album = manifest.albums.find((item) => item.slug === slug)
  if (!album) {
    return null
  }
  const project = projects.find((item) => item.project_folder === slug)
  return applyProjectOverrides(album, project)
}

export function getAllAlbums(manifest: PhotosManifest) {
  return manifest.albums.map((album) => {
    const project = projects.find((item) => item.project_folder === album.slug)
    return applyProjectOverrides(album, project)
  })
}
