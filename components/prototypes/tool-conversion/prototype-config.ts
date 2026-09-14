import type { Scene } from './prototype-types'

export const prototypeConfig = {
  tool: {
    name: 'AI扩图',
    description: '图片尺寸不够用？上传图片后，AI 会智能补全画面，轻松适配封面、海报、商品图和 PPT 背景等常用尺寸。',
    generateLabel: '开始扩图',
    newUserBenefit: '新用户登录即赠 500 智点',
    costPoints: 490,
    waitHint: '预计需等待一小会儿',
  },
  layout: { operationRatio: 45, galleryRatio: 55, desktopColumns: 4, tabletColumns: 2, mobileColumns: 1 },
  timings: { submittingMs: 300, generatingMs: 3000, stillGeneratingMs: 8000 },
} as const

export const scenes: Scene[] = [
  { id: 'landscape', name: '横图扩展', description: '把图扩成横版', image: '/prototype-assets/chinaz-scene-01.jpg', result: '/prototype-assets/chinaz-scene-01.jpg', ratio: '1920 x 1080' },
  { id: 'portrait', name: '竖图扩展', description: '把图扩成竖版', image: '/prototype-assets/chinaz-scene-02.jpg', result: '/prototype-assets/chinaz-scene-02.jpg', ratio: '1080 x 1920' },
  { id: 'square', name: '方图扩展', description: '把图扩成方图', image: '/prototype-assets/chinaz-scene-03.jpg', result: '/prototype-assets/chinaz-scene-03.jpg', ratio: '1200 x 1200' },
  { id: 'common-landscape', name: '普通横版图', description: '文章展示配图', image: '/prototype-assets/chinaz-scene-04.jpg', result: '/prototype-assets/chinaz-scene-04.jpg', ratio: '1600 x 1200' },
  { id: 'common-portrait', name: '普通竖版图', description: '封面长图入口', image: '/prototype-assets/chinaz-scene-05.jpg', result: '/prototype-assets/chinaz-scene-05.jpg', ratio: '1200 x 1600' },
  { id: 'redbook-cover', name: '小红书封面', description: '竖版内容封面', image: '/prototype-assets/chinaz-scene-06.jpg', result: '/prototype-assets/chinaz-scene-06.jpg', ratio: '1242 x 1660' },
  { id: 'redbook-post', name: '小红书配图', description: '信息流竖版图', image: '/prototype-assets/chinaz-scene-07.jpg', result: '/prototype-assets/chinaz-scene-07.jpg', ratio: '1080 x 1350' },
  { id: 'douyin-cover', name: '抖音/视频号封面', description: '竖屏视频封面', image: '/prototype-assets/chinaz-scene-08.jpg', result: '/prototype-assets/chinaz-scene-08.jpg', ratio: '1080 x 1920' },
  { id: 'video-cover', name: '横版视频封面', description: '横版视频缩略图', image: '/prototype-assets/chinaz-scene-09.jpg', result: '/prototype-assets/chinaz-scene-09.jpg', ratio: '1280 x 720' },
  { id: 'social-square', name: '社媒方图', description: '朋友圈通用方图', image: '/prototype-assets/chinaz-scene-10.jpg', result: '/prototype-assets/chinaz-scene-10.jpg', ratio: '1200 x 1200' },
  { id: 'social-vertical', name: '社媒竖图', description: '信息流竖版配图', image: '/prototype-assets/chinaz-scene-11.jpg', result: '/prototype-assets/chinaz-scene-11.jpg', ratio: '1080 x 1350' },
  { id: 'social-horizontal', name: '社媒横图', description: '横版信息流配图', image: '/prototype-assets/chinaz-scene-12.jpg', result: '/prototype-assets/chinaz-scene-12.jpg', ratio: '1350 x 1080' },
  { id: 'product-main', name: '商品主图', description: '电商商品主图', image: '/prototype-assets/chinaz-scene-13.jpg', result: '/prototype-assets/chinaz-scene-13.jpg', ratio: '1200 x 1200' },
  { id: 'product-portrait', name: '商品竖图', description: '商品竖版展示图', image: '/prototype-assets/chinaz-scene-14.jpg', result: '/prototype-assets/chinaz-scene-14.jpg', ratio: '1200 x 1500' },
  { id: 'product-landscape', name: '商品横图', description: '商品横版展示图', image: '/prototype-assets/chinaz-scene-15.jpg', result: '/prototype-assets/chinaz-scene-15.jpg', ratio: '1600 x 900' },
  { id: 'product-scene', name: '商品场景图', description: '商品场景展示图', image: '/prototype-assets/chinaz-scene-16.jpg', result: '/prototype-assets/chinaz-scene-16.jpg', ratio: '1600 x 1200' },
  { id: 'store-banner', name: '店铺横幅', description: '店铺首页横幅', image: '/prototype-assets/chinaz-scene-17.jpg', result: '/prototype-assets/chinaz-scene-17.jpg', ratio: '1920 x 1080' },
  { id: 'ppt-background', name: 'PPT 背景', description: '演示文稿背景', image: '/prototype-assets/chinaz-scene-18.jpg', result: '/prototype-assets/chinaz-scene-18.jpg', ratio: '1920 x 1080' },
  { id: 'report-cover', name: '汇报封面', description: '汇报文档封面', image: '/prototype-assets/chinaz-scene-19.jpg', result: '/prototype-assets/chinaz-scene-19.jpg', ratio: '1920 x 1080' },
  { id: 'meeting-background', name: '会议背景', description: '线上会议背景', image: '/prototype-assets/chinaz-scene-20.jpg', result: '/prototype-assets/chinaz-scene-20.jpg', ratio: '1920 x 1080' },
  { id: 'poster-background', name: '海报背景', description: '宣传海报背景', image: '/prototype-assets/chinaz-scene-21.jpg', result: '/prototype-assets/chinaz-scene-21.jpg', ratio: '1200 x 1600' },
  { id: 'portrait-poster', name: '竖版宣传图', description: '竖版宣传海报', image: '/prototype-assets/chinaz-scene-22.jpg', result: '/prototype-assets/chinaz-scene-22.jpg', ratio: '1080 x 1350' },
  { id: 'phone-wallpaper', name: '手机壁纸', description: '手机屏幕壁纸', image: '/prototype-assets/chinaz-scene-23.jpg', result: '/prototype-assets/chinaz-scene-23.jpg', ratio: '1080 x 1920' },
  { id: 'desktop-wallpaper', name: '电脑壁纸', description: '桌面屏幕壁纸', image: '/prototype-assets/chinaz-scene-24.jpg', result: '/prototype-assets/chinaz-scene-24.jpg', ratio: '1920 x 1080' },
]
