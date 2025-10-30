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
    const { source, target, value } = payload[0].payload;
    if (value === 0) return null;

    let status = 'Continued';
    if (source.name === 'Pre-Admission' && target.name !== 'Post-Discharge' && !target.name.includes('Discontinued') && !payload.find((p:any) => p.payload.target.name ==='Discontinued')) {
        const isNew = !payload[0].payload.source.payload.targetLinks.some((l:any) => l.source.name === target.name && l.target.name === 'Pre-Admission');
        if(isNew) status = 'New';
    }
     else if (target.name === 'Discontinued') {
        status = 'Discontinued';
    } else if (source.name !== 'Pre-Admission' && source.name !== 'Post-Discharge' && target.name === 'Post-Discharge' ) {
         status = 'Continued';
    }
    
    // Don't show tooltip for structural nodes
    if (source.name === 'Pre-Admission' && target.name === 'Discontinued') return null;
    if (source.name === 'Discontinued') return null;


    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-1 gap-1">
            <span className="font-bold text-lg">{source.name === 'Pre-Admission' ? target.name : source.name}</span>
            <span className="text-muted-foreground">{status}</span>
        </div>
      </div>
    );
  }
  return null;
};


export default function MedicationReconciliationSankey({ data }: MedicationReconciliationSankeyProps) {
  const chartConfig = {};
  const nodeColors: { [key: string]: string } = {
    'Pre-Admission': 'hsl(var(--chart-2))',
    'Post-Discharge': 'hsl(var(--chart-1))',
    'Discontinued': 'hsl(var(--destructive))',
    'default': 'hsl(var(--primary))'
  };


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
              
              const nodeColor = nodeColors[payload.name] || nodeColors.default;
              
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
