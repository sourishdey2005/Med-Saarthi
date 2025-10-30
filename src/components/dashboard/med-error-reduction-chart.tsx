'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart'

const data = [
  { month: 'Jan', errors: 12.5 },
  { month: 'Feb', errors: 11.2 },
  { month: 'Mar', errors: 9.8 },
  { month: 'Apr', errors: 8.1 },
  { month: 'May', errors: 6.5 },
]

const chartConfig = {
    errors: { label: 'Medication Errors (%)', color: 'hsl(var(--destructive))' },
}

export default function MedErrorReductionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Medication Error Reduction</CardTitle>
        <CardDescription>Rate of medication errors over time.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8}/>
            <YAxis unit="%" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            <Line type="monotone" dataKey="errors" stroke="var(--color-errors)" strokeWidth={3} dot={false} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
