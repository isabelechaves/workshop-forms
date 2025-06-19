"use client"

import { GraduationCap } from "lucide-react"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  showIcon?: boolean
}

export default function Logo({ size = "md", showIcon = true }: LogoProps) {
  const sizeClasses = {
    sm: "text-base sm:text-lg",
    md: "text-lg sm:text-2xl",
    lg: "text-2xl sm:text-4xl",
  }

  const iconSizes = {
    sm: "h-4 w-4 sm:h-5 sm:w-5",
    md: "h-6 w-6 sm:h-8 sm:w-8",
    lg: "h-8 w-8 sm:h-12 sm:w-12",
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
      {showIcon && (
        <div className="relative flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full blur-sm opacity-75"></div>
          <div className="relative bg-gradient-to-br from-blue-500 to-purple-500 p-2 rounded-full">
            <GraduationCap className={`${iconSizes[size]} text-white`} />
          </div>
        </div>
      )}
      <div className="flex flex-col items-center sm:items-start">
        <h1
          className={`${sizeClasses[size]} font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight whitespace-nowrap`}
        >
          Prof. Elvis de Aguiar
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 font-medium -mt-1">Ética Profissional</p>
      </div>
    </div>
  )
}
