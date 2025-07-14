// app/layout.tsx

import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Shitovod',
  description: 'Игра на счёт денег — тренируй внимательность и скорость!',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <head />
      <body>{children}</body>
    </html>
  )
}
