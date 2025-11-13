"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Palette, Check } from "lucide-react"

interface AppearanceEditorProps {
  userId: string
  profile: any
}

const THEMES = [
  { id: "default", name: "Default", bg: "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950", primary: "#8b5cf6" },
  { id: "ocean", name: "Ocean", bg: "bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950", primary: "#0891b2" },
  { id: "sunset", name: "Sunset", bg: "bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950", primary: "#f97316" },
  { id: "forest", name: "Forest", bg: "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950", primary: "#10b981" },
  { id: "midnight", name: "Midnight", bg: "bg-gradient-to-br from-indigo-900 to-purple-900", primary: "#6366f1" },
  { id: "minimal", name: "Minimal", bg: "bg-white dark:bg-gray-950", primary: "#000000" },
]

const BUTTON_STYLES = [
  { id: "rounded", name: "Rounded", class: "rounded-full" },
  { id: "sharp", name: "Sharp", class: "rounded-none" },
  { id: "soft", name: "Soft", class: "rounded-lg" },
]

export function AppearanceEditor({ userId, profile }: AppearanceEditorProps) {
  const [selectedTheme, setSelectedTheme] = useState(profile?.theme || "default")
  const [buttonStyle, setButtonStyle] = useState(profile?.button_style || "rounded")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          theme: selectedTheme,
          button_style: buttonStyle,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)

      if (error) throw error

      toast({
        title: "Success",
        description: "Appearance settings saved successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save appearance settings",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-primary" />
          <CardTitle>Appearance</CardTitle>
        </div>
        <CardDescription>Customize your profile's look and feel</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>Theme</Label>
          <div className="grid grid-cols-2 gap-3">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setSelectedTheme(theme.id)}
                className={`relative h-20 rounded-lg border-2 transition-all ${
                  selectedTheme === theme.id ? "border-primary" : "border-border"
                } ${theme.bg}`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-medium">{theme.name}</span>
                </div>
                {selectedTheme === theme.id && (
                  <div className="absolute top-2 right-2">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Button Style</Label>
          <div className="grid grid-cols-3 gap-3">
            {BUTTON_STYLES.map((style) => (
              <button
                key={style.id}
                onClick={() => setButtonStyle(style.id)}
                className={`relative h-12 border-2 transition-all ${
                  buttonStyle === style.id ? "border-primary bg-primary/10" : "border-border"
                } ${style.class}`}
              >
                <span className="text-sm font-medium">{style.name}</span>
              </button>
            ))}
          </div>
        </div>

        <Button onClick={handleSave} disabled={isLoading} className="w-full">
          {isLoading ? "Saving..." : "Save Appearance"}
        </Button>
      </CardContent>
    </Card>
  )
}

