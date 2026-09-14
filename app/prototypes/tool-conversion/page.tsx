import { Suspense } from 'react'
import { ConversionPrototype } from '@/components/prototypes/tool-conversion/conversion-prototype'

export default function ToolConversionPage() {
  return <Suspense fallback={null}><ConversionPrototype /></Suspense>
}
