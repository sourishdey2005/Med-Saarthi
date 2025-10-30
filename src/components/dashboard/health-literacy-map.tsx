'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const data = [
  { region: 'Mumbai', score: 78, color: 'hsl(var(--chart-1))' },
  { region: 'Delhi', score: 72, color: 'hsl(var(--chart-2))' },
  { region: 'Rural MH', score: 55, color: 'hsl(var(--chart-3))' },
  { region: 'Rural UP', score: 48, color: 'hsl(var(--chart-4))' },
  { region: 'Kolkata', score: 68, color: 'hsl(var(--chart-5))' },
  { region: 'Chennai', score: 82, color: 'hsl(var(--chart-1))' },
];

const chartConfig = {
    score: { label: 'Health Literacy Index' },
    mumbai: { label: 'Mumbai', color: 'hsl(var(--chart-1))' },
    delhi: { label: 'Delhi', color: 'hsl(var(--chart-2))' },
    ruralMH: { label: 'Rural MH', color: 'hsl(var(--chart-3))' },
    ruralUP: { label: 'Rural UP', color: 'hsl(var(--chart-4))' },
    kolkata: { label: 'Kolkata', color: 'hsl(var(--chart-5))' },
    chennai: { label: 'Chennai', color: 'hsl(var(--chart-1))' },
}

export default function HealthLiteracyMap() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Literacy Index by Region</CardTitle>
        <CardDescription>Public health surveillance and hospital benchmarking tool.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid horizontal={false} />
                <YAxis dataKey="region" type="category" tickLine={false} axisLine={false} tickMargin={10} />
                <XAxis type="number" hide />
                <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
                <Legend />
                <Bar dataKey="score" name="Health Literacy Index" radius={5} fill="var(--color-mumbai)" />
            </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
