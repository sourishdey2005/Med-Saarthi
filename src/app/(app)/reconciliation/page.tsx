import { PageHeader } from '@/components/page-header'
import { ReconciliationList } from '@/components/reconciliation/reconciliation-list'

export default function ReconciliationPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <PageHeader 
        title="Medication Reconciliation" 
        breadcrumbs={[{ href: '/dashboard', label: 'Dashboard' }, { href: '/reconciliation', label: 'Reconciliation' }]}
      />
      <div className="grid gap-6">
        <ReconciliationList />
      </div>
    </main>
  )
}
