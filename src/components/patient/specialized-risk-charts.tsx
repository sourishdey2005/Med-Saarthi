
'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Alert } from '@/lib/types';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';

interface SpecializedRiskChartsProps {
  alerts: Alert[];
}

const BleedingRiskPlot = () => {
  const data = [
    { day: 'D1', inr: 1.2, riskScore: 10 },
    { day: 'D2', inr: 1.5, riskScore: 15 },
    { day: 'D3', inr: 2.2, riskScore: 30 },
    { day: 'D4', inr: 2.5, riskScore: 40 },
    { day: 'D5', inr: 2.8, riskScore: 55 },
    { day: 'D6', inr: 3.1, riskScore: 70 },
    { day: 'D7', inr: 2.9, riskScore: 60 },
  ];

  const chartConfig = {
    inr: { label: 'INR', color: 'hsl(var(--chart-1))' },
    riskScore: { label: 'Bleeding Risk', color: 'hsl(var(--destructive))' },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Anticoagulant Bleeding Risk</CardTitle>
        <CardDescription>Simulated INR vs. AI-calculated bleeding risk score over time.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis yAxisId="left" label={{ value: 'INR', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: 'Risk Score', angle: -90, position: 'insideRight' }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="inr" stroke="var(--color-inr)" strokeWidth={2} name="INR" />
                <Line yAxisId="right" type="monotone" dataKey="riskScore" stroke="var(--color-riskScore)" strokeWidth={2} name="Bleeding Risk" />
            </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

const AntibioticStewardshipWheel = () => {
  const data = [
    { class: 'Penicillins', suitability: 90, fullMark: 100 },
    { class: 'Cephalosporins', suitability: 80, fullMark: 100 },
    { class: 'Macrolides', suitability: 70, fullMark: 100 },
    { class: 'Fluoroquinolones', suitability: 40, fullMark: 100 },
    { class: 'Carbapenems', suitability: 20, fullMark: 100 },
  ];

  const chartConfig = {
      suitability: { label: 'Suitability Score', color: 'hsl(var(--chart-2))' }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Antibiotic Stewardship Wheel</CardTitle>
        <CardDescription>Suitability of different antibiotic classes for the current diagnosis.</CardDescription>
      </CardHeader>
      <CardContent>
         <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                <PolarGrid />
                <PolarAngleAxis dataKey="class" />
                <PolarRadiusAxis angle={30} domain={[0, 100]}/>
                <Radar name="Suitability" dataKey="suitability" stroke="var(--color-suitability)" fill="var(--color-suitability)" fillOpacity={0.6} />
                <ChartTooltip content={<ChartTooltipContent />} />
            </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

const FoodDrugInteractionMap = () => {
  const data = [
    { name: 'Grapefruit', value: 80, fill: 'hsl(var(--chart-1))' },
    { name: 'Dairy', value: 60, fill: 'hsl(var(--chart-2))' },
    { name: 'Leafy Greens (Vit K)', value: 75, fill: 'hsl(var(--chart-3))' },
    { name: 'Tyramine-rich foods', value: 40, fill: 'hsl(var(--chart-4))' },
    { name: 'Turmeric (High Dose)', value: 50, fill: 'hsl(var(--chart-5))' },
  ];

   const chartConfig = data.reduce((acc, item) => {
    acc[item.name] = { label: item.name, color: item.fill };
    return acc;
  }, {} as any);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Food-Drug Interaction Map</CardTitle>
        <CardDescription>Visualizing potential interactions with common foods and substances.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
                <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                     {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                </Pie>
            </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};


export default function SpecializedRiskCharts({ alerts }: SpecializedRiskChartsProps) {
  const hasAnticoagulantAlert = alerts.some(a => a.description.toLowerCase().includes('warfarin') || a.description.toLowerCase().includes('aspirin'));
  const hasAntibioticAlert = alerts.some(a => a.type === 'Antibiotic-Stewardship');
  const hasFoodInteractionAlert = alerts.some(a => a.type === 'Drug-Food-Interaction');

  if (!hasAnticoagulantAlert && !hasAntibioticAlert && !hasFoodInteractionAlert) {
    return null;
  }

  return (
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      {hasAnticoagulantAlert && <BleedingRiskPlot />}
      {hasAntibioticAlert && <AntibioticStewardshipWheel />}
      {hasFoodInteractionAlert && <FoodDrugInteractionMap />}
    </div>
  );
}
