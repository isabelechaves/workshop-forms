"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CheckCircle, FileText } from "lucide-react"
import { createClient } from "@supabase/supabase-js"
import Logo from "@/components/logo"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

interface CaseStudyProps {
  formNumber: number
  title: string
  description: string
  caseText: string
  questions: string[]
  studentName: string
  studentEmail: string
  onBack: () => void
}

export default function CaseStudy({
  formNumber,
  title,
  description,
  caseText,
  questions,
  studentName,
  studentEmail,
  onBack,
}: CaseStudyProps) {
  const [answers, setAnswers] = useState<string[]>(new Array(questions.length).fill(""))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers]
    newAnswers[index] = value
    setAnswers(newAnswers)
  }

  const handleSubmit = async () => {
    // Check if all questions are answered
    const unansweredQuestions = answers.some((answer) => answer.trim() === "")
    if (unansweredQuestions) {
      alert("Por favor, responda todas as questões antes de enviar.")
      return
    }

    setIsSubmitting(true)
    try {
      const { error } = await supabase.from("case_study_responses").insert({
        form_number: formNumber,
        student_name: studentName,
        student_email: studentEmail,
        case_title: title,
        answers: answers,
        completed_at: new Date().toISOString(),
      })

      if (error) {
        console.error("Error saving response:", error)
        alert("Erro ao salvar respostas. Tente novamente.")
        return
      }

      setIsCompleted(true)
    } catch (error) {
      console.error("Error:", error)
      alert("Erro ao salvar respostas. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Function to render formatted text with proper line breaks and styling
  const renderFormattedText = (text: string) => {
    return text.split("\n").map((paragraph, index) => {
      if (paragraph.trim() === "") return null

      // Check if it's a bold header (starts with **)
      if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
        return (
          <h4 key={index} className="font-bold text-base sm:text-lg text-gray-800 mt-6 mb-3">
            {paragraph.replace(/\*\*/g, "")}
          </h4>
        )
      }

      // Check if it's a bullet point
      if (paragraph.startsWith("•")) {
        return (
          <div key={index} className="flex items-start mb-3 ml-2 sm:ml-4">
            <span className="text-blue-600 font-bold mr-3 mt-1 text-sm">•</span>
            <span className="text-gray-700 text-sm sm:text-base leading-relaxed">{paragraph.substring(1).trim()}</span>
          </div>
        )
      }

      // Regular paragraph
      return (
        <p key={index} className="text-gray-700 leading-relaxed mb-4 text-sm sm:text-base">
          {paragraph}
        </p>
      )
    })
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
          <Button onClick={onBack} variant="ghost" className="mb-6 ml-2 sm:ml-0">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Início
          </Button>

          <Card className="border-0 shadow-xl mx-2 sm:mx-0">
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg text-center p-6 sm:p-8">
              <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4" />
              <CardTitle className="text-xl sm:text-2xl">Estudo de Caso Concluído!</CardTitle>
              <CardDescription className="text-green-100 text-sm sm:text-base">{title}</CardDescription>
            </CardHeader>
            <CardContent className="p-6 sm:p-8 text-center">
              <div className="flex justify-center mb-8">
                <Logo size="md" />
              </div>
              <div className="bg-gray-50 p-6 sm:p-8 rounded-lg">
                <h3 className="font-semibold text-base sm:text-lg mb-3">Obrigado, {studentName}!</h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  Suas respostas foram salvas com sucesso. O Professor Elvis de Aguiar poderá revisar sua análise ética
                  do caso apresentado.
                </p>
              </div>

              <div className="mt-8">
                <Button onClick={onBack} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto h-12">
                  Voltar aos Formulários
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-6 sm:p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-sm sm:text-base">Salvando suas respostas...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getGradientClass = () => {
    switch (formNumber) {
      case 2:
        return "from-orange-500 to-red-500"
      case 3:
        return "from-purple-500 to-pink-500"
      case 4:
        return "from-teal-500 to-cyan-500"
      default:
        return "from-blue-500 to-indigo-500"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <Button onClick={onBack} variant="ghost" className="mb-6 ml-2 sm:ml-0">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao Início
        </Button>

        <Card className="border-0 shadow-xl mx-2 sm:mx-0">
          <CardHeader className={`bg-gradient-to-r ${getGradientClass()} text-white rounded-t-lg p-6 sm:p-8`}>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="leading-tight">{title}</span>
            </CardTitle>
            <CardDescription className="text-white/90 text-sm sm:text-base">{description}</CardDescription>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            {/* Case Description */}
            <div className="bg-gray-50 p-6 sm:p-8 rounded-lg mb-8 sm:mb-10">
              <h3 className="font-semibold text-lg sm:text-xl mb-4 sm:mb-6 text-gray-800 flex items-center gap-2">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                Situação:
              </h3>
              <div className="space-y-2">{renderFormattedText(caseText)}</div>
            </div>

            {/* Questions */}
            <div className="space-y-6 sm:space-y-8">
              <h3 className="font-semibold text-lg sm:text-xl text-gray-800 mb-4 sm:mb-6">Questões para Reflexão:</h3>

              {questions.map((question, index) => (
                <div key={index} className="space-y-3">
                  <Label htmlFor={`question-${index}`} className="text-sm sm:text-base font-medium leading-relaxed">
                    <span className="font-bold text-blue-600">{index + 1}.</span> {question}
                  </Label>
                  <Textarea
                    id={`question-${index}`}
                    value={answers[index]}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    placeholder="Digite sua resposta aqui..."
                    className="min-h-[120px] sm:min-h-[140px] resize-none text-sm sm:text-base"
                  />
                </div>
              ))}
            </div>

            {/* Submit Section */}
            <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div className="text-xs sm:text-sm text-gray-500 px-2">Estudante: {studentName}</div>
                <Button
                  onClick={handleSubmit}
                  disabled={answers.some((answer) => answer.trim() === "")}
                  className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto h-12"
                >
                  Enviar Respostas
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
