import React from 'react'
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar'
import { MainSidebar } from '@/components/main-sidebar'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <MainSidebar />
      </Sidebar>
      <SidebarInset>
        <div className="min-h-screen w-full">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
