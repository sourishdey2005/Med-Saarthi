'use client'

import React, { useState, useEffect } from 'react'
import type { Vital } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ReferenceLine } from 'recharts'
import { add, format, parseISO } from 'date-fns'

interface VitalsChartProps {
  vitals: Vital[]
}

const chartConfig = {
  systolic: {
    label: 'Systolic',
    color: 'hsl(var(--chart-1))',
  },
  diastolic: {
    label: 'Diastolic',
    color: 'hsl(var(--chart-2))',
  },
  heartRate: {
    label: 'Heart Rate',
    color: 'hsl(var(--chart-3))',
  },
}

// Function to generate a more realistic fluctuation
const fluctuate = (value: number, amount: number) => {
  return value + (Math.random() - 0.5) * amount
}

export default function VitalsChart({ vitals: initialVitals }: VitalsChartProps) {
  const [vitals, setVitals] = useState(() =>
    initialVitals.map((v) => ({
      ...v,
      date: parseISO(v.date),
    }))
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setVitals((currentVitals) => {
        if (currentVitals.length === 0) return [];
        const lastVital = currentVitals[currentVitals.length - 1]
        const newDate = add(lastVital.date, { seconds: 2 })

        const newVital = {
          date: newDate,
          systolic: Math.round(fluctuate(lastVital.systolic, 4)),
          diastolic: Math.round(fluctuate(lastVital.diastolic, 3)),
          heartRate: Math.round(fluctuate(lastVital.heartRate, 2)),
          glucose: lastVital.glucose ? Math.round(fluctuate(lastVital.glucose, 5)) : undefined,
          weight: lastVital.weight ? fluctuate(lastVital.weight, 0.1) : undefined,
        }
        
        // Keep the chart to a reasonable number of data points
        const newVitals = [...currentVitals, newVital];
        if (newVitals.length > 20) {
          return newVitals.slice(newVitals.length - 20);
        }
        return newVitals;
      })
    }, 2000) // Update every 2 seconds

    return () => clearInterval(interval)
  }, [])

  const formattedVitals = vitals.map((v) => ({
    ...v,
    date: format(v.date, 'HH:mm:ss'),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Vitals Trend</CardTitle>
        <CardDescription>
          Simulating real-time blood pressure and heart rate monitoring.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <AreaChart data={formattedVitals} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              yAxisId="bp"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[50, 180]}
              tickFormatter={(value) => `${value}`}
              label={{
                value: 'BP (mmHg)',
                angle: -90,
                position: 'insideLeft',
                offset: -10,
              }}
            />
            <YAxis
              yAxisId="hr"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[40, 130]}
              tickFormatter={(value) => `${value}`}
              label={{
                value: 'HR (bpm)',
                angle: -90,
                position: 'insideRight',
                offset: 10,
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <defs>
              <linearGradient id="fillSystolic" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-systolic)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-systolic)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillDiastolic" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-diastolic)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-diastolic)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <ReferenceLine yAxisId="bp" y={140} label={{ value: 'High BP', position: 'insideTopRight' }} stroke="red" strokeDasharray="3 3" />
            <ReferenceLine yAxisId="bp" y={90} label={{ value: 'Normal BP', position: 'insideBottomRight' }} stroke="green" strokeDasharray="3 3" />
            <Area
              yAxisId="bp"
              dataKey="systolic"
              type="natural"
              fill="url(#fillSystolic)"
              stroke="var(--color-systolic)"
              stackId="a"
              isAnimationActive={false}
            />
            <Area
              yAxisId="bp"
              dataKey="diastolic"
              type="natural"
              fill="url(#fillDiastolic)"
              stroke="var(--color-diastolic)"
              stackId="b"
              isAnimationActive={false}
            />
            <Area
              yAxisId="hr"
              dataKey="heartRate"
              type="natural"
              fill="transparent"
              stroke="var(--color-heartRate)"
              strokeWidth={3}
              dot={true}
              isAnimationActive={false}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
