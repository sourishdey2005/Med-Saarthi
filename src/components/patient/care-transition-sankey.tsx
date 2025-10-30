'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { Sankey, Tooltip } from 'recharts';

interface CareTransitionSankeyProps {
  data: {
    nodes: { name: string }[];
    links: { source: number; target: number; value: number }[];
  };
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { source, target, value } = payload[0].payload;
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col space-y-1">
            <span className="text-muted-foreground">{source.name}</span>
            <span className="font-bold text-lg">{`->`}</span>
            <span className="text-muted-foreground">{target.name}</span>
            <span className="font-bold">{value}%</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};


export default function CareTransitionSankey({ data }: CareTransitionSankeyProps) {
  const chartConfig = {};

  return (
    <Card>
      <CardHeader>
        <CardTitle>Care Transition Flow</CardTitle>
        <CardDescription>Patient journey from admission to discharge.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <Sankey
            width={960}
            height={200}
            data={data}
            nodePadding={50}
            margin={{
              left: 20,
              right: 20,
              top: 20,
              bottom: 20,
            }}
            link={{ stroke: 'hsl(var(--primary) / 0.3)' }}
            node={({ x, y, width, height, index, payload, containerWidth }) => {
              const isOut = x + width / 2 > containerWidth / 2;
              return (
                 <g>
                    <rect x={x} y={y} width={width} height={height} fill="hsl(var(--primary))" stroke="hsl(var(--card))" strokeWidth="2" rx="3"/>
                    <text
                        x={isOut ? x - 6 : x + width + 6}
                        y={y + height / 2}
                        dy="0.355em"
                        textAnchor={isOut ? 'end' : 'start'}
                        className="fill-muted-foreground text-sm"
                    >
                        {payload.name}
                    </text>
                </g>
              );
            }}
          >
            <Tooltip content={<CustomTooltip />} />
          </Sankey>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
