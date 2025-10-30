'use client';

import React, { useState, useTransition } from 'react';
import type { Patient, Medication, Alert as AlertType } from '@/lib/types';
import { reconcileMedications } from '@/ai/flows/reconcile-medications';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, ArrowRight, Bot, CheckCircle, Info, Loader2, MinusCircle, PlusCircle, ShieldAlert, XCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import ClinicalRiskHeatmap from './clinical-risk-heatmap';


interface MedicationTabProps {
  patient: Patient;
}

const statusIcons: { [key: string]: React.ReactNode } = {
  New: <PlusCircle className="h-4 w-4 text-green-500" />,
  Changed: <ArrowRight className="h-4 w-4 text-blue-500" />,
  Unchanged: <CheckCircle className="h-4 w-4 text-gray-500" />,
  Discontinued: <MinusCircle className="h-4 w-4 text-red-500" />,
};

const statusColors: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
  New: 'default',
  Changed: 'default',
  Unchanged: 'secondary',
  Discontinued: 'destructive',
};

const alertSeverityIcons: { [key: string]: React.ReactNode } = {
  Critical: <ShieldAlert className="h-5 w-5 text-destructive" />,
  Warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
  Info: <Info className="h-5 w-5 text-blue-500" />,
};


function MedicationList({ title, medications }: { title: string; medications: Medication[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Medication</TableHead>
              <TableHead>Dosage</TableHead>
              <TableHead>Frequency</TableHead>
              {medications[0]?.status && <TableHead>Status</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {medications.map((med) => (
              <TableRow key={med.id}>
                <TableCell className="font-medium">{med.name}</TableCell>
                <TableCell>{med.dosage}</TableCell>
                <TableCell>{med.frequency}</TableCell>
                {med.status && (
                  <TableCell>
                    <Badge variant={statusColors[med.status]}>
                      {statusIcons[med.status]}
                      <span className="ml-1">{med.status}</span>
                    </Badge>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function InteractionAlerts({ patient }: { patient: Patient }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [aiAlerts, setAiAlerts] = useState<AlertType[]>([]);

  const handleAnalyzeMedications = () => {
    startTransition(async () => {
      try {
        const result = await reconcileMedications({
          patientInfo: {
            age: patient.age,
            gender: patient.gender,
            conditions: patient.diagnosis,
            egfr: patient.egfr,
            lft: patient.lft,
          },
          preAdmissionMedications: patient.medications.preAdmission.map(m => m.name),
          postDischargeMedications: patient.medications.postDischarge.map(m => `${m.name} ${m.dosage}`),
        });
        setAiAlerts(result.alerts);
        toast({ title: 'Analysis Complete', description: `Found ${result.alerts.length} potential issues.` });
      } catch (error) {
        console.error(error);
        toast({ title: 'Error', description: 'Failed to analyze medications.', variant: 'destructive' });
      }
    });
  };

  const allAlerts: AlertType[] = [...patient.alerts.filter(a => a.type !== 'Dose'), ...aiAlerts];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Interaction & Safety Alerts</CardTitle>
          <CardDescription>AI-powered analysis of potential risks and interactions.</CardDescription>
        </div>
        <Button onClick={handleAnalyzeMedications} disabled={isPending}>
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
          Run AI Safety Check
        </Button>
      </CardHeader>
      <CardContent>
        {allAlerts.length > 0 ? (
          <Accordion type="multiple" className="space-y-3">
            {allAlerts.map((alert, index) => (
              <AccordionItem key={alert.id || index} value={`item-${index}`} className="rounded-md border p-3">
                 <AccordionTrigger className="w-full text-left hover:no-underline p-0">
                    <div className="flex items-start gap-3 flex-1">
                        <div>
                        {alertSeverityIcons[alert.severity] || <XCircle className="h-5 w-5 text-destructive" />}
                        </div>
                        <div>
                        <p className="font-semibold">{alert.type.replace(/-/g, ' ')}</p>
                        <p className="text-sm text-muted-foreground">{alert.description}</p>
                        </div>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 text-xs text-muted-foreground pl-8">
                  <p className='font-semibold mb-1'>XAI Reasoning:</p>
                  <p>{alert.reasoning || "No detailed reasoning available."}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">No interaction alerts flagged. Run the AI safety check.</p>
        )}
      </CardContent>
    </Card>
  );
}


export default function MedicationTab({ patient }: MedicationTabProps) {
  return (
    <div className="grid gap-6">
      <div className="grid md:grid-cols-2 gap-6">
          <MedicationList title="Pre-Admission Medications" medications={patient.medications.preAdmission} />
          <MedicationList title="Post-Discharge Medications" medications={patient.medications.postDischarge} />
      </div>

      <InteractionAlerts patient={patient} />

      <ClinicalRiskHeatmap medications={patient.medications.postDischarge} />
    </div>
  );
}
