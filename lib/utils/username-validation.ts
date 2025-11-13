/**
 * Username validation utility
 * Ensures usernames are safe, clean, and URL-friendly
 */

export interface UsernameValidationResult {
  isValid: boolean
  error?: string
  normalized?: string
}

export function validateUsername(username: string): UsernameValidationResult {
  // Remove whitespace
  const trimmed = username.trim()
  
  // Check if empty
  if (!trimmed) {
    return {
      isValid: false,
      error: "Username cannot be empty",
    }
  }
  
  // Check length
  if (trimmed.length < 3) {
    return {
      isValid: false,
      error: "Username must be at least 3 characters",
    }
  }
  
  if (trimmed.length > 30) {
    return {
      isValid: false,
      error: "Username must be less than 30 characters",
    }
  }
  
  // Check for valid characters (only alphanumeric, underscore, and hyphen)
  const validUsernameRegex = /^[a-zA-Z0-9_-]+$/
  if (!validUsernameRegex.test(trimmed)) {
    return {
      isValid: false,
      error: "Username can only contain letters, numbers, underscores, and hyphens",
    }
  }
  
  // Check for consecutive special characters
  if (/[-_]{2,}/.test(trimmed)) {
    return {
      isValid: false,
      error: "Username cannot have consecutive special characters",
    }
  }
  
  // Check if starts or ends with special character
  if (/^[-_]|[-_]$/.test(trimmed)) {
    return {
      isValid: false,
      error: "Username cannot start or end with special characters",
    }
  }
  
  // Check for reserved words
  const reservedWords = [
    'admin', 'administrator', 'root', 'system', 'api', 'auth',
    'dashboard', 'settings', 'profile', 'help', 'support',
    'about', 'contact', 'terms', 'privacy', 'legal',
  ]
  
  if (reservedWords.includes(trimmed.toLowerCase())) {
    return {
      isValid: false,
      error: "This username is reserved and cannot be used",
    }
  }
  
  // Normalize username (lowercase)
  const normalized = trimmed.toLowerCase()
  
  return {
    isValid: true,
    normalized,
  }
}

export function sanitizeUsername(username: string): string {
  // Remove whitespace
  let sanitized = username.trim()
  
  // Convert to lowercase
  sanitized = sanitized.toLowerCase()
  
  // Replace invalid characters with hyphens
  sanitized = sanitized.replace(/[^a-z0-9_-]/g, '-')
  
  // Remove consecutive hyphens or underscores
  sanitized = sanitized.replace(/[-_]{2,}/g, '-')
  
  // Remove leading/trailing special characters
  sanitized = sanitized.replace(/^[-_]+|[-_]+$/g, '')
  
  // Truncate to max length
  if (sanitized.length > 30) {
    sanitized = sanitized.substring(0, 30)
  }
  
  return sanitized
}

