// Read the HTML content from the public directory at runtime
export async function getFamilyWebsiteHtml(): Promise<string> {
  try {
    const html = await fetch('/family-website.html').then(r => r.text())
    // Extract body content only (skip <!DOCTYPE>, <html>, <head>, <body> tags)
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)
    if (bodyMatch) {
      return bodyMatch[1]
    }
    return html
  } catch {
    return '<p>Error loading website content. Please try refreshing.</p>'
  }
}
