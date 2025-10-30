'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { Sankey, Tooltip, Layer, Rectangle } from 'recharts';
import type { Alert } from '@/lib/types';

interface DrugInteractionGraphProps {
  alerts: Alert[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length && payload[0].payload) {
    const { source, target, value, mechanism } = payload[0].payload;
    if (value === 0) return null;

    return (
      <div className="rounded-lg border bg-background p-3 shadow-sm max-w-sm">
        <div className="grid grid-cols-1 gap-1.5">
            <p className="font-bold text-base">{`${source.name} ↔ ${target.name}`}</p>
            <p className="font-semibold text-primary">{mechanism}</p>
            <p className="text-xs text-muted-foreground">{`This interaction is flagged as a potential risk. The underlying mechanism involves ${mechanism.toLowerCase()}.`}</p>
        </div>
      </div>
    );
  }
  return null;
};

export default function DrugInteractionGraph({ alerts }: DrugInteractionGraphProps) {
    const nodes: { name: string }[] = [];
    const links: { source: number; target: number; value: number, mechanism?: string }[] = [];
    const nodeMap = new Map<string, number>();

    const getNodeIndex = (name: string) => {
        if (!nodeMap.has(name)) {
            nodeMap.set(name, nodes.length);
            nodes.push({ name });
        }
        return nodeMap.get(name)!;
    };
    
    // Create nodes for medications and interaction mechanisms
    alerts.forEach(alert => {
        const parts = alert.description.match(/([a-zA-Z0-9_ -]+) and ([a-zA-Z0-9_ -]+) have a potential interaction/);
        if (parts && parts.length >= 3) {
            const med1 = parts[1].trim();
            const med2 = parts[2].trim();
            const mechanism = alert.mechanism || 'General Interaction';
            
            const med1Index = getNodeIndex(med1);
            const med2Index = getNodeIndex(med2);
            const mechanismIndex = getNodeIndex(mechanism);
            
            // Link meds to the mechanism
            links.push({ source: med1Index, target: mechanismIndex, value: 1, mechanism });
            links.push({ source: mechanismIndex, target: med2Index, value: 1, mechanism });
        }
    });

  const data = { nodes, links };
  
  const chartConfig = {};
  const nodeColors: { [key: string]: string } = {
    'CYP3A4 Inhibition': 'hsl(var(--chart-1))',
    'Increased Bleeding Risk': 'hsl(var(--destructive))',
    'QT Prolongation': 'hsl(var(--chart-4))',
    'Serotonin Syndrome': 'hsl(var(--chart-5))',
    'default': 'hsl(var(--secondary))',
    'mechanism': 'hsl(var(--primary))'
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Drug Interaction Pathways</CardTitle>
        <CardDescription>Visualizing shared metabolic pathways and interaction mechanisms.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <Sankey
            data={data}
            nodePadding={30}
            nodeWidth={15}
            margin={{
              left: 120,
              right: 120,
              top: 20,
              bottom: 20,
            }}
            link={{ stroke: 'hsl(var(--primary) / 0.4)', strokeWidth: 2, strokeOpacity: 0.8 }}
            node={({ x, y, width, height, index, payload }) => {
              const isOut = x + width / 2 > 600;
              const isMechanismNode = !payload.sourceLinks.length || !payload.targetLinks.length;
              
              let nodeColor = nodeColors.default;
              if (isMechanismNode) {
                  nodeColor = nodeColors[payload.name] || nodeColors.mechanism;
              }
              
              return (
                 <Layer>
                    <Rectangle 
                        x={x} 
                        y={y} 
                        width={width} 
                        height={height} 
                        fill={nodeColor} 
                        strokeWidth={0}
                        radius={2}
                    />
                    <text
                        x={isOut ? x - 8 : x + width + 8}
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
