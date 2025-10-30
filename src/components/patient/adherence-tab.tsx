'use client';

import React from 'react';
import type { Patient, AdherenceEvent } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, Hourglass, CalendarDays, BarChart, BellRing } from 'lucide-react';
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
import { Bar, CartesianGrid, XAxis, YAxis, BarChart as RechartsBarChart } from 'recharts';
import { format, parseISO, startOfDay } from 'date-fns';

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

export default function AdherenceTab({ patient }: AdherenceTabProps) {
  const totalDoses = patient.adherence.length;
  const takenDoses = patient.adherence.filter((a) => a.status === 'Taken').length;
  const missedDoses = patient.adherence.filter((a) => a.status === 'Missed').length;
  const adherenceRate = totalDoses > 0 ? Math.round((takenDoses / (takenDoses + missedDoses)) * 100) : 0;

  const upcomingDoses = patient.adherence.filter((a) => a.status === 'Pending').slice(0, 5);

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
      </div>

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
