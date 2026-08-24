'use client'

import { useEffect } from 'react'

export default function ScrollHandler() {
  useEffect(() => {
    // Smooth scroll for nav links
    const handleNavClick = (e: Event) => {
      const target = e.target as HTMLAnchorElement | null
      if (!target || target.tagName !== 'A') return
      const href = target.getAttribute('href')
      if (!href || !href.startsWith('#')) return
      e.preventDefault()
      const el = document.querySelector(href)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      // Update active nav
      document.querySelectorAll('.nav a').forEach((l) => l.classList.remove('active'))
      target.classList.add('active')
    }

    // Highlight nav on scroll
    const handleScroll = () => {
      const sections = ['home', 'shanru', 'elsa-plan', 'elsa-tracker', 'elsa-counselor', 'javis', 'javis-tracker', 'sanbao', 'cyrus-tracker', 'gallery']
      let current = 'home'
      sections.forEach((id) => {
        const el = document.getElementById(id)
        if (el && el.offsetTop - 200 <= window.scrollY) current = id
      })
      document.querySelectorAll('.nav a').forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current)
      })
    }

    document.addEventListener('click', handleNavClick)
    window.addEventListener('scroll', handleScroll)
    return () => {
      document.removeEventListener('click', handleNavClick)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return null
}
