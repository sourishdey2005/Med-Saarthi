'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart'

const data = [
  { name: 'Jan', consents: 85, fhirSyncs: 1200 },
  { name: 'Feb', consents: 88, fhirSyncs: 1500 },
  { name: 'Mar', consents: 92, fhirSyncs: 1800 },
  { name: 'Apr', consents: 95, fhirSyncs: 2200 },
  { name: 'May', consents: 98, fhirSyncs: 2500 },
]

const chartConfig = {
    consents: { label: 'Consent Success %', color: 'hsl(var(--chart-1))' },
    fhirSyncs: { label: 'FHIR Syncs', color: 'hsl(var(--chart-2))' },
}

export default function AbdmIntegrationChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>ABDM Integration Status</CardTitle>
        <CardDescription>Consent success rate & FHIR sync counts.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <BarChart data={data} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis yAxisId="left" stroke="var(--color-consents)" />
            <YAxis yAxisId="right" orientation="right" stroke="var(--color-fhirSyncs)" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            <Bar yAxisId="left" dataKey="consents" fill="var(--color-consents)" radius={4} name="Consent %" />
            <Bar yAxisId="right" dataKey="fhirSyncs" fill="var(--color-fhirSyncs)" radius={4} name="FHIR Syncs" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
