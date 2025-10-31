import { getPatientById } from '@/lib/data'
import { PageHeader } from '@/components/page-header'
import { notFound } from 'next/navigation'
import DischargeTab from '@/components/patient/discharge-tab'

export default function PatientSummaryPage() {
  // For this prototype, we'll hardcode the patient with ID '1'
  const patient = getPatientById('1');

  if (!patient) {
    notFound();
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <PageHeader 
        title="My Discharge Summary" 
        breadcrumbs={[
            { label: 'My Dashboard', href: '/patient/dashboard' },
            { label: 'Discharge Summary', href: '/patient/dashboard/summary' }
        ]}
      />
      <div className="grid gap-6">
        {/* We can reuse the DischargeTab component, maybe a simplified version later */}
        <DischargeTab patient={patient} />
      </div>
    </main>
  );
}
