// Read the HTML content generated from original index.html
import htmlContent from '@/data/family-website-content.js'

/**
 * Returns the family website HTML content ready for rendering.
 * The CSS is in globals.css and the scroll handler is in ScrollHandler.tsx.
 */
export function getFamilyWebsiteHtml(): string {
  return htmlContent
}
