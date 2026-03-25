const siteUrlFromEnv =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : '') ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') ||
  'http://localhost:3000'

const baseUrl = siteUrlFromEnv.endsWith('/')
  ? siteUrlFromEnv.slice(0, -1)
  : siteUrlFromEnv

export const metaData = {
  baseUrl,
  title: 'Ke Zhang',
  name: 'Ke Zhang',
  ogImage: '/selfie.jpg',
  description: 'Photography portfolio and visual stories by Ke Zhang.',
}

interface SocialLinks {
  twitter?: string
  instagram?: string
  linkedin?: string
  email?: string
  github?: string
}

export const socialLinks: SocialLinks = {
  instagram: 'https://www.instagram.com/_kkkkk_zhang/',
  email: 'mailto:ke.zhang.rock@gmail.com',
}

export const projects = [
  {
    title: 'Come Muted 2026',
    project_folder: 'come_muted_2026',
    subtitle: `2025年11月，我加入了旧金山一家 AI 初创公司。  
每周三天，我都要往返 San Jose 与 San Francisco。  

于是我把路途所见，呈现于此。`,
    imageOrder: [
      'R0008227-Edit_small.jpg',
      'R0008097-Edit_og_2026.jpg',
      'R0007932_scale_down_65.jpg',
      'R0007962_scale_down_65.jpg',
      'R0008139_scale_down_65.jpg',
      'R0008231_scale_down_65.jpg',
      'R0008245_scale_down_65.jpg',
      'R0008305 1_scale_down_65.jpg',
      'R0008316_scale_down_65.jpg',
      'DSCF3535_scale_down_65.jpg',
      'DSCF3539_scale_down_65.jpg',
      'R0008230_scale_down_65.jpg',
      'DSCF3374.jpg',
      'DSCF3616.jpg',
      'DSC_2303.JPG',
      'DSC_2530.JPG',
      'DSC_2577.jpg',
      'DSC_2582.jpg',
      'DSC_2598 1.JPG',
      'R0008409 2.jpg',
    ],
    sections: [
      {
        title: 'Come Muted',
        imageOrder: [
          'R0008227-Edit_small.jpg',
          'R0008097-Edit_og_2026.jpg',
          'R0007932_scale_down_65.jpg',
          'R0007962_scale_down_65.jpg',
          'R0008139_scale_down_65.jpg',
          'R0008231_scale_down_65.jpg',
          'R0008245_scale_down_65.jpg',
          'R0008305 1_scale_down_65.jpg',
          'R0008316_scale_down_65.jpg',
          'DSCF3535_scale_down_65.jpg',
          'DSCF3539_scale_down_65.jpg',
          'DSC_2598 1.JPG',
          'R0008409 2.jpg',
        ],
      },
      {
        title: 'Come Unmuted',
        imageOrder: [
          'R0008230_scale_down_65.jpg',
          'DSCF3374.jpg',
          'DSCF3616.jpg',
          'DSC_2303.JPG',
          'DSC_2530.JPG',
          'DSC_2577.jpg',
          'DSC_2582.jpg',
        ],
      },
    ],
    excludes: [],
  },
  {
    title: '2025-2026 Archive',
    project_folder: '2025-2026_archive',
    subtitle: '',
    imageOrder: ['DSCF3635.jpg'],
    excludes: [],
  },
  {
    title: 'A Day in a Child Life 2025',
    project_folder: 'a_day_in_a_child_life_2025',
    subtitle: '',
    imageOrder: [],
    excludes: [],
  },
  {
    title: 'On the Edge of City 2025',
    project_folder: 'edge_of_city',
    subtitle: '',
    imageOrder: [],
    excludes: [],
  },
  {
    title: 'San Francisco Trail Story 2025',
    project_folder: 'sf_trail',
    subtitle: 'I want to get closer to, people',
    imageOrder: [],
    excludes: [],
  },
  {
    title: 'Street Select 2025',
    project_folder: 'street_select_2025',
    subtitle: ' ',
    imageOrder: [],
    excludes: [],
  },
  {
    title: 'Reflections on Reality 2024',
    project_folder: 'reflections_on_reality',
    subtitle: ' ',
    imageOrder: ['_1001206_sm_web_use.jpg', 'L1011137 1 1_sm_web_use.jpg'],
    excludes: [],
  },
  {
    title: 'Divided By 2024',
    project_folder: 'divided_by',
    subtitle: ' ',
    imageOrder: ['light.jpg', 'XPR34717_sm_web_use.jpg', 'car.jpg'],
    excludes: ['_1000852_sm_web_use.jpg'], // These won't show even if they exist
  },
  {
    title: 'Street Select Work 2024',
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
]
