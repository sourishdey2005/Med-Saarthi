import { getPatientById } from '@/lib/data'
import { PageHeader } from '@/components/page-header'
import { notFound } from 'next/navigation'
import MedicationTab from '@/components/patient/medication-tab'

export default function PatientMedicationsPage() {
  const patient = getPatientById('1');

  if (!patient) {
    notFound();
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <PageHeader 
        title="My Medications" 
        breadcrumbs={[
            { label: 'My Dashboard', href: '/patient/dashboard' },
            { label: 'My Medications', href: '/patient/dashboard/medications' }
        ]}
      />
      <div className="grid gap-6">
         {/* Reusing MedicationTab, could be simplified for patient view */}
        <MedicationTab patient={patient} />
      </div>
    </main>
  );
}
