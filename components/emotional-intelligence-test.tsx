"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, CheckCircle, Heart } from "lucide-react"
import { createClient } from "@supabase/supabase-js"
import Logo from "@/components/logo"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

interface Question {
  id: number
  text: string
}

const questions: Question[] = [
  { id: 1, text: "Consigo identificar quando meu corpo reage a emoções (ex: coração acelera)" },
  { id: 2, text: "Reconheço facilmente quando estou feliz, triste, com raiva ou ansioso" },
  { id: 3, text: "Entendo as causas dos meus sentimentos e emoções" },
  { id: 4, text: "Consigo expressar adequadamente o que estou sentindo" },
  { id: 5, text: "Mantenho o controle emocional em situações estressantes" },
  { id: 6, text: "Consigo me acalmar quando estou muito nervoso ou agitado" },
  { id: 7, text: "Lido bem com críticas e feedbacks negativos" },
  { id: 8, text: "Mantenho a motivação mesmo diante de obstáculos" },
  { id: 9, text: "Tenho consciência dos meus pontos fortes e fracos" },
  { id: 10, text: "Consigo adaptar meu comportamento conforme a situação" },
  { id: 11, text: "Percebo quando outras pessoas estão tristes, felizes ou irritadas" },
  { id: 12, text: "Entendo os sentimentos dos outros mesmo quando não os expressam verbalmente" },
  { id: 13, text: "Consigo me colocar no lugar de outras pessoas" },
  { id: 14, text: "Sei como consolar alguém que está passando por dificuldades" },
  { id: 15, text: "Comunico-me de forma clara e efetiva com diferentes pessoas" },
  { id: 16, text: "Resolvo conflitos de maneira construtiva" },
  { id: 17, text: "Trabalho bem em equipe e colaboro efetivamente" },
  { id: 18, text: "Influencio positivamente o humor e comportamento dos outros" },
  { id: 19, text: "Mantenho relacionamentos saudáveis e duradouros" },
  { id: 20, text: "Demonstro empatia e compreensão nas interações sociais" },
  { id: 21, text: "Controlo meus impulsos em situações de pressão" },
  { id: 22, text: "Mantenho o otimismo mesmo em momentos difíceis" },
  { id: 23, text: "Tomo decisões equilibradas considerando emoção e razão" },
  { id: 24, text: "Recupero-me rapidamente de decepções ou fracassos" },
  { id: 25, text: "Tenho autoconfiança para enfrentar novos desafios" },
  { id: 26, text: "Reconheço quando preciso de ajuda ou apoio emocional" },
  { id: 27, text: "Escuto ativamente quando outras pessoas falam comigo" },
  { id: 28, text: "Ofereço apoio emocional quando alguém precisa" },
  { id: 29, text: "Nego pedidos de forma respeitosa quando necessário" },
  { id: 30, text: "Expresso discordância sem ofender ou magoar outros" },
  { id: 31, text: "Lidero grupos ou projetos de forma eficaz" },
  { id: 32, text: "Inspiro confiança nas pessoas ao meu redor" },
  { id: 33, text: "Medito ou uso técnicas para gerenciar minhas emoções" },
  { id: 34, text: "Reflito sobre meus comportamentos e atitudes regularmente" },
  { id: 35, text: "Estabeleço limites saudáveis nos relacionamentos" },
  { id: 36, text: "Perdoo facilmente quando alguém me magoa" },
  { id: 37, text: "Celebro conquistas e sucessos de outras pessoas" },
  { id: 38, text: "Mantenho a calma em discussões ou debates acalorados" },
  { id: 39, text: "Busco crescimento pessoal e desenvolvimento emocional" },
]

interface QuestionResponse {
  intrapersonal: number
  interpersonal: number
}

interface EmotionalIntelligenceTestProps {
  studentName: string
  studentEmail: string
  studentShift: string
  onBack: () => void
}

export default function EmotionalIntelligenceTest({
  studentName,
  studentEmail,
  studentShift,
  onBack,
}: EmotionalIntelligenceTestProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<QuestionResponse[]>(
    new Array(39).fill({ intrapersonal: 0, interpersonal: 0 }),
  )
  const [currentResponse, setCurrentResponse] = useState<QuestionResponse>({ intrapersonal: 0, interpersonal: 0 })
  const [showResult, setShowResult] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [canGoBack, setCanGoBack] = useState(false)

  useEffect(() => {
    setCanGoBack(currentQuestion > 0)
    // Set the current response to the saved response if it exists
    const savedResponse = responses[currentQuestion]
    if (savedResponse && (savedResponse.intrapersonal > 0 || savedResponse.interpersonal > 0)) {
      setCurrentResponse(savedResponse)
    } else {
      setCurrentResponse({ intrapersonal: 0, interpersonal: 0 })
    }
  }, [currentQuestion, responses])

  const handleScoreSelect = (type: "intrapersonal" | "interpersonal", score: number) => {
    setCurrentResponse((prev) => ({
      ...prev,
      [type]: score,
    }))
  }

  const handleNextQuestion = () => {
    if (currentResponse.intrapersonal === 0 || currentResponse.interpersonal === 0) return

    // Save current response
    const newResponses = [...responses]
    newResponses[currentQuestion] = currentResponse
    setResponses(newResponses)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateResult(newResponses)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      // Save current response before going back
      const newResponses = [...responses]
      newResponses[currentQuestion] = currentResponse
      setResponses(newResponses)
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const calculateResult = async (finalResponses: QuestionResponse[]) => {
    // Calculate total scores
    const totalIntrapersonal = finalResponses.reduce((sum, response) => sum + response.intrapersonal, 0)
    const totalInterpersonal = finalResponses.reduce((sum, response) => sum + response.interpersonal, 0)
    const totalScore = totalIntrapersonal + totalInterpersonal
    const averageScore = totalScore / (39 * 2) // 39 questions × 2 scores each

    // Prepare data for database
    const dbData: any = {
      student_name: studentName,
      student_email: studentEmail,
      shift: studentShift,
      intrapersonal_score: totalIntrapersonal,
      interpersonal_score: totalInterpersonal,
      total_score: totalScore,
      average_score: averageScore,
      completed_at: new Date().toISOString(),
    }

    // Add individual item scores (combining both scores for compatibility)
    finalResponses.forEach((response, index) => {
      // For database compatibility, we'll store the average of both scores per item
      const averageItemScore = (response.intrapersonal + response.interpersonal) / 2
      dbData[`item_${index + 1}`] = averageItemScore
    })

    setIsSubmitting(true)
    try {
      const { error } = await supabase.from("emotional_intelligence_responses").insert(dbData)

      if (error) {
        console.error("Error saving response:", error)
        alert("Erro ao salvar respostas. Tente novamente.")
        return
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Erro ao salvar respostas. Tente novamente.")
      return
    } finally {
      setIsSubmitting(false)
    }

    setShowResult(true)
  }

  const getScoreColor = (score: number) => {
    if (score >= 5.5) return "text-green-600"
    if (score >= 4) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 5.5) return "Alta Capacidade"
    if (score >= 4) return "Capacidade Moderada"
    return "Baixa Capacidade"
  }

  if (showResult) {
    const totalIntrapersonal = responses.reduce((sum, response) => sum + response.intrapersonal, 0)
    const totalInterpersonal = responses.reduce((sum, response) => sum + response.interpersonal, 0)
    const totalScore = totalIntrapersonal + totalInterpersonal
    const averageScore = totalScore / (39 * 2)

    const intrapersonalAverage = totalIntrapersonal / 39
    const interpersonalAverage = totalInterpersonal / 39

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto">
          <Button onClick={onBack} variant="ghost" className="mb-6 ml-2 sm:ml-0">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Início
          </Button>

          <div className="flex justify-center mb-8">
            <Logo size="md" />
          </div>

          <Card className="border-0 shadow-xl mx-2 sm:mx-0">
            <CardHeader className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-t-lg text-center p-6 sm:p-8">
              <div className="text-4xl sm:text-6xl mb-4">❤️</div>
              <CardTitle className="text-xl sm:text-2xl">Resultado do Teste de Inteligência Emocional</CardTitle>
              <CardDescription className="text-pink-100 text-sm sm:text-base">
                {studentName} - Pontuação Média Geral: {averageScore.toFixed(1)}/7
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
              <div className="text-center mb-8">
                <div className={`text-2xl sm:text-4xl font-bold mb-4 ${getScoreColor(averageScore)}`}>
                  {averageScore.toFixed(1)}/7
                </div>
                <Progress value={(averageScore / 7) * 100} className="w-full mb-6" />
                <div className={`text-lg font-semibold ${getScoreColor(averageScore)}`}>
                  {getScoreLabel(averageScore)}
                </div>
              </div>

              {/* Category Scores */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">🧠 Intrapessoal</h3>
                  <div className="text-2xl font-bold text-blue-600 mb-2">{intrapersonalAverage.toFixed(1)}/7</div>
                  <div className="text-sm text-gray-600 mb-2">({totalIntrapersonal}/273 pontos)</div>
                  <Progress value={(intrapersonalAverage / 7) * 100} className="mb-2" />
                  <p className="text-sm text-gray-600">Percepção e controle das próprias emoções</p>
                </div>

                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">🤝 Interpessoal</h3>
                  <div className="text-2xl font-bold text-green-600 mb-2">{interpersonalAverage.toFixed(1)}/7</div>
                  <div className="text-sm text-gray-600 mb-2">({totalInterpersonal}/273 pontos)</div>
                  <Progress value={(interpersonalAverage / 7) * 100} className="mb-2" />
                  <p className="text-sm text-gray-600">Habilidade de lidar com emoções e interações com outros</p>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-yellow-50 p-6 rounded-lg mb-8">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  📈 Recomendações para Desenvolvimento:
                </h3>
                <div className="space-y-3">
                  {intrapersonalAverage < 5 && (
                    <div className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">🧠</span>
                      <div>
                        <p className="font-medium text-blue-800">Inteligência Intrapessoal</p>
                        <p className="text-sm text-gray-600">
                          Pratique mindfulness, autoavaliação regular e técnicas de autorregulação emocional. Desenvolva
                          maior consciência sobre suas reações emocionais.
                        </p>
                      </div>
                    </div>
                  )}
                  {interpersonalAverage < 5 && (
                    <div className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">🤝</span>
                      <div>
                        <p className="font-medium text-green-800">Inteligência Interpessoal</p>
                        <p className="text-sm text-gray-600">
                          Desenvolva habilidades de escuta ativa, empatia e comunicação assertiva. Pratique a leitura de
                          sinais não-verbais e melhore suas habilidades sociais.
                        </p>
                      </div>
                    </div>
                  )}
                  {intrapersonalAverage >= 5 && interpersonalAverage >= 5 && (
                    <p className="text-green-600 font-medium">
                      Parabéns! Suas competências emocionais estão bem desenvolvidas. Continue praticando e refinando
                      essas habilidades!
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-8 text-center">
                <CheckCircle className="h-8 w-8 sm:h-12 sm:w-12 text-green-500 mx-auto mb-3" />
                <p className="text-green-600 font-medium text-sm sm:text-base">Teste concluído com sucesso!</p>
                <p className="text-gray-500 text-xs sm:text-sm">Suas respostas foram salvas.</p>
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

  const currentQuestionData = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100
  const isComplete = currentResponse.intrapersonal > 0 && currentResponse.interpersonal > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <Button onClick={onBack} variant="ghost" className="mb-6 ml-2 sm:ml-0">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao Início
        </Button>

        <Card className="border-0 shadow-xl mx-2 sm:mx-0">
          <CardHeader className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-t-lg p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Teste de Inteligência Emocional
                </CardTitle>
                <CardDescription className="text-pink-100 text-sm sm:text-base">
                  Questão {currentQuestion + 1} de {questions.length}
                </CardDescription>
              </div>
              <div className="text-center sm:text-right">
                <div className="text-xl sm:text-2xl font-bold">{currentQuestion + 1}</div>
                <div className="text-xs sm:text-sm text-pink-100">/{questions.length}</div>
              </div>
            </div>
            <Progress value={progress} className="mt-6 bg-pink-400" />
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            <div className="text-center mb-8">
              <div className="text-4xl sm:text-6xl mb-4">❤️</div>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <span className="text-sm font-medium text-gray-600">Pergunta {currentQuestionData.id}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold mb-6 text-gray-800 leading-relaxed">
                {currentQuestionData.text}
              </h2>
            </div>

            {/* Intrapersonal Scale */}
            <div className="mb-8 bg-blue-50 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🧠</span>
                <div>
                  <Label className="text-base font-semibold text-blue-800">Intrapessoal (de 1 a 7)</Label>
                  <p className="text-sm text-blue-600">Sua percepção e controle das próprias emoções</p>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 sm:gap-3 mb-4">
                {Array.from({ length: 7 }, (_, i) => i + 1).map((score) => (
                  <button
                    key={score}
                    onClick={() => handleScoreSelect("intrapersonal", score)}
                    className={`h-12 sm:h-14 rounded-lg border-2 font-bold text-sm sm:text-base transition-all ${
                      currentResponse.intrapersonal === score
                        ? "border-blue-500 bg-blue-500 text-white shadow-lg"
                        : "border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50"
                    }`}
                  >
                    {score}
                  </button>
                ))}
              </div>

              <div className="flex justify-between text-xs text-blue-600">
                <span>1 - Capacidade Baixa</span>
                <span>4 - Capacidade Moderada</span>
                <span>7 - Capacidade Alta</span>
              </div>
            </div>

            {/* Interpersonal Scale */}
            <div className="mb-8 bg-green-50 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🤝</span>
                <div>
                  <Label className="text-base font-semibold text-green-800">Interpessoal (de 1 a 7)</Label>
                  <p className="text-sm text-green-600">Sua habilidade de lidar com emoções e interações com outros</p>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 sm:gap-3 mb-4">
                {Array.from({ length: 7 }, (_, i) => i + 1).map((score) => (
                  <button
                    key={score}
                    onClick={() => handleScoreSelect("interpersonal", score)}
                    className={`h-12 sm:h-14 rounded-lg border-2 font-bold text-sm sm:text-base transition-all ${
                      currentResponse.interpersonal === score
                        ? "border-green-500 bg-green-500 text-green-900 shadow-lg"
                        : "border-gray-300 bg-white text-gray-700 hover:border-green-300 hover:bg-green-50"
                    }`}
                  >
                    {score}
                  </button>
                ))}
              </div>

              <div className="flex justify-between text-xs text-green-600">
                <span>1 - Capacidade Baixa</span>
                <span>4 - Capacidade Moderada</span>
                <span>7 - Capacidade Alta</span>
              </div>
            </div>

            {/* Current Selection Display */}
            {isComplete && (
              <div className="text-center p-4 bg-gray-50 rounded-lg mb-6">
                <p className="text-gray-800 font-medium mb-2">Suas avaliações para esta pergunta:</p>
                <div className="flex justify-center gap-6">
                  <div className="text-blue-600">
                    <span className="font-bold">🧠 Intrapessoal: {currentResponse.intrapersonal}/7</span>
                  </div>
                  <div className="text-green-600">
                    <span className="font-bold">🤝 Interpessoal: {currentResponse.interpersonal}/7</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="text-xs sm:text-sm text-gray-500 px-2">Estudante: {studentName}</div>
                {canGoBack && (
                  <Button onClick={handlePreviousQuestion} variant="outline" className="h-12">
                    ← Anterior
                  </Button>
                )}
              </div>
              <Button
                onClick={handleNextQuestion}
                disabled={!isComplete}
                className="bg-pink-600 hover:bg-pink-700 w-full sm:w-auto h-12"
              >
                {currentQuestion === questions.length - 1 ? "Finalizar Teste" : "Próxima Questão"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
