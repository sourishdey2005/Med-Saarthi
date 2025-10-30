import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MedSaarthiIcon, AbhaIcon } from '@/components/icons'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="mx-auto w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <MedSaarthiIcon className="h-16 w-16" />
          </div>
          <CardTitle className="text-3xl font-bold text-primary">Med-Saarthi</CardTitle>
          <CardDescription className="text-muted-foreground">Your companion in digital healthcare</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Link href="/dashboard">
              <Button variant="outline" className="w-full">
                <AbhaIcon className="mr-2 h-5 w-5" />
                Login with ABHA
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="w-full">
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12.5C5,8.75 8.36,5.73 12.19,5.73C15.22,5.73 16.9,6.76 17.6,7.54L19.8,5.33C17.91,3.52 15.35,2.75 12.19,2.75C6.94,2.75 3,7.17 3,12.5C3,17.83 6.94,22.25 12.19,22.25C17.6,22.25 21.6,18.5 21.6,12.75C21.6,12.12 21.51,11.6 21.35,11.1Z"
                  />
                </svg>
                Login with Google
              </Button>
            </Link>
          </div>
          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-border" />
            <span className="mx-4 flex-shrink text-sm text-muted-foreground">OR</span>
            <div className="flex-grow border-t border-border" />
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="Enter your mobile number" required />
            </div>
            <Link href="/dashboard" className="w-full">
              <Button className="w-full">Send OTP</Button>
            </Link>
          </div>
          <div className="mt-4 text-center text-sm">
            <p className="text-muted-foreground">
              By continuing, you agree to our{' '}
              <Link href="#" className="underline">
                Terms of Service
              </Link>
              .
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
