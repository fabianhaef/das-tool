"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Code2,
  MessageSquare,
  GitPullRequest,
  History,
  Calendar,
  FileCode,
} from 'lucide-react'

const navigation = [
  { name: 'Planning', href: '/planning', icon: Calendar },
  { name: 'Prompting', href: '/prompting', icon: Code2 },
  { name: 'Architecture', href: '/architecture', icon: GitPullRequest },
  { name: 'Time Travel', href: '/time-travel', icon: History },
  { name: 'Feedback', href: '/feedback', icon: MessageSquare },
  { name: 'Code Editor', href: '/code-editor', icon: FileCode },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col border-r bg-muted/40">
      <div className="flex h-14 items-center border-b px-4">
        <h1 className="text-lg font-semibold">Das Tool</h1>
      </div>
      <nav className="flex-1 space-y-1 p-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
} 