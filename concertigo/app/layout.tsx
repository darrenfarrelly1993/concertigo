import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/layout/Nav'

export const metadata: Metadata = {
  title: 'Concertigo — Great Nights Start Here',
  description: 'Connect with Ireland\'s best musicians. Book a trad session, a jazz night, a wedding band — directly, no agents.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        {children}
      </body>
    </html>
  )
}
