'use client'

import { getFamilyWebsiteHtml } from '@/lib/html'
import ScrollHandler from '@/components/ScrollHandler'

export default function FamilyWebsite() {
  const htmlContent = getFamilyWebsiteHtml()

  return (
    <>
      <ScrollHandler />
      <div
        className="family-website"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </>
  )
}
