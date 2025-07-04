import type React from "react"
import type { Metadata } from "next"
import ClientLayout from "./ClientLayout"

export const metadata: Metadata = {
  title: "CivicHero - Katiba Yangu",
  description: "Join the movement to strengthen democracy through civic education and community action",
  generator: 'v0.dev'
}

import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en"
       data-arp="">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
