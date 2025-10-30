
'use client'

import React from 'react'
import type { Patient } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MedicalHistorySummary } from './medical-history-summary'
import VitalsChart from './vitals-chart'
import { AlertTriangle, Info, ShieldAlert } from 'lucide-react'
import MedicationReconciliationSankey from './medication-reconciliation-sankey'
import RecoveryMilestoneLadder from './recovery-milestone-ladder'

interface OverviewTabProps {
  patient: Patient
}

const alertIcons = {
  Critical: <ShieldAlert className="h-5 w-5 text-destructive" />,
  Warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
  Info: <Info className="h-5 w-5 text-blue-500" />,
}


export default function OverviewTab({ patient }: OverviewTabProps) {
  
  const preAdmissionMeds = patient.medications.preAdmission.map(m => m.name);
  const postDischargeMeds = patient.medications.postDischarge.map(m => m.name);
  
  const allMeds = [...new Set([...preAdmissionMeds, ...postDischargeMeds])];
  const nodes = [
    { name: 'Pre-Admission' },
    { name: 'Post-Discharge' },
    { name: 'Discontinued' },
    ...allMeds.map(name => ({ name }))
  ];

  const nodeMap = new Map(nodes.map((node, i) => [node.name, i]));
  const links: { source: number; target: number; value: number }[] = [];

  const preAdmissionIndex = nodeMap.get('Pre-Admission')!;
  const postDischargeIndex = nodeMap.get('Post-Discharge')!;
  const discontinuedIndex = nodeMap.get('Discontinued')!;


  preAdmissionMeds.forEach(med => {
    const medIndex = nodeMap.get(med)!;
    links.push({ source: preAdmissionIndex, target: medIndex, value: 1 });

    if(postDischargeMeds.includes(med)) {
        links.push({ source: medIndex, target: postDischargeIndex, value: 1 });
    } else {
        links.push({ source: medIndex, target: discontinuedIndex, value: 1 });
    }
  });

  postDischargeMeds.forEach(med => {
    if (!preAdmissionMeds.includes(med)) {
        const medIndex = nodeMap.get(med)!;
        // This link is invisible but necessary for layout
        links.push({ source: preAdmissionIndex, target: medIndex, value: 0 });
        links.push({ source: medIndex, target: postDischargeIndex, value: 1 });
    }
  });
  
  const sankeyData = { nodes, links };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
       <div className="lg:col-span-2 grid gap-6">
        <MedicalHistorySummary patient={patient} />
        {patient.recoveryMilestones && patient.recoveryMilestones.length > 0 && (
            <RecoveryMilestoneLadder milestones={patient.recoveryMilestones} />
        )}
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
        <MedicationReconciliationSankey data={sankeyData} />
      </div>
    </div>
  )
}
