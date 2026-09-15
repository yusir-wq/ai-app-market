import type { Metadata } from 'next'
import { MaterialDetailPrototype } from '@/components/prototypes/material-detail/material-detail-prototype'

export const metadata: Metadata = {
  title: '站在绿植墙前的白色T恤美女图片 - 站长素材',
  description: '站长素材图片详情页高保真原型',
}

export default function MaterialDetailPage() {
  return <MaterialDetailPrototype />
}
