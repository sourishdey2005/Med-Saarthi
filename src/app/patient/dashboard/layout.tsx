import React from 'react'
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar'
import { PatientSidebar } from '@/components/patient-sidebar'

export default function PatientDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <PatientSidebar />
      </Sidebar>
      <SidebarInset>
        <div className="min-h-screen w-full">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
