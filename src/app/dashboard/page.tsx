import { PageHeader } from '@/components/page-header'
import { PatientList } from '@/components/dashboard/patient-list'
import AuditLogTimeline from '@/components/dashboard/audit-log-timeline'
import AbdmIntegrationChart from '@/components/dashboard/abdm-integration-chart'
import MedErrorReductionChart from '@/components/dashboard/med-error-reduction-chart'
import BenchmarkRadarChart from '@/components/dashboard/benchmark-radar-chart'
import CostReductionChart from '@/components/dashboard/cost-reduction-chart'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import HealthLiteracyMap from '@/components/dashboard/health-literacy-map'
import CareContinuumGraph from '@/components/dashboard/care-continuum-graph'


export default function DashboardPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <PageHeader 
        title="Welcome, Dr. Desai!" 
        breadcrumbs={[{ href: '/dashboard', label: 'Dashboard' }]}
      />
      <div className="grid gap-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AbdmIntegrationChart />
            <MedErrorReductionChart />
            <CostReductionChart />
            <BenchmarkRadarChart />
            <HealthLiteracyMap />
            <CareContinuumGraph />
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Audit Log</CardTitle>
                <CardDescription>Recent activities across the platform.</CardDescription>
              </CardHeader>
              <CardContent>
                <AuditLogTimeline />
              </CardContent>
            </Card>
        </div>
        <PatientList />
      </div>
    </main>
  )
}
