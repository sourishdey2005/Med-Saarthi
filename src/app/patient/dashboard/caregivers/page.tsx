import { getPatientById } from '@/lib/data'
import { PageHeader } from '@/components/page-header'
import { notFound } from 'next/navigation'
import CaregiverTab from '@/components/patient/caregiver-tab'

export default function PatientCaregiversPage() {
  const patient = getPatientById('1');

  if (!patient) {
    notFound();
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <PageHeader 
        title="My Caregivers" 
        breadcrumbs={[
            { label: 'My Dashboard', href: '/patient/dashboard' },
            { label: 'My Caregivers', href: '/patient/dashboard/caregivers' }
        ]}
      />
      <div className="grid gap-6">
        <CaregiverTab patient={patient} />
      </div>
    </main>
  );
}
