'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { Sankey, Tooltip, Layer, Rectangle } from 'recharts';

interface MedicationReconciliationSankeyProps {
  data: {
    nodes: { name: string }[];
    links: { source: number; target: number; value: number }[];
  };
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length && payload[0].payload) {
    const { source, target } = payload[0].payload;
    let status = 'Continued';
    if(source.name === 'Pre-Admission' && target.name !== 'Post-Discharge') {
        status = 'Started';
    } else if (target.name !== 'Post-Discharge' && !payload[0].payload.target.name.includes(source.name)) {
        status = 'Discontinued';
    }
    
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-1 gap-1">
            <span className="font-bold text-lg">{source.name}</span>
            <span className="text-muted-foreground">{status}</span>
        </div>
      </div>
    );
  }
  return null;
};


export default function MedicationReconciliationSankey({ data }: MedicationReconciliationSankeyProps) {
  const chartConfig = {};

  return (
    <Card>
      <CardHeader>
        <CardTitle>Medication Reconciliation Flow</CardTitle>
        <CardDescription>Illustrates medication changes from pre-admission to post-discharge.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <Sankey
            data={data}
            nodePadding={20}
            margin={{
              left: 100,
              right: 100,
              top: 20,
              bottom: 20,
            }}
            link={{ stroke: 'hsl(var(--primary) / 0.3)', strokeWidth: 2 }}
            node={({ x, y, width, height, index, payload }) => {
              const isOut = x + width / 2 > 500 / 2;
              const isPreAdmission = payload.name === 'Pre-Admission';
              const isPostDischarge = payload.name === 'Post-Discharge';

              let nodeColor = 'hsl(var(--primary))';
              if (isPreAdmission) nodeColor = 'hsl(var(--chart-2))';
              if (isPostDischarge) nodeColor = 'hsl(var(--chart-1))';
              
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
                        className="fill-muted-foreground text-sm font-medium"
                    >
                        {payload.name}
                    </text>
                </Layer>
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
