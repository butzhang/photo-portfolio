import manifestData from '../../content/photos.manifest.json'
import { projects } from '../config'

export interface ManifestImage {
  filename: string
  width: number
  height: number
  url: string
}

export interface ManifestSection {
  title: string
  subtitle?: string | null
  images: ManifestImage[]
}

export interface ManifestAlbum {
  slug: string
  title: string
  subtitle?: string | null
  sections?: ManifestSection[]
  images: ManifestImage[]
}

export interface PhotosManifest {
  generatedAt: string
  cloudName: string
  rootFolder: string
  albums: ManifestAlbum[]
}

interface ProjectSectionConfig {
  title: string
  subtitle?: string
  imageOrder?: string[]
}

interface ProjectConfig {
  title: string
  project_folder: string
  subtitle?: string
  imageOrder?: string[]
  sections?: ProjectSectionConfig[]
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
  const ordered = order
    .map((name) => imageMap.get(name))
    .filter((image): image is ManifestImage => Boolean(image))
  const remaining = images
    .filter((image) => !order.includes(image.filename))
    .sort((a, b) => a.filename.localeCompare(b.filename))

  return [...ordered, ...remaining]
}

function applySections(
  images: ManifestImage[],
  sections: ProjectSectionConfig[] = [],
) {
  const imageMap = new Map(images.map((image) => [image.filename, image]))
  const used = new Set<string>()

  const normalizedSections: ManifestSection[] = sections
    .map((section) => {
      const uniqueImages: ManifestImage[] = []
      for (const filename of section.imageOrder || []) {
        const image = imageMap.get(filename)
        if (!image || used.has(filename)) {
          continue
        }
        used.add(filename)
        uniqueImages.push(image)
      }

      return {
        title: section.title,
        subtitle: section.subtitle || '',
        images: uniqueImages,
      }
    })
    .filter((section) => section.images.length > 0)

  const unassigned = images.filter((image) => !used.has(image.filename))
  if (unassigned.length > 0) {
    if (normalizedSections.length === 0) {
      normalizedSections.push({
        title: sections[0]?.title || 'Images',
        subtitle: sections[0]?.subtitle || '',
        images: [...unassigned],
      })
    } else {
      normalizedSections[0] = {
        ...normalizedSections[0],
        images: [...normalizedSections[0].images, ...unassigned],
      }
    }
  }

  return {
    sections: normalizedSections,
    images: normalizedSections.flatMap((section) => section.images),
  }
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
  const orderedImages = applyImageOrder(
    filteredImages,
    project.imageOrder || [],
  )
  const hasSections = (project.sections || []).length > 0

  const overriddenAlbum: ManifestAlbum = {
    ...album,
    title: project.title || album.title || deriveTitleFromSlug(album.slug),
    subtitle: project.subtitle || album.subtitle || '',
    images: orderedImages,
  }

  if (!hasSections) {
    return overriddenAlbum
  }

  const sectionData = applySections(orderedImages, project.sections || [])
  return {
    ...overriddenAlbum,
    sections: sectionData.sections,
    images: sectionData.images,
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
