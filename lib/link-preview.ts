export async function fetchLinkPreview(url: string) {
  try {
    // Extract domain for favicon
    const urlObj = new URL(url)
    const domain = urlObj.hostname

    // Try to get favicon
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`

    return {
      favicon: faviconUrl,
      domain: domain,
    }
  } catch (error) {
    console.error("Failed to fetch link preview:", error)
    return null
  }
}

export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname.replace("www.", "")
  } catch (error) {
    return ""
  }
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch (error) {
    return false
  }
}

export function getFaviconUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`
  } catch (error) {
    return ""
  }
}

