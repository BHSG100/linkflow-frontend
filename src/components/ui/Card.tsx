import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  title: string
}

export default function Card({ children, title }: CardProps) {
  return (
    <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
      <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
        {title}
      </h1>
      {children}
    </div>
  )
}
