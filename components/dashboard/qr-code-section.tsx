"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface QRCodeSectionProps {
  username: string
}

export function QRCodeSection({ username }: QRCodeSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [qrCode, setQrCode] = useState<string>("")
  const { toast } = useToast()

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const profileUrl = `${window.location.origin}/u/${username}`

        // Use QR Server API to generate QR code
        const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(profileUrl)}`
        setQrCode(qrImageUrl)
      } catch (error) {
        console.error("Failed to generate QR code:", error)
      }
    }

    if (username) {
      generateQRCode()
    }
  }, [username])

  const handleDownload = async () => {
    if (!qrCode) return

    try {
      const response = await fetch(qrCode)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${username}-qr-code.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Success",
        description: "QR code downloaded successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download QR code",
        variant: "destructive",
      })
    }
  }

  const handleCopyLink = () => {
    const profileUrl = `${window.location.origin}/u/${username}`
    navigator.clipboard.writeText(profileUrl)
    toast({
      title: "Success",
      description: "Profile link copied to clipboard",
    })
  }

  if (!qrCode) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Share Your Profile</CardTitle>
        <CardDescription>Use the QR code or link to share your profile</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <img
            src={qrCode || "/placeholder.svg"}
            alt="QR Code"
            className="w-48 h-48 border-2 border-primary rounded-lg p-2"
          />
        </div>

        <div className="space-y-2">
          <Button onClick={handleDownload} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Download QR Code
          </Button>
          <Button onClick={handleCopyLink} variant="outline" className="w-full bg-transparent">
            <Copy className="h-4 w-4 mr-2" />
            Copy Profile Link
          </Button>
        </div>

        <div className="p-3 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground break-all">{`${window.location.origin}/u/${username}`}</p>
        </div>
      </CardContent>
    </Card>
  )
}
