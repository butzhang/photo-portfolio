const fs = require('fs')

function read(path) {
  return fs.readFileSync(path, 'utf8')
}

function assertNoMatch(content, pattern, message) {
  if (pattern.test(content)) {
    throw new Error(message)
  }
}

const config = read('app/config.ts')
assertNoMatch(
  config,
  /nextfolio-template\.vercel\.app/i,
  'config still points to Nextfolio template domain',
)
assertNoMatch(
  config,
  /Something about his story/i,
  'config still uses placeholder site description',
)
assertNoMatch(
  config,
  /project_folder:\s*'on_my_way_to_office_2026'/,
  'Come Muted 2026 still uses legacy public slug on_my_way_to_office_2026',
)
if (!/project_folder:\s*'come_muted_2026'/.test(config)) {
  throw new Error(
    'Come Muted 2026 should use project_folder slug come_muted_2026',
  )
}

const blogIndex = read('app/blog/page.tsx')
assertNoMatch(
  blogIndex,
  /Nextfolio Blog/i,
  'blog metadata still uses template text',
)

const photosPage = read('app/photos/page.tsx')
assertNoMatch(
  photosPage,
  /unsplash\.com/i,
  'photos page still contains starter Unsplash links',
)
assertNoMatch(
  photosPage,
  /\/photos\/photo1\.jpg/i,
  'photos page still contains starter placeholder images',
)

if (fs.existsSync('app/page.tsx.bak')) {
  throw new Error('template backup file app/page.tsx.bak should be removed')
}

if (fs.existsSync('app/projects/project-data.tsx')) {
  throw new Error(
    'template project placeholder file app/projects/project-data.tsx should be removed',
  )
}

if (fs.existsSync('content/getting-started.mdx')) {
  throw new Error(
    'template starter post content/getting-started.mdx should be removed',
  )
}

if (fs.existsSync('content/custom-mdx-examples.mdx')) {
  throw new Error(
    'template starter post content/custom-mdx-examples.mdx should be removed',
  )
}

console.log('template cleanup regression test passed')
