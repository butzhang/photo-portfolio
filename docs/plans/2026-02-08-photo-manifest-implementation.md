# Photo Manifest + Cloudinary Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace runtime filesystem image discovery with a generated Cloudinary-backed manifest so albums are built from local folders and rendered without local image dependencies.

**Architecture:** A single upload script scans `public/photos`, uploads to Cloudinary preserving folder paths, and writes `content/photos.manifest.json` with album/image metadata (url + dimensions). Server components read the manifest and merge project metadata from `app/config.ts` for titles, subtitles, excludes, and ordering. The homepage carousel and project pages render from this data only.

**Tech Stack:** Next.js App Router, Node.js scripts, Cloudinary SDK, `image-size`, TypeScript (server components).

---

### Task 1: Add manifest utilities (pure functions + tests)

**Files:**

- Create: `scripts/lib/manifest-utils.js`
- Create: `scripts/lib/manifest-utils.test.js`

**Step 1: Write the failing test**

```js
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
```

**Step 2: Run test to verify it fails**

Run: `node scripts/lib/manifest-utils.test.js`
Expected: FAIL with "Cannot find module './manifest-utils'".

**Step 3: Write minimal implementation**

```js
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
  const ext = filename.replace(/^.*(\.[^.]+)$/i, '$1')
  const nameWithoutExt = filename.replace(/\.[^.]+$/i, '')
  const normalizedName = normalizeSegment(nameWithoutExt)
  return `${rootFolder}/${albumSlug}/${normalizedName}`
}

function buildCloudinaryUrl(cloudName, rootFolder, albumSlug, filename) {
  const ext = filename.replace(/^.*(\.[^.]+)$/i, '$1')
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
```

**Step 4: Run test to verify it passes**

Run: `node scripts/lib/manifest-utils.test.js`
Expected: `manifest-utils tests passed`.

**Step 5: Commit**

```bash
git add scripts/lib/manifest-utils.js scripts/lib/manifest-utils.test.js
git commit -m "feat: add manifest utility helpers"
```

---

### Task 2: Add combined upload + manifest script

**Files:**

- Create: `scripts/upload-and-manifest.js`
- Modify: `package.json`
- Modify: `CLOUDINARY_SETUP.md`

**Step 1: Write the failing test**

Add a small smoke test that ensures the script prints a clear error when credentials are missing.

```js
const { spawnSync } = require('child_process')

const result = spawnSync('node', ['scripts/upload-and-manifest.js'], {
  env: {
    ...process.env,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: '',
    CLOUDINARY_API_KEY: '',
    CLOUDINARY_API_SECRET: '',
  },
  encoding: 'utf8',
})

if (!result.stdout.includes('Cloudinary credentials not found')) {
  throw new Error('Expected missing-credentials message')
}

console.log('upload-and-manifest missing-credentials test passed')
```

Save as `scripts/upload-and-manifest.test.js`.

**Step 2: Run test to verify it fails**

Run: `node scripts/upload-and-manifest.test.js`
Expected: FAIL with "Cannot find module 'scripts/upload-and-manifest.js'".

**Step 3: Write minimal implementation**

Create `scripts/upload-and-manifest.js` that:

- Loads `.env`
- Validates Cloudinary credentials
- Scans `public/photos` for images
- Uploads each image with public ID `photography-portfolio/<album>/<normalized-name>`
- Computes width/height using `image-size`
- Writes manifest JSON to `content/photos.manifest.json`

Important implementation details:

- Use `buildPublicId` and `buildCloudinaryUrl` from `scripts/lib/manifest-utils.js`
- Preserve folder path based on `public/photos/<album>`
- Always write a complete manifest (overwrite)
- Log totals (albums/images)

**Step 4: Run test to verify it passes**

Run: `node scripts/upload-and-manifest.test.js`
Expected: `upload-and-manifest missing-credentials test passed`.

**Step 5: Update docs/scripts**

- Add a `upload-and-manifest` script to `package.json`:
  ```json
  "upload-and-manifest": "node scripts/upload-and-manifest.js"
  ```
- Update `CLOUDINARY_SETUP.md` to reference the new script and manifest.

**Step 6: Commit**

```bash
git add scripts/upload-and-manifest.js scripts/upload-and-manifest.test.js package.json CLOUDINARY_SETUP.md
git commit -m "feat: add Cloudinary upload + manifest generator"
```

---

### Task 3: Add manifest loader + album helpers in app

**Files:**

- Create: `app/lib/photosManifest.ts`
- Modify: `app/config.ts`

**Step 1: Write the failing test**

Create a static test that ensures the helper exists and exports expected function names:

```js
const fs = require('fs')
const content = fs.readFileSync('app/lib/photosManifest.ts', 'utf8')
if (
  !content.includes('export function loadManifest') ||
  !content.includes('export function getAlbumBySlug')
) {
  throw new Error('photosManifest exports missing')
}
console.log('photosManifest exports test passed')
```

Save as `scripts/photos-manifest.test.js`.

**Step 2: Run test to verify it fails**

Run: `node scripts/photos-manifest.test.js`
Expected: FAIL with "ENOENT" or "photosManifest exports missing".

**Step 3: Write minimal implementation**

`app/lib/photosManifest.ts` should:

- Import `content/photos.manifest.json` (JSON module)
- Merge metadata from `projects` (`title`, `subtitle`, `imageOrder`, `excludes`)
- Provide helpers:
  - `loadManifest()`
  - `getAlbumBySlug(manifest, slug)` (returns album with ordered images)
  - `getAllAlbums(manifest)`

Also ensure ordering:

- Apply `excludes`
- Apply `imageOrder` (ordered list first, then remaining sorted)

**Step 4: Run test to verify it passes**

Run: `node scripts/photos-manifest.test.js`
Expected: `photosManifest tests passed`.

**Step 5: Commit**

```bash
git add app/lib/photosManifest.ts scripts/photos-manifest.test.js
git commit -m "feat: add manifest loader and album helpers"
```

---

### Task 4: Update project pages to use manifest data

**Files:**

- Modify: `app/projects/[project]/page.tsx`

**Step 1: Write a failing test**

Add a simple static check (node) that ensures `page.tsx` no longer imports `fs`, `path`, or `image-size`:

```js
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
```

Save as `scripts/project-page.static.test.js`.

**Step 2: Run test to verify it fails**

Run: `node scripts/project-page.static.test.js`
Expected: FAIL with "page.tsx still depends on filesystem".

**Step 3: Implement change**

- Replace filesystem scanning with `loadManifest()` and `getAlbumBySlug()`.
- Use `album.images` for rendering, with `url`, `width`, `height`, `filename`.
- Keep portrait class logic using `width/height`.

**Step 4: Run test to verify it passes**

Run: `node scripts/project-page.static.test.js`
Expected: `project page static test passed`.

**Step 5: Commit**

```bash
git add app/projects/[project]/page.tsx scripts/project-page.static.test.js
git commit -m "refactor: project pages use manifest data"
```

---

### Task 5: Update homepage carousel to use manifest data

**Files:**

- Modify: `app/page.tsx`
- Modify: `app/components/CarouselClient.tsx`

**Step 1: Write a failing test**

Add a static check that the homepage no longer uses `fetchCloudinaryMapping`:

```js
const fs = require('fs')
const content = fs.readFileSync('app/page.tsx', 'utf8')
if (
  content.includes('fetchCloudinaryMapping') ||
  content.includes('cloudinary')
) {
  throw new Error('homepage still uses cloudinary mapping')
}
console.log('homepage static test passed')
```

Save as `scripts/homepage.static.test.js`.

**Step 2: Run test to verify it fails**

Run: `node scripts/homepage.static.test.js`
Expected: FAIL with "homepage still uses cloudinary mapping".

**Step 3: Implement change**

- Convert homepage to server component (remove `use client`).
- Load manifest + select a curated list of images for carousel (e.g., first image from each album, or a list defined in config).
- Pass array to `CarouselClient`.
- In `CarouselClient`, remove invalid `<img>` props (`priority`, `quality`).

**Step 4: Run test to verify it passes**

Run: `node scripts/homepage.static.test.js`
Expected: `homepage static test passed`.

**Step 5: Commit**

```bash
git add app/page.tsx app/components/CarouselClient.tsx scripts/homepage.static.test.js
git commit -m "refactor: homepage carousel uses manifest data"
```

---

### Task 6: Remove deprecated Cloudinary mapping plumbing

**Files:**

- Delete: `app/api/cloudinary-mapping/route.ts`
- Delete: `app/lib/cloudinary.ts`
- Delete: `app/lib/cloudinary.server.ts`
- Delete: `app/lib/cloudinaryLoader.server.tsx`
- Delete: `cloudinary-mapping.json` (if committed)
- Modify: `scripts/generate-cloudinary-map.js` (remove or deprecate)
- Modify: `scripts/switch-to-cloudinary.js` (remove or deprecate)

**Step 1: Write failing test**

Add a static check that these files no longer exist (or contain deprecation notices):

```js
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
```

Save as `scripts/cloudinary-deprecations.test.js`.

**Step 2: Run test to verify it fails**

Run: `node scripts/cloudinary-deprecations.test.js`
Expected: FAIL with deprecated file list.

**Step 3: Implement change**

- Remove mapping files and route.
- Remove obsolete scripts or replace contents with deprecation messages.

**Step 4: Run test to verify it passes**

Run: `node scripts/cloudinary-deprecations.test.js`
Expected: `deprecated cloudinary files removed`.

**Step 5: Commit**

```bash
git add app/api/cloudinary-mapping/route.ts app/lib/cloudinary.ts app/lib/cloudinary.server.ts app/lib/cloudinaryLoader.server.tsx scripts/generate-cloudinary-map.js scripts/switch-to-cloudinary.js scripts/cloudinary-deprecations.test.js
git commit -m "chore: remove cloudinary mapping plumbing"
```

---

### Task 7: Final verification

**Step 1: Run manifest helper tests**

Run: `node scripts/lib/manifest-utils.test.js`
Expected: pass.

**Step 2: Run upload script missing-credentials test**

Run: `node scripts/upload-and-manifest.test.js`
Expected: pass.

**Step 3: Run static checks**

Run:

- `node scripts/project-page.static.test.js`
- `node scripts/homepage.static.test.js`
- `node scripts/cloudinary-deprecations.test.js`
  Expected: all pass.

**Step 4: Commit any final adjustments**

```bash
git add -A
git commit -m "test: finalize manifest migration"
```
