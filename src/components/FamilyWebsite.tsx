'use client'

import { useMemo } from 'react'
import { getFamilyWebsiteHtml } from '@/lib/html'
import ScrollHandler from '@/components/ScrollHandler'

export default function FamilyWebsite() {
  const htmlContent = useMemo(() => getFamilyWebsiteHtml(), [])

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
