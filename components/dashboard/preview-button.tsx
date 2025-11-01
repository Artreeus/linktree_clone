"use client"

import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import Link from "next/link"

interface PreviewButtonProps {
  username: string
}

export function PreviewButton({ username }: PreviewButtonProps) {
  if (!username) return null

  return (
    <Link href={`/u/${username}`}>
      <Button variant="outline">
        <Eye className="h-4 w-4 mr-2" />
        Preview
      </Button>
    </Link>
  )
}
