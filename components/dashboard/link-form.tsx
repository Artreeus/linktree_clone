"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface LinkFormProps {
  link?: {
    id: string
    title: string
    url: string
  }
  onSave: (title: string, url: string) => void
  onCancel: () => void
}

export function LinkForm({ link, onSave, onCancel }: LinkFormProps) {
  const [title, setTitle] = useState(link?.title || "")
  const [url, setUrl] = useState(link?.url || "")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      onSave(title, url)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-muted/50">
      <div className="grid gap-2">
        <Label htmlFor="link-title">Title</Label>
        <Input
          id="link-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., My Website"
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="link-url">URL</Label>
        <Input
          id="link-url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          required
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? "Saving..." : "Save"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
          Cancel
        </Button>
      </div>
    </form>
  )
}
