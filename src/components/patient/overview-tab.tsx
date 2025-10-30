'use client'

import React from 'react'
import type { Patient } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MedicalHistorySummary } from './medical-history-summary'
import VitalsChart from './vitals-chart'
import { AlertTriangle, Info, ShieldAlert } from 'lucide-react'

interface OverviewTabProps {
  patient: Patient
}

const alertIcons = {
  Critical: <ShieldAlert className="h-5 w-5 text-destructive" />,
  Warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
  Info: <Info className="h-5 w-5 text-blue-500" />,
}

export default function OverviewTab({ patient }: OverviewTabProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <MedicalHistorySummary patient={patient} />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Active Alerts</CardTitle>
          <CardDescription>Critical risks and warnings for this patient.</CardDescription>
        </CardHeader>
        <CardContent>
          {patient.alerts.length > 0 ? (
            <ul className="space-y-4">
              {patient.alerts.map((alert) => (
                <li key={alert.id} className="flex items-start gap-4">
                  <div>{alertIcons[alert.severity]}</div>
                  <div>
                    <p className="font-semibold">{alert.type}</p>
                    <p className="text-sm text-muted-foreground">{alert.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No active alerts.</p>
          )}
        </CardContent>
      </Card>
      
      <div className="md:col-span-2 lg:col-span-3">
        <VitalsChart vitals={patient.vitals} />
      </div>
    </div>
  )
}
