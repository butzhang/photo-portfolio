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
    title: 'Divided By 2024 (on going)',
    project_folder: 'divided_by',
    subtitle: ' ',
    imageOrder: ['light.jpg', 'XPR34717_sm_web_use.jpg', 'car.jpg'],
    excludes: ['_1000852_sm_web_use.jpg'], // These won't show even if they exist
  },
  {
    title: 'Reflections on Reality 2024 (on going)',
    project_folder: 'reflections_on_reality',
    subtitle: ' ',
    imageOrder: [
      '_1001206_sm_web_use.jpg',
      '_1001650_sm_web_use.jpg',
      'L1001625_sm_web_use.jpg',
    ],
    excludes: [], // Example exclusion
  },
  {
    title: 'Street Select Work 2024 (on going)',
    subtitle: ' ',
    project_folder: 'street_select',
    imageOrder: [
      '_1020965_sm_web_use.jpg',
      'L1010783_sm_web_use.jpg',
      'DSCF7723_sm_web_use.jpg',
    ],
    excludes: [],
  },
  {
    title: 'Home or not 2015',
    project_folder: 'hometown_2015',
    subtitle:
      '一直以来对于家乡始终有一种难以形容，若即若离的不归属感。\n  ' +
      '\n' +
      '2014-2015，由于身体原因我在家Gap一年。\n \n ' +
      ' 有一天我去南昌大桥的另一边红谷滩拍照，\n \n ' +
      '想要将这种情感记录下来 \n \n 而最后一张是从家阳台看出去的景色',
    imageOrder: [
      'leica295dr_sm_web_use 1.jpg',
      'LEICA718p_sm_web_use.jpg',
      'LEICA748p_sm_web_use.jpg',
      'eos322p_sm_web_use.jpg',
      'leica293dr 1_sm_web_use.jpg',
      'hexar183afp_sm_web_use.jpg',
      'img028 1_sm_web_use.jpg',
    ],
    excludes: [],
  },
  {
    title: 'Graduation 2014',
    project_folder: 'Graduation',
    subtitle: 'Pictures taken in 2014, for my classmates and myself',
    imageOrder: [
      'rolleflex468_sm_web_use.jpg',
      'rolleflex466_sm_web_use.jpg',
      'rolleflex473_sm_web_use.jpg',
      'rolleflex471_sm_web_use.jpg',
      'rolleflex476_sm_web_use.jpg',
      'rolleflex478_sm_web_use 1.jpg',
      'rolleflex477_sm_web_use.jpg',
    ],
    excludes: [],
  },

  {
    title: 'Nostalgia Donghu Lake 2014',
    project_folder: 'donghu',
    subtitle: '',
    imageOrder: ['000385_sm_web_use.jpg', 'leica568wuhan_sm_web_use.jpg'],
    excludes: [],
  },
  // add more projects as needed
]
