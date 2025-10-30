'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart'

const data = [
  { month: 'Jan', savings: 15000 },
  { month: 'Feb', savings: 18000 },
  { month: 'Mar', savings: 25000 },
  { month: 'Apr', savings: 32000 },
  { month: 'May', savings: 45000 },
]

const chartConfig = {
    savings: { label: 'Cost Savings (₹)', color: 'hsl(var(--chart-3))' }
}

export default function CostReductionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost-of-Care Reduction</CardTitle>
        <CardDescription>Estimated savings from reduced readmissions.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
           <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
             <defs>
              <linearGradient id="fillSavings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-savings)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-savings)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis 
                tickFormatter={(value) => `₹${Number(value) / 1000}k`}
            />
            <Tooltip content={<ChartTooltipContent formatter={(value) => `₹${value.toLocaleString()}`} />} />
            <Legend />
            <Area type="monotone" dataKey="savings" stroke="var(--color-savings)" fill="url(#fillSavings)" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
