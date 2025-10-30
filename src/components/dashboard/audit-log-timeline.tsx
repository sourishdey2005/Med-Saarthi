'use client'

import React from 'react'
import { User, FileText, Bot, Bell } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const logData = [
  {
    id: 'log1',
    actor: 'Dr. Mehta',
    action: 'initiated discharge for Priya Sharma.',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    icon: <User className="h-4 w-4" />,
  },
  {
    id: 'log2',
    actor: 'AI System',
    action: 'flagged a high-risk drug interaction for Vikram Singh.',
    timestamp: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
    icon: <Bot className="h-4 w-4" />,
  },
  {
    id: 'log3',
    actor: 'Rohan Sharma (Caregiver)',
    action: 'acknowledged comprehension of care plan.',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    icon: <User className="h-4 w-4" />,
  },
  {
    id: 'log4',
    actor: 'System',
    action: 'sent medication reminders to 8 patients.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    icon: <Bell className="h-4 w-4" />,
  },
  {
    id: 'log5',
    actor: 'Dr. Desai',
    action: 'generated a discharge summary for Ramesh Reddy.',
    timestamp: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
    icon: <FileText className="h-4 w-4" />,
  },
]

export default function AuditLogTimeline() {
  return (
    <div className="space-y-6">
      {logData.map((log) => (
        <div key={log.id} className="relative flex items-start gap-4">
          <span className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-border" />
          <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            {log.icon}
          </div>
          <div className="flex-1 pt-1.5">
            <p className="text-sm">
              <span className="font-semibold">{log.actor}</span> {log.action}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
