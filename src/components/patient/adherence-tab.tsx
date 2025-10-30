'use client';

import React from 'react';
import type { Patient, AdherenceEvent, Vital } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, Hourglass, CalendarDays, BarChart, BellRing, TrendingUp, HeartPulse } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { Bar, CartesianGrid, XAxis, YAxis, BarChart as RechartsBarChart, ScatterChart, Scatter, Tooltip, Legend } from 'recharts';
import { format, parseISO, startOfDay } from 'date-fns';
import PatientEngagementChart from './patient-engagement-chart';

interface AdherenceTabProps {
  patient: Patient;
}

const statusIcons: { [key in AdherenceEvent['status']]: React.ReactNode } = {
  Taken: <CheckCircle2 className="h-5 w-5 text-green-500" />,
  Missed: <XCircle className="h-5 w-5 text-destructive" />,
  Pending: <Hourglass className="h-5 w-5 text-yellow-500" />,
};

const AdherenceChart = ({ adherenceData }: { adherenceData: AdherenceEvent[] }) => {
  const dataByDay = adherenceData.reduce((acc, event) => {
    const day = format(startOfDay(parseISO(event.scheduledTime)), 'yyyy-MM-dd');
    if (!acc[day]) {
      acc[day] = { day, expected: 0, taken: 0 };
    }
    acc[day].expected += 1;
    if (event.status === 'Taken') {
      acc[day].taken += 1;
    }
    return acc;
  }, {} as Record<string, { day: string; expected: number; taken: number }>);

  const chartData = Object.values(dataByDay)
    .sort((a, b) => a.day.localeCompare(b.day))
    .map(d => ({ ...d, day: format(parseISO(d.day), 'MMM dd') }));

  const chartConfig = {
    expected: { label: 'Expected', color: 'hsl(var(--secondary))' },
    taken: { label: 'Taken', color: 'hsl(var(--primary))' },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adherence Trend</CardTitle>
        <CardDescription>Expected vs. Actual doses taken per day.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <RechartsBarChart data={chartData} margin={{ top: 20 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="expected" fill="var(--color-expected)" radius={4} />
            <Bar dataKey="taken" fill="var(--color-taken)" radius={4} />
          </RechartsBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

const AdherenceCorrelationChart = ({ adherenceData }: { adherenceData: AdherenceEvent[] }) => {
    const takenDoses = adherenceData.filter(e => e.status === 'Taken');
    const adherenceRateByDay = takenDoses.reduce((acc, event) => {
        const day = format(startOfDay(parseISO(event.scheduledTime)), 'yyyy-MM-dd');
        if (!acc[day]) {
            acc[day] = { count: 0, totalScore: 0 };
        }
        acc[day].count += 1;
        acc[day].totalScore += event.recoveryScore || 0;
        return acc;
    }, {} as Record<string, { count: number, totalScore: number }>);

    const chartData = Object.keys(adherenceRateByDay).map(day => {
        const entry = adherenceRateByDay[day];
        return {
            adherence: entry.count, // Using count as a proxy for daily adherence
            recovery: entry.totalScore / entry.count,
        };
    });

    const chartConfig = {
        recovery: { label: 'Recovery Score', color: 'hsl(var(--chart-1))' }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Adherence-Outcome Correlation</CardTitle>
                <CardDescription>Correlation between daily adherence and recovery score.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[200px] w-full">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 10, left: -10 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" dataKey="adherence" name="Doses Taken" unit="" />
                        <YAxis type="number" dataKey="recovery" name="Recovery Score" unit="%" />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<ChartTooltipContent />} />
                        <Legend />
                        <Scatter name="Recovery" data={chartData} fill="var(--color-recovery)" />
                    </ScatterChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

const HomeMonitoringChart = ({ vitals }: { vitals: Vital[] }) => {
    const chartData = vitals.map(v => ({
        date: format(parseISO(v.date), 'MMM dd'),
        Glucose: v.glucose,
        Weight: v.weight,
    }));

    const chartConfig = {
        Glucose: { label: 'Glucose (mg/dL)', color: 'hsl(var(--chart-3))' },
        Weight: { label: 'Weight (kg)', color: 'hsl(var(--chart-4))' },
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Home Monitoring</CardTitle>
                <CardDescription>Trends for blood glucose and weight.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[200px] w-full">
                    <RechartsBarChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                        <YAxis yAxisId="left" stroke="var(--color-Glucose)" />
                        <YAxis yAxisId="right" orientation="right" stroke="var(--color-Weight)" />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar yAxisId="left" dataKey="Glucose" fill="var(--color-Glucose)" radius={4} />
                        <Bar yAxisId="right" dataKey="Weight" fill="var(--color-Weight)" radius={4} />
                    </RechartsBarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};


export default function AdherenceTab({ patient }: AdherenceTabProps) {
  const totalDoses = patient.adherence.length;
  const takenDoses = patient.adherence.filter((a) => a.status === 'Taken').length;
  const missedDoses = patient.adherence.filter((a) => a.status === 'Missed').length;
  const adherenceRate = totalDoses > 0 ? Math.round((takenDoses / (takenDoses + missedDoses)) * 100) : 0;

  const upcomingDoses = patient.adherence.filter((a) => a.status === 'Pending').slice(0, 5);

  const engagementData = [
    { name: 'Reminders Opened', value: 45, fill: 'hsl(var(--chart-1))' },
    { name: 'Educational Videos Watched', value: 25, fill: 'hsl(var(--chart-2))' },
    { name: 'Symptoms Logged', value: 15, fill: 'hsl(var(--chart-3))' },
    { name: 'Caregiver Interactions', value: 10, fill: 'hsl(var(--chart-4))' },
  ];

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Overall Adherence</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adherenceRate}%</div>
            <p className="text-xs text-muted-foreground">
              {takenDoses} of {takenDoses + missedDoses} doses taken
            </p>
            <Progress value={adherenceRate} className="mt-4" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Doses Taken</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{takenDoses}</div>
            <p className="text-xs text-muted-foreground">On-time or with slight delay</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Doses Missed</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{missedDoses}</div>
            <p className="text-xs text-muted-foreground">No adherence reported</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <AdherenceChart adherenceData={patient.adherence} />
        <PatientEngagementChart data={engagementData} />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <HomeMonitoringChart vitals={patient.vitals} />
        <AdherenceCorrelationChart adherenceData={patient.adherence} />
      </div>


       <Card>
        <CardHeader>
          <CardTitle>Upcoming Reminders</CardTitle>
          <CardDescription>Simulated view of upcoming WhatsApp/SMS nudges.</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingDoses.length > 0 ? (
            <ul className="space-y-4">
              {upcomingDoses.map((dose) => (
                <li key={dose.id} className="flex items-center">
                  <BellRing className="h-5 w-5 mr-3 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium">{dose.medicationName}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(parseISO(dose.scheduledTime), "MMM dd 'at' hh:mm a")}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
              <div className="text-sm text-center text-muted-foreground py-8">
                  <CalendarDays className="mx-auto h-8 w-8 mb-2"/>
                  <p>No upcoming medication reminders.</p>
              </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Adherence Log</CardTitle>
          <CardDescription>A detailed log of the patient's medication adherence.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medication</TableHead>
                <TableHead>Scheduled Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reported At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patient.adherence.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.medicationName}</TableCell>
                  <TableCell>{format(parseISO(event.scheduledTime), 'PPpp')}</TableCell>
                  <TableCell>
                    <Badge variant={event.status === 'Taken' ? 'secondary' : event.status === 'Missed' ? 'destructive' : 'outline'}>
                      {statusIcons[event.status]}
                      <span className="ml-2">{event.status}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>{event.actualTime ? format(parseISO(event.actualTime), 'PPpp') : 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
