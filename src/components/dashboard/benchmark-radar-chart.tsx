'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer, CartesianGrid } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart'

const data = [
  { metric: 'Readmission Rate', hospital: 8, standard: 15 },
  { metric: 'Avg. LOS', hospital: 4.5, standard: 6 },
  { metric: 'Adherence', hospital: 92, standard: 80 },
  { metric: 'Patient Sat.', hospital: 95, standard: 85 },
  { metric: 'Med Rec Time (min)', hospital: 15, standard: 30 },
]

// Normalize data for radar chart that expects similar scales
const normalizedData = data.map(item => {
    let hospitalScore, standardScore;
    if (item.metric === 'Readmission Rate' || item.metric === 'Avg. LOS' || item.metric === 'Med Rec Time (min)') {
        // For these metrics, lower is better. We invert the score.
        const maxVal = Math.max(...data.filter(d => d.metric === item.metric).map(d => Math.max(d.hospital, d.standard)));
        hospitalScore = 100 - (item.hospital / maxVal) * 100;
        standardScore = 100 - (item.standard / maxVal) * 100;
    } else {
        hospitalScore = item.hospital;
        standardScore = item.standard;
    }
    return {
        metric: item.metric,
        hospital: hospitalScore,
        standard: standardScore,
    };
});

const chartConfig = {
    hospital: { label: 'Our Hospital', color: 'hsl(var(--chart-1))' },
    standard: { label: 'National Standard', color: 'hsl(var(--chart-2))' },
}

export default function BenchmarkRadarChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hospital Benchmark</CardTitle>
        <CardDescription>Efficiency compared to national standards.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <RadarChart data={normalizedData}>
            <CartesianGrid />
            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend />
            <Radar name="Our Hospital" dataKey="hospital" stroke="var(--color-hospital)" fill="var(--color-hospital)" fillOpacity={0.6} />
            <Radar name="National Standard" dataKey="standard" stroke="var(--color-standard)" fill="var(--color-standard)" fillOpacity={0.4} />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
