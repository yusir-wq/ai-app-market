'use client'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { type SearchResult } from '@/lib/mock-data'
import { ExternalLink } from 'lucide-react'

interface SearchResultsDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  results: SearchResult[]
}

export function SearchResultsDrawer({
  open,
  onOpenChange,
  results,
}: SearchResultsDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[380px] sm:w-[420px] p-0">
        <SheetHeader className="px-6 py-4 border-b border-border">
          <SheetTitle className="text-base font-semibold">
            引用来源
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({results.length})
            </span>
          </SheetTitle>
        </SheetHeader>
        <div className="overflow-y-auto h-full pb-20">
          <div className="divide-y divide-border">
            {results.map((result) => (
              <a
                key={result.id}
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-6 py-4 hover:bg-accent transition-colors group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-1">
                      {result.siteName}
                    </p>
                    <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors mb-1">
                      {result.title}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {result.snippet}
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </a>
            ))}
          </div>
          {results.length === 0 && (
            <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
              暂无引用来源
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}