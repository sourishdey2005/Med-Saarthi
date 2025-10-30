
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

  // Robust data preparation for Sankey chart
  const allMeds = [...new Set([...preAdmissionMeds, ...postDischargeMeds])];
  
  const nodes = [
    { name: 'Pre-Admission' },
    { name: 'Post-Discharge' },
    { name: 'Discontinued' },
    ...allMeds.map(name => ({ name }))
  ];

  const nodeMap = new Map(nodes.map((node, i) => [node.name, i]));
  
  const links: { source: number; target: number; value: number }[] = [];
  const linkSet = new Set<string>();

  const addLink = (source: string, target: string, value: number) => {
    const sourceIndex = nodeMap.get(source);
    const targetIndex = nodeMap.get(target);
    const key = `${sourceIndex}-${targetIndex}`;

    if (sourceIndex !== undefined && targetIndex !== undefined && !linkSet.has(key)) {
      links.push({ source: sourceIndex, target: targetIndex, value });
      linkSet.add(key);
    }
  };

  const preAdmissionIndex = nodeMap.get('Pre-Admission')!;
  const postDischargeIndex = nodeMap.get('Post-Discharge')!;
  const discontinuedIndex = nodeMap.get('Discontinued')!;
  
  // Create links
  allMeds.forEach(med => {
    const wasOnPre = preAdmissionMeds.includes(med);
    const isOnPost = postDischargeMeds.includes(med);

    if (wasOnPre) {
      addLink('Pre-Admission', med, 1);
      if (isOnPost) {
        addLink(med, 'Post-Discharge', 1);
      } else {
        addLink(med, 'Discontinued', 1);
      }
    } else if (isOnPost) { // New medication
      // Add a zero-value link from pre-admission to keep the layout clean
      // and ensure the node appears in the middle.
      addLink('Pre-Admission', med, 0); 
      addLink(med, 'Post-Discharge', 1);
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
