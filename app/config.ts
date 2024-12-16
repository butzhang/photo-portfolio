export const metaData = {
  baseUrl: 'https://nextfolio-template.vercel.app/',
  title: 'Ke Zhang',
  name: 'Ke Zhang',
  ogImage: '/opengraph-image.png',
  description:
    'A clean, fast, and lightweight portfolio template built with Next.js, Vercel, and Tailwind CSS for optimal performance.',
}

interface SocialLinks {
  twitter?: string
  instagram?: string
  linkedin?: string
  email?: string
  github?: string
}

export const socialLinks: SocialLinks = {
  // twitter: 'https://x.com/1tssirius',
  // github: 'https://github.com/1msirius/Nextfolio',
  instagram: 'https://www.instagram.com/_kkkkk_zhang/',
  // linkedin: 'https://www.linkedin.com/',
  email: 'mailto:ke.zhang.rock@gmail.com',
}

// app/config/projects.ts
// config/projects.ts
// config/projects.ts
export const projects = [
  {
    title: 'divided by (on going)',
    project_folder: 'divided_by',
    imageOrder: ['light.jpg', 'XPR34717_sm_web_use.jpg', 'car.jpg'],
    excludes: ['_1000852_sm_web_use.jpg'], // These won't show even if they exist
  },
  {
    title: 'reflections on reality (on going)',
    project_folder: 'reflections_on_reality',
    imageOrder: [
      '_1001206_sm_web_use.jpg',
      '_1001650_sm_web_use.jpg',
      'L1001625_sm_web_use.jpg',
    ],
    excludes: [], // Example exclusion
  },
  {
    title: 'street select work  (on going)',
    project_folder: 'street_select',
    imageOrder: [
      '_1020965_sm_web_use.jpg',
      'L1010783_sm_web_use.jpg',
      'DSCF7723_sm_web_use.jpg',
    ],
    excludes: [],
  },
  // add more projects as needed
]
