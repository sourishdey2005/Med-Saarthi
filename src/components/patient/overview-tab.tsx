'use client'

import React from 'react'
import type { Patient } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MedicalHistorySummary } from './medical-history-summary'
import VitalsChart from './vitals-chart'
import { AlertTriangle, Info, ShieldAlert } from 'lucide-react'
import CareTransitionSankey from './care-transition-sankey'

interface OverviewTabProps {
  patient: Patient
}

const alertIcons = {
  Critical: <ShieldAlert className="h-5 w-5 text-destructive" />,
  Warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
  Info: <Info className="h-5 w-5 text-blue-500" />,
}

const sankeyData = {
    nodes: [
        { name: 'Admission' },
        { name: 'Diagnosis' },
        { name: 'Treatment' },
        { name: 'Reconciliation' },
        { name: 'Education' },
        { name: 'Discharge' }
    ],
    links: [
        { source: 0, target: 1, value: 100 },
        { source: 1, target: 2, value: 100 },
        { source: 2, target: 3, value: 80 },
        { source: 2, target: 5, value: 20 }, // 20% skip reconciliation
        { source: 3, target: 4, value: 80 },
        { source: 4, target: 5, value: 80 }
    ]
};


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

       <div className="md:col-span-2 lg:col-span-3">
        <CareTransitionSankey data={sankeyData} />
      </div>
    </div>
  )
}
