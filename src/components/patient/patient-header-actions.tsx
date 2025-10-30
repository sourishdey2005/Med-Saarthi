import { Button } from '@/components/ui/button'
import { Share, Printer, Send } from 'lucide-react'

export function PatientHeaderActions() {
  return (
    <>
      <Button variant="outline" size="sm">
        <Share className="mr-2 h-4 w-4" />
        Share
      </Button>
      <Button variant="outline" size="sm">
        <Printer className="mr-2 h-4 w-4" />
        Print
      </Button>
      <Button size="sm">
        <Send className="mr-2 h-4 w-4" />
        Initiate Discharge
      </Button>
    </>
  )
}
