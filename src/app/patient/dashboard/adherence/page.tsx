import { getPatientById } from '@/lib/data'
import { PageHeader } from '@/components/page-header'
import { notFound } from 'next/navigation'
import AdherenceTab from '@/components/patient/adherence-tab'

export default function PatientAdherencePage() {
  const patient = getPatientById('1');

  if (!patient) {
    notFound();
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <PageHeader 
        title="My Adherence" 
        breadcrumbs={[
            { label: 'My Dashboard', href: '/patient/dashboard' },
            { label: 'My Adherence', href: '/patient/dashboard/adherence' }
        ]}
      />
      <div className="grid gap-6">
        <AdherenceTab patient={patient} />
      </div>
    </main>
  );
}
