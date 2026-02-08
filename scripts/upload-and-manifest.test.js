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
