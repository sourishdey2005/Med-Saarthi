'use client';

import React, { useState, useTransition } from 'react';
import type { Patient, SymptomLog } from '@/lib/types';
import { triageSymptoms, TriageSymptomsOutput } from '@/ai/flows/triage-symptoms';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Bot, Loader2, Siren, ShieldAlert, AlertTriangle, Info, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO } from 'date-fns';
import { Area, AreaChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';

interface SymptomDiaryTabProps {
  patient: Patient;
}

const severityBadgeVariants: { [key in SymptomLog['severity']]: 'destructive' | 'secondary' | 'outline' } = {
  Severe: 'destructive',
  Moderate: 'secondary',
  Mild: 'outline',
};

const triageAlertIcons: { [key in TriageSymptomsOutput['triageLevel']]: React.ReactNode } = {
    Emergency: <Siren className="h-4 w-4" />,
    Urgent: <ShieldAlert className="h-4 w-4" />,
    Routine: <Info className="h-4 w-4" />,
};

const triageAlertVariants: { [key in TriageSymptomsOutput['triageLevel']]: 'destructive' | 'default' } = {
    Emergency: 'destructive',
    Urgent: 'destructive',
    Routine: 'default',
};

const MentalWellbeingChart = ({ symptoms }: { symptoms: SymptomLog[] }) => {
    const chartData = symptoms.map(s => ({
        date: format(parseISO(s.date), 'MMM dd'),
        Stress: s.stress,
        Mood: s.mood,
        Worry: s.worry,
    }));

    const chartConfig = {
        Stress: { label: 'Stress', color: 'hsl(var(--chart-1))' },
        Mood: { label: 'Mood', color: 'hsl(var(--chart-2))' },
        Worry: { label: 'Worry', color: 'hsl(var(--chart-5))' },
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Mental Wellbeing Trend</CardTitle>
                <CardDescription>Self-reported scores for stress, mood, and worry (1-10).</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                    <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[0, 10]} />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line type="monotone" dataKey="Stress" stroke="var(--color-Stress)" strokeWidth={2} />
                        <Line type="monotone" dataKey="Mood" stroke="var(--color-Mood)" strokeWidth={2} />
                        <Line type="monotone" dataKey="Worry" stroke="var(--color-Worry)" strokeWidth={2} />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};

export default function SymptomDiaryTab({ patient }: SymptomDiaryTabProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [triageResult, setTriageResult] = useState<TriageSymptomsOutput | null>(null);

  const handleTriage = () => {
    startTransition(async () => {
      try {
        const result = await triageSymptoms({
          patientContext: {
            age: patient.age,
            gender: patient.gender,
            conditions: patient.diagnosis,
          },
          symptoms: patient.symptoms,
        });
        setTriageResult(result);
        toast({ title: 'Triage Complete', description: `Assessment: ${result.triageLevel}` });
      } catch (error) {
        console.error('Symptom triage failed:', error);
        toast({ title: 'Triage Failed', description: 'Could not run AI symptom analysis.', variant: 'destructive' });
      }
    });
  };

  return (
    <div className="grid gap-6">
      {triageResult && (
        <Alert variant={triageAlertVariants[triageResult.triageLevel]}>
          {triageAlertIcons[triageResult.triageLevel]}
          <AlertTitle>AI Triage Assessment: {triageResult.triageLevel}</AlertTitle>
          <AlertDescription>
            <p className="font-semibold mt-2">Recommendation:</p>
            <p>{triageResult.recommendation}</p>
            <p className="font-semibold mt-2 text-xs">Reasoning:</p>
            <p className="text-xs">{triageResult.reasoning}</p>
          </AlertDescription>
        </Alert>
      )}

       <MentalWellbeingChart symptoms={patient.symptoms} />

      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle>Symptom Diary</CardTitle>
            <CardDescription>Patient-reported symptoms since discharge.</CardDescription>
          </div>
          <Button onClick={handleTriage} disabled={isPending || patient.symptoms.length === 0}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
            Run AI Triage
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Symptom</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patient.symptoms.length > 0 ? (
                patient.symptoms.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{format(parseISO(log.date), 'PPP')}</TableCell>
                    <TableCell className="font-medium">{log.symptom}</TableCell>
                    <TableCell>
                      <Badge variant={severityBadgeVariants[log.severity]}>{log.severity}</Badge>
                    </TableCell>
                    <TableCell>{log.notes}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No symptoms reported.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
