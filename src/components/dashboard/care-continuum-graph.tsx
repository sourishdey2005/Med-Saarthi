'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { Sankey, Layer, Rectangle } from 'recharts';

const data = {
  nodes: [
    { name: 'OPD Visit' },
    { name: 'ER Visit' },
    { name: 'IPD Admission' },
    { name: 'ICU' },
    { name: 'Discharge' },
    { name: 'Home Care' },
    { name: 'Follow-up' },
  ],
  links: [
    { source: 0, target: 2, value: 8 },
    { source: 1, target: 2, value: 4 },
    { source: 2, target: 3, value: 3 },
    { source: 2, target: 4, value: 9 },
    { source: 3, target: 4, value: 3 },
    { source: 4, target: 5, value: 10 },
    { source: 4, target: 6, value: 2 },
    { source: 5, target: 6, value: 10 },
  ],
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length && payload[0].payload) {
    const { source, target, value } = payload[0].payload;
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-1 gap-1 text-sm">
            <span>{`${source.name} -> ${target.name}`}</span>
            <span className="font-bold">{`${value} Patients`}</span>
        </div>
      </div>
    );
  }
  return null;
};


export default function CareContinuumGraph() {
  const chartConfig = {}; 
  const nodeColors: { [key: string]: string } = {
    'OPD Visit': 'hsl(var(--chart-1))',
    'ER Visit': 'hsl(var(--destructive))',
    'IPD Admission': 'hsl(var(--chart-2))',
    'ICU': 'hsl(var(--chart-5))',
    'Discharge': 'hsl(var(--chart-3))',
    'Home Care': 'hsl(var(--chart-4))',
    'Follow-up': 'hsl(var(--secondary))',
  };

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>OPD-to-IPD Continuity Graph</CardTitle>
        <CardDescription>Mapping the continuum of patient care across departments.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <Sankey
            data={data}
            nodePadding={15}
            margin={{
              left: 100,
              right: 100,
              top: 5,
              bottom: 5,
            }}
            link={{ stroke: 'hsl(var(--primary) / 0.3)', strokeWidth: 2 }}
            node={({ x, y, width, height, index, payload }) => {
              const isOut = x + width / 2 > 700 / 2;
              const nodeColor = nodeColors[payload.name];
              
              return (
                 <Layer>
                    <Rectangle 
                        x={x} 
                        y={y} 
                        width={width} 
                        height={height} 
                        fill={nodeColor} 
                        stroke="hsl(var(--card))" 
                        strokeWidth="2" 
                        rx="3"
                    />
                    <text
                        x={isOut ? x - 6 : x + width + 6}
                        y={y + height / 2}
                        dy="0.355em"
                        textAnchor={isOut ? 'end' : 'start'}
                        className="fill-muted-foreground text-xs font-medium"
                    >
                        {payload.name}
                    </text>
                </Layer>
              );
            }}
          >
            <ChartTooltip content={<CustomTooltip />} />
          </Sankey>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
