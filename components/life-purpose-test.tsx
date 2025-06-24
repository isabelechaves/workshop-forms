"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CheckCircle, Target } from "lucide-react"
import { createClient } from "@supabase/supabase-js"
import Logo from "@/components/logo"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

const questions = [
  "O que dá sentido à sua vida?",
  "Por que e para que você faz as coisas que faz?",
  "Você faz ou deixa os outros decidirem por você, decidindo não decidir?",
  "Se qualquer decisão é sua (inclusive a de fazer de conta que não), quem é responsável pela sua vida?",
  "E se você é o único responsável pela vida que leva, como mudá-la para chegar aos patamares que só você é capaz de chegar?",
]

interface LifePurposeTestProps {
  studentName: string
  studentEmail: string
  studentShift: string
  onBack: () => void
}

export default function LifePurposeTest({ studentName, studentEmail, studentShift, onBack }: LifePurposeTestProps) {
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
      const { error } = await supabase.from("life_purpose_responses").insert({
        student_name: studentName,
        student_email: studentEmail,
        shift: studentShift,
        question_1: answers[0],
        question_2: answers[1],
        question_3: answers[2],
        question_4: answers[3],
        question_5: answers[4],
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

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
          <Button onClick={onBack} variant="ghost" className="mb-6 ml-2 sm:ml-0">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Início
          </Button>

          <Card className="border-0 shadow-xl mx-2 sm:mx-0">
            <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg text-center p-6 sm:p-8">
              <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4" />
              <CardTitle className="text-xl sm:text-2xl">Reflexão sobre Propósito de Vida Concluída!</CardTitle>
              <CardDescription className="text-amber-100 text-sm sm:text-base">
                Questionário de Autoconhecimento
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 sm:p-8 text-center">
              <div className="flex justify-center mb-8">
                <Logo size="md" />
              </div>
              <div className="bg-gray-50 p-6 sm:p-8 rounded-lg">
                <h3 className="font-semibold text-base sm:text-lg mb-3">Obrigado, {studentName}!</h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  Suas reflexões sobre propósito de vida foram salvas com sucesso. O Professor Elvis de Aguiar poderá
                  revisar suas respostas sobre autoconhecimento e transcendência humana.
                </p>
              </div>

              <div className="mt-8">
                <Button onClick={onBack} className="bg-amber-600 hover:bg-amber-700 w-full sm:w-auto h-12">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <Button onClick={onBack} variant="ghost" className="mb-6 ml-2 sm:ml-0">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao Início
        </Button>

        <Card className="border-0 shadow-xl mx-2 sm:mx-0">
          <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg p-6 sm:p-8">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Target className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="leading-tight">Propósito de Vida e Transcendência Humana</span>
            </CardTitle>
            <CardDescription className="text-amber-100 text-sm sm:text-base">
              Reflexões sobre Viktor Frankl e o sentido da existência
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            {/* Introduction Text */}
            <div className="bg-gray-50 p-6 sm:p-8 rounded-lg mb-8 sm:mb-10">
              <h3 className="font-semibold text-lg sm:text-xl mb-4 sm:mb-6 text-gray-800 flex items-center gap-2">
                <Target className="h-4 w-4 sm:h-5 sm:w-5" />
                Contexto:
              </h3>
              <div className="space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed">
                <p>
                  <strong>Viktor Frankl</strong> propõe uma reflexão sobre a verdadeira natureza humana: "Cada homem é
                  único e cada vida humana é singular; ninguém é substituível, nem uma vida é repetível."
                </p>
                <p>
                  Como prisioneiro 119.104 em campos de concentração como Auschwitz, Frankl percebeu que há uma
                  realidade superior que permite viver: não é ter poder, nem prazer, mas{" "}
                  <strong>buscar um sentido para a existência</strong>.
                </p>
                <p>
                  As pessoas que conseguem perceber sua existência como dotada de um sentido - seja pela criação
                  artística, trabalho, amor vivido ou sofrimento transformado em aprendizado - eram as pessoas com menos
                  chances de se alienarem num vazio existencial.
                </p>
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-6 sm:space-y-8">
              <h3 className="font-semibold text-lg sm:text-xl text-gray-800 mb-4 sm:mb-6">Questões para Reflexão:</h3>

              {questions.map((question, index) => (
                <div key={index} className="space-y-3">
                  <Label htmlFor={`question-${index}`} className="text-sm sm:text-base font-medium leading-relaxed">
                    <span className="font-bold text-amber-600">{index + 1}.</span> {question}
                  </Label>
                  <Textarea
                    id={`question-${index}`}
                    value={answers[index]}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    placeholder="Digite sua reflexão aqui..."
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
                  className="bg-amber-600 hover:bg-amber-700 w-full sm:w-auto h-12"
                >
                  Enviar Reflexões
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
