import { getPatientById } from '@/lib/data'
import { PageHeader } from '@/components/page-header'
import { DischargeSummaryCard } from '@/components/patient/dashboard/discharge-summary-card'
import { MedicationTimeline } from '@/components/patient/dashboard/medication-timeline'
import { CaregiverInfoCard } from '@/components/patient/dashboard/caregiver-info-card'

export default function PatientDashboardPage() {
  // For this prototype, we'll hardcode the patient with ID '1'
  const patient = getPatientById('1');

  if (!patient) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <PageHeader title="Patient Not Found" breadcrumbs={[{ label: 'Dashboard', href: '/patient/dashboard' }]} />
        <p>The requested patient could not be found.</p>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <PageHeader 
        title={`Welcome, ${patient.name.split(' ')[0]}!`} 
        breadcrumbs={[{ label: 'My Dashboard', href: '/patient/dashboard' }]}
      />
      <div className="grid gap-6">
        <DischargeSummaryCard patient={patient} />
        <MedicationTimeline medications={patient.medications.postDischarge} />
        <CaregiverInfoCard caregivers={patient.caregivers} />
      </div>
    </main>
  );
}
