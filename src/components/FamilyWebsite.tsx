'use client'

import { useState, useEffect } from 'react'
import { getFamilyWebsiteHtml } from '@/lib/html'
import ScrollHandler from '@/components/ScrollHandler'

export default function FamilyWebsite() {
  const [htmlContent, setHtmlContent] = useState('')

  useEffect(() => {
    getFamilyWebsiteHtml().then(setHtmlContent)
  }, [])

  if (!htmlContent) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500 text-lg">Loading...</div>
      </div>
    )
  }

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
