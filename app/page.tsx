import { MCPProvider } from '@/contexts/mcp-context'
import { Workspace } from '@/components/workspace/workspace'

export default function Home() {
  return (
    <MCPProvider>
      <Workspace />
    </MCPProvider>
  )
}
