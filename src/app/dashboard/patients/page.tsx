import { PageHeader } from '@/components/page-header'
import { PatientList } from '@/components/dashboard/patient-list'

export default function PatientsPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <PageHeader 
        title="Patients" 
        breadcrumbs={[{ href: '/dashboard', label: 'Dashboard' }, { href: '/dashboard/patients', label: 'Patients' }]}
      />
      <div className="grid gap-6">
        <PatientList />
      </div>
    </main>
  )
}
