import { PageHeader } from '@/components/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { HeartPulse } from 'lucide-react'

export default function ReconciliationPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <PageHeader 
        title="Medication Reconciliation" 
        breadcrumbs={[{ href: '/dashboard', label: 'Dashboard' }, { href: '/reconciliation', label: 'Reconciliation' }]}
      />
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Reconciliation Queue</CardTitle>
            <CardDescription>Patients needing medication reconciliation before discharge.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-12 text-center">
                <HeartPulse className="h-16 w-16 text-muted-foreground" />
                <h3 className="text-xl font-bold tracking-tight">
                All Caught Up!
                </h3>
                <p className="text-sm text-muted-foreground">
                There are no patients currently in the reconciliation queue.
                </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
