'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PolarAngleAxis, RadialBar, RadialBarChart } from 'recharts';

interface HealthLiteracyGaugeProps {
  score: number;
}

const getLiteracyLevel = (score: number) => {
  if (score >= 85) return 'Proficient';
  if (score >= 65) return 'Intermediate';
  if (score >= 40) return 'Basic';
  return 'Below Basic';
};

const getScoreColor = (score: number) => {
  if (score >= 85) return 'hsl(var(--chart-2))';
  if (score >= 65) return 'hsl(var(--chart-1))';
  if (score >= 40) return 'hsl(var(--chart-4))';
  return 'hsl(var(--destructive))';
};

export default function HealthLiteracyGauge({ score }: HealthLiteracyGaugeProps) {
  const chartData = [{ name: 'Score', value: score, fill: getScoreColor(score) }];
  const literacyLevel = getLiteracyLevel(score);

  const chartConfig = {
    value: { label: 'Score' },
    score: { color: getScoreColor(score) },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Literacy Score</CardTitle>
        <CardDescription>Patient's estimated ability to comprehend health info.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <RadialBarChart
            data={chartData}
            startAngle={-90}
            endAngle={270}
            innerRadius="70%"
            outerRadius="100%"
            barSize={20}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar
              background
              dataKey="value"
              cornerRadius={10}
              className="fill-[var(--color-score)]"
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="name" />}
            />
          </RadialBarChart>
        </ChartContainer>
        <div className="text-center -mt-16">
            <p className="text-3xl font-bold">{score}</p>
            <p className="text-sm font-medium" style={{color: getScoreColor(score)}}>
                {literacyLevel}
            </p>
        </div>
      </CardContent>
    </Card>
  );
}
