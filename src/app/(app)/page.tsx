'use client'

import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function AppRootPage() {
  useEffect(() => {
    redirect('/dashboard')
  }, [])
  return null
}
