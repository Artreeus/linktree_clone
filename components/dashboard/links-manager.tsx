"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Trash2, Plus, GripVertical } from "lucide-react"
import { LinkForm } from "./link-form"

interface Link {
  id: string
  title: string
  url: string
  icon_url: string
  order_index: number
  is_active: boolean
}

interface LinksManagerProps {
  userId: string
  links: Link[]
  setLinks: (links: Link[]) => void
}

export function LinksManager({ userId, links, setLinks }: LinksManagerProps) {
  const [isAddingLink, setIsAddingLink] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const { toast } = useToast()
  const supabase = createClient()

  const handleAddLink = async (title: string, url: string) => {
    try {
      const { data, error } = await supabase
        .from("links")
        .insert({
          user_id: userId,
          title,
          url,
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

  const handleUpdateLink = async (linkId: string, title: string, url: string) => {
    try {
      const { error } = await supabase
        .from("links")
        .update({
          title,
          url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", linkId)

      if (error) throw error

      setLinks(
        links.map((link) =>
          link.id === linkId
            ? {
                ...link,
                title,
                url,
              }
            : link,
        ),
      )
      setEditingId(null)
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

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Your Links</CardTitle>
          <CardDescription>Add and manage your links</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {links.length === 0 ? (
            <p className="text-sm text-muted-foreground">No links yet. Add your first link to get started!</p>
          ) : (
            <div className="space-y-2">
              {links.map((link) => (
                <div key={link.id} className="flex items-center gap-2 p-3 border rounded-lg">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{link.title}</p>
                    <p className="text-sm text-muted-foreground truncate">{link.url}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditingId(link.id)}>
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteLink(link.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {editingId && (
            <LinkForm
              link={links.find((l) => l.id === editingId)}
              onSave={(title, url) => {
                handleUpdateLink(editingId, title, url)
              }}
              onCancel={() => setEditingId(null)}
            />
          )}

          {isAddingLink && (
            <LinkForm
              onSave={(title, url) => {
                handleAddLink(title, url)
              }}
              onCancel={() => setIsAddingLink(false)}
            />
          )}

          {!isAddingLink && editingId === null && (
            <Button onClick={() => setIsAddingLink(true)} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Link
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
