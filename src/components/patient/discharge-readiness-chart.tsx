'use client';

import React from 'react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

interface DischargeReadinessChartProps {
  data: {
    metric: string;
    score: number;
    fullMark: number;
  }[];
}

const chartConfig = {
  score: {
    label: 'Score',
    color: 'hsl(var(--primary))',
  },
};

export default function DischargeReadinessChart({ data }: DischargeReadinessChartProps) {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <RadarChart data={data}>
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <PolarGrid />
        <PolarAngleAxis dataKey="metric" />
        <PolarRadiusAxis angle={30} domain={[0, 100]} />
        <Radar name="Readiness Score" dataKey="score" stroke="var(--color-score)" fill="var(--color-score)" fillOpacity={0.6} />
        <ChartLegend content={<ChartLegendContent />} />
      </RadarChart>
    </ChartContainer>
  );
}
