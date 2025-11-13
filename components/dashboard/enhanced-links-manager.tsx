"use client"

import { useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Trash2, Plus, GripVertical, ExternalLink, Calendar, Instagram, Twitter, Linkedin, Github, Youtube, Facebook, Globe, Mail } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Link {
  id: string
  title: string
  url: string
  icon_url: string
  order_index: number
  is_active: boolean
  scheduled_start?: string
  scheduled_end?: string
}

interface EnhancedLinksManagerProps {
  userId: string
  links: Link[]
  setLinks: (links: Link[]) => void
}

const SOCIAL_ICONS = {
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  github: Github,
  youtube: Youtube,
  facebook: Facebook,
  website: Globe,
  email: Mail,
  custom: ExternalLink,
}

export function EnhancedLinksManager({ userId, links, setLinks }: EnhancedLinksManagerProps) {
  const [isAddingLink, setIsAddingLink] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const { toast } = useToast()
  const supabase = createClient()

  const handleAddLink = async (linkData: Partial<Link>) => {
    try {
      const { data, error } = await supabase
        .from("links")
        .insert({
          user_id: userId,
          ...linkData,
          order_index: links.length,
        })
        .select()

      if (error) throw error

      if (data) {
        setLinks([...links, data[0]])
        setIsAddingLink(false)
        toast({
          title: "Success",
          description: "Link added successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add link",
        variant: "destructive",
      })
    }
  }

  const handleDeleteLink = async (linkId: string) => {
    try {
      const { error } = await supabase.from("links").delete().eq("id", linkId)

      if (error) throw error

      setLinks(links.filter((link) => link.id !== linkId))
      toast({
        title: "Success",
        description: "Link deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete link",
        variant: "destructive",
      })
    }
  }

  const handleUpdateLink = async (linkId: string, updates: Partial<Link>) => {
    try {
      const { error } = await supabase
        .from("links")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", linkId)

      if (error) throw error

      setLinks(
        links.map((link) =>
          link.id === linkId
            ? {
                ...link,
                ...updates,
              }
            : link,
        ),
      )
      
      toast({
        title: "Success",
        description: "Link updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update link",
        variant: "destructive",
      })
    }
  }

  const handleToggleActive = async (linkId: string, isActive: boolean) => {
    await handleUpdateLink(linkId, { is_active: !isActive })
  }

  const handleDragStart = (linkId: string) => {
    setDraggedId(linkId)
  }

  const handleDragOver = useCallback((e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    
    if (!draggedId || draggedId === targetId) return

    const draggedIndex = links.findIndex((l) => l.id === draggedId)
    const targetIndex = links.findIndex((l) => l.id === targetId)

    if (draggedIndex === -1 || targetIndex === -1) return

    const newLinks = [...links]
    const [draggedLink] = newLinks.splice(draggedIndex, 1)
    newLinks.splice(targetIndex, 0, draggedLink)

    const updatedLinks = newLinks.map((link, index) => ({
      ...link,
      order_index: index,
    }))

    setLinks(updatedLinks)
  }, [draggedId, links, setLinks])

  const handleDragEnd = async () => {
    if (!draggedId) return

    try {
      const updates = links.map((link) => ({
        id: link.id,
        order_index: link.order_index,
      }))

      for (const update of updates) {
        await supabase.from("links").update({ order_index: update.order_index }).eq("id", update.id)
      }

      toast({
        title: "Success",
        description: "Link order updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update link order",
        variant: "destructive",
      })
    }

    setDraggedId(null)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Your Links</CardTitle>
          <CardDescription>Add, reorder, and manage your links. Drag to reorder.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {links.length === 0 ? (
            <p className="text-sm text-muted-foreground">No links yet. Add your first link to get started!</p>
          ) : (
            <div className="space-y-2">
              {links.map((link) => (
                <div
                  key={link.id}
                  draggable
                  onDragStart={() => handleDragStart(link.id)}
                  onDragOver={(e) => handleDragOver(e, link.id)}
                  onDragEnd={handleDragEnd}
                  className="flex items-center gap-2 p-3 border rounded-lg cursor-move hover:border-primary transition-colors"
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{link.title}</p>
                    <p className="text-sm text-muted-foreground truncate">{link.url}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={link.is_active}
                      onCheckedChange={() => handleToggleActive(link.id, link.is_active)}
                    />
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Link</DialogTitle>
                          <DialogDescription>Update your link details</DialogDescription>
                        </DialogHeader>
                        <LinkEditForm
                          link={link}
                          onSave={(updates) => {
                            handleUpdateLink(link.id, updates)
                            setEditingId(null)
                          }}
                        />
                      </DialogContent>
                    </Dialog>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteLink(link.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Dialog open={isAddingLink} onOpenChange={setIsAddingLink}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Link
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Link</DialogTitle>
                <DialogDescription>Create a new link for your profile</DialogDescription>
              </DialogHeader>
              <LinkEditForm
                onSave={(linkData) => {
                  handleAddLink(linkData)
                }}
              />
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}

function LinkEditForm({ link, onSave }: { link?: Link; onSave: (data: Partial<Link>) => void }) {
  const [title, setTitle] = useState(link?.title || "")
  const [url, setUrl] = useState(link?.url || "")
  const [iconType, setIconType] = useState<keyof typeof SOCIAL_ICONS>("custom")
  const [scheduledStart, setScheduledStart] = useState(link?.scheduled_start || "")
  const [scheduledEnd, setScheduledEnd] = useState(link?.scheduled_end || "")
  const [enableScheduling, setEnableScheduling] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      title,
      url,
      icon_url: iconType,
      ...(enableScheduling && { scheduled_start: scheduledStart, scheduled_end: scheduledEnd }),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My awesome link"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="url">URL</Label>
        <Input
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Icon</Label>
        <div className="grid grid-cols-4 gap-2">
          {Object.entries(SOCIAL_ICONS).map(([key, Icon]) => (
            <button
              key={key}
              type="button"
              onClick={() => setIconType(key as keyof typeof SOCIAL_ICONS)}
              className={`p-3 border rounded-lg flex items-center justify-center transition-colors ${
                iconType === key ? "border-primary bg-primary/10" : "border-border"
              }`}
            >
              <Icon className="h-5 w-5" />
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="scheduling"
          checked={enableScheduling}
          onCheckedChange={setEnableScheduling}
        />
        <Label htmlFor="scheduling" className="cursor-pointer">
          Schedule link visibility
        </Label>
      </div>

      {enableScheduling && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start">Start Date</Label>
            <Input
              id="start"
              type="datetime-local"
              value={scheduledStart}
              onChange={(e) => setScheduledStart(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end">End Date</Label>
            <Input
              id="end"
              type="datetime-local"
              value={scheduledEnd}
              onChange={(e) => setScheduledEnd(e.target.value)}
            />
          </div>
        </div>
      )}

      <Button type="submit" className="w-full">
        {link ? "Update Link" : "Add Link"}
      </Button>
    </form>
  )
}

