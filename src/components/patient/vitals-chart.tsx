import type { Vital } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

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

export default function VitalsChart({ vitals }: VitalsChartProps) {
  const formattedVitals = vitals.map(v => ({
    ...v,
    date: new Date(v.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  }))
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vitals Trend</CardTitle>
        <CardDescription>Blood pressure and heart rate over the last few days.</CardDescription>
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
              tickFormatter={(value) => value}
            />
            <YAxis
                yAxisId="bp"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                domain={[60, 160]}
                label={{ value: 'BP (mmHg)', angle: -90, position: 'insideLeft' }}
            />
            <YAxis
                yAxisId="hr"
                orientation="right"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                domain={[50, 120]}
                label={{ value: 'HR (bpm)', angle: -90, position: 'insideRight' }}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <defs>
                <linearGradient id="fillSystolic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-systolic)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-systolic)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillDiastolic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-diastolic)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-diastolic)" stopOpacity={0.1} />
                </linearGradient>
            </defs>
            <Area
              yAxisId="bp"
              dataKey="systolic"
              type="natural"
              fill="url(#fillSystolic)"
              stroke="var(--color-systolic)"
              stackId="a"
            />
            <Area
              yAxisId="bp"
              dataKey="diastolic"
              type="natural"
              fill="url(#fillDiastolic)"
              stroke="var(--color-diastolic)"
              stackId="b"
            />
            <Area
              yAxisId="hr"
              dataKey="heartRate"
              type="natural"
              fill="transparent"
              stroke="var(--color-heartRate)"
              strokeWidth={3}
              dot={true}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
