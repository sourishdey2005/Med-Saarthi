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
import { PlaceHolderImages } from '@/lib/placeholder-images'
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  HeartPulse,
} from 'lucide-react'

export function MainSidebar() {
  const pathname = usePathname()
  const userAvatar = PlaceHolderImages.find(img => img.id === 'user-avatar')

  const menuItems = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/dashboard/patients',
      label: 'Patients',
      icon: Users,
    },
    {
      href: '/dashboard/reconciliation',
      label: 'Reconciliation',
      icon: HeartPulse,
    },
    {
      href: '/dashboard/settings',
      label: 'Settings',
      icon: Settings,
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
              v1.0.0
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
                  isActive={pathname.startsWith(item.href) && (item.href === '/dashboard' ? pathname === item.href : true)}
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
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={userAvatar?.imageUrl} alt="Dr. Anita Desai" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold">Dr. Anita Desai</span>
            <span className="text-xs text-muted-foreground">Cardiologist</span>
          </div>
        </div>
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
