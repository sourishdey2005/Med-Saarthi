'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { MedSaarthiIcon } from './icons'
import { getPatientById } from '@/lib/data'
import {
  LayoutDashboard,
  LogOut,
  FileText,
  Pill,
  Users,
  BookHeart,
} from 'lucide-react'

export function PatientSidebar() {
  const pathname = usePathname()
  const patient = getPatientById('1'); // Hardcoded for prototype

  const menuItems = [
    {
      href: '/patient/dashboard',
      label: 'My Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/patient/dashboard/summary',
      label: 'Discharge Summary',
      icon: FileText,
    },
    {
      href: '/patient/dashboard/medications',
      label: 'My Medications',
      icon: Pill,
    },
    {
        href: '/patient/dashboard/symptoms',
        label: 'Symptom Diary',
        icon: BookHeart,
    },
    {
      href: '/patient/dashboard/caregivers',
      label: 'My Caregivers',
      icon: Users,
    },
  ]

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <MedSaarthiIcon className="h-8 w-8" />
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold tracking-tight text-primary">
              Med-Saarthi
            </h2>
            <p className="text-xs text-muted-foreground">
              Patient Portal
            </p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        {patient && (
            <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
                <AvatarImage src={patient.avatarUrl} alt={patient.name} />
                <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <span className="font-semibold">{patient.name}</span>
                <span className="text-xs text-muted-foreground">ABHA: {patient.abhaId}</span>
            </div>
            </div>
        )}
        <Link href="/login" className="w-full">
            <Button variant="outline" size="sm" className="w-full">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
            </Button>
        </Link>
      </SidebarFooter>
    </>
  )
}
