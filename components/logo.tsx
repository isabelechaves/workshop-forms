"use client"

import { GraduationCap } from "lucide-react"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  showIcon?: boolean
}

export default function Logo({ size = "md", showIcon = true }: LogoProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  }

  const iconSizes = {
    sm: "h-5 w-5",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  return (
    <div className="flex items-center gap-3">
      {showIcon && (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full blur-sm opacity-75"></div>
          <div className="relative bg-gradient-to-br from-blue-500 to-purple-500 p-2 rounded-full">
            <GraduationCap className={`${iconSizes[size]} text-white`} />
          </div>
        </div>
      )}
      <div className="flex flex-col">
        <h1
          className={`${sizeClasses[size]} font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight`}
        >
          Prof. Elvis de Aguiar
        </h1>
        <p className="text-sm text-gray-600 font-medium -mt-1">Ética Profissional</p>
      </div>
    </div>
  )
}
