# Photo Manifest + Cloudinary Design

Date: 2026-02-07

## Goals

- Keep the current elegant layout while removing runtime dependence on `public/photos`.
- Make folders under `public/photos` the source of truth for albums.
- Enable a simple workflow: organize folders → run one script → deploy.
- Keep costs low and infra control high (no build-time API calls).

## Architecture

- Local originals remain in `public/photos` for backup and source of truth.
- A single script (`scripts/upload-and-manifest.js`) scans local folders, uploads images to Cloudinary, and generates a manifest JSON.
- The app reads the manifest in server components and renders the homepage carousel and project pages with Cloudinary URLs and local dimensions.
- No Cloudinary API calls in production runtime or build; the manifest is the contract.

## Data Flow

1. Script scans `public/photos/**` for images.
2. For each image:
   - Compute dimensions with `image-size`.
   - Upload to Cloudinary with a public ID that preserves folder path: `photography-portfolio/<album>/<filename>`.
   - Generate URL: `https://res.cloudinary.com/<cloud>/image/upload/photography-portfolio/<album>/<filename>`.
3. Script writes `content/photos.manifest.json` (or similar) with albums, URLs, and dimensions.
4. Server components read manifest and render pages without accessing the filesystem.

## Manifest Schema

```
{
  "generatedAt": "2026-02-07T22:15:00.000Z",
  "cloudName": "your_cloud_name",
  "rootFolder": "photography-portfolio",
  "albums": [
    {
      "slug": "sf_trail",
      "title": "SF Trail",
      "subtitle": "Optional text…",
      "images": [
        {
          "filename": "R0001368_small.jpg",
          "width": 2400,
          "height": 1600,
          "url": "https://res.cloudinary.com/.../photography-portfolio/sf_trail/R0001368_small.jpg"
        }
      ]
    }
  ]
}
```

## Album Rules

- Each folder under `public/photos` becomes an album `slug`.
- Images are ordered alphabetically by filename unless overridden.
- If `app/config.ts` contains a matching project entry, merge:
  - `title`, `subtitle`, `imageOrder`, `excludes`.
- If no config entry exists, derive a title from the slug and leave subtitle empty.

## Error Handling

- If manifest is missing or empty, fail with a clear error and instruction to run the upload script.
- Upload script should log per-file status (uploaded/skipped/failed) and only write manifest after a successful scan.
- Uploads should be idempotent by public ID, with an option to force re-upload.

## Migration Steps

1. Add `scripts/upload-and-manifest.js`.
2. Generate and commit manifest.
3. Update homepage and project pages to read the manifest instead of filesystem access.
4. Remove Cloudinary mapping/fallback logic that relies on local paths at runtime.
5. Keep `public/photos` locally for backups; optionally gitignore large originals if not needed in the repo.

## Testing/Verification

- Run the upload script and confirm manifest contains expected albums and URLs.
- Load homepage and one project page; verify layout parity and image rendering.
- Spot-check a few Cloudinary URLs to ensure folder paths are preserved.
