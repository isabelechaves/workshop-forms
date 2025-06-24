"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { createClient } from "@supabase/supabase-js"
import Logo from "@/components/logo"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

interface EmotionalItem {
  id: number
  text: string
  category: "intrapersonal" | "interpersonal"
}

const emotionalItems: EmotionalItem[] = [
  { id: 1, text: "Identificar mudanças na excitação fisiológica", category: "intrapersonal" },
  { id: 2, text: "Relaxar em situação de pressão", category: "intrapersonal" },
  { id: 3, text: "Agir produtivamente quando zangado", category: "intrapersonal" },
  { id: 4, text: "Agir produtivamente em situações que provocam ansiedade", category: "intrapersonal" },
  { id: 5, text: "Acalmar-se depressa quando zangado", category: "intrapersonal" },
  { id: 6, text: "Associar diferentes indícios sociológicos a diferentes emoções", category: "intrapersonal" },
  { id: 7, text: "Usar a 'conversa' interna para influenciar seu estado emocional", category: "intrapersonal" },
  { id: 8, text: "Comunicar com eficácia seus sentimentos", category: "intrapersonal" },
  { id: 9, text: "Refletir sobre sentimentos negativos sem se perturbar", category: "intrapersonal" },
  { id: 10, text: "Ficar calmo quando for alvo da raiva de outra pessoa", category: "intrapersonal" },
  { id: 11, text: "Saber quando você está pensando negativamente", category: "intrapersonal" },
  { id: 12, text: "Saber quando sua conversa consigo mesmo é instrutiva", category: "intrapersonal" },
  { id: 13, text: "Saber quando você está ficando zangado", category: "intrapersonal" },
  { id: 14, text: "Saber como interpretar os acontecimentos", category: "intrapersonal" },
  { id: 15, text: "Saber que sentidos você está usando no momento", category: "intrapersonal" },
  { id: 16, text: "Comunicar corretamente o que está sentindo", category: "intrapersonal" },
  { id: 17, text: "Saber que informações influenciam suas interpretações", category: "intrapersonal" },
  { id: 18, text: "Identificar suas mudanças de estado de espírito", category: "intrapersonal" },
  { id: 19, text: "Saber quando você está se comunicando incoerentemente", category: "intrapersonal" },
  { id: 20, text: "Saber quando você está se comunicando incoerentemente", category: "intrapersonal" },
  { id: 21, text: "Recuperar-se depressa depois de um retrocesso", category: "intrapersonal" },
  { id: 22, text: "Completar tarefas longas dentro dos prazos determinados", category: "intrapersonal" },
  { id: 23, text: "Produzir alta energia fazendo um trabalho desinteressante", category: "intrapersonal" },
  { id: 24, text: "Cessar ou modificar hábitos pouco eficazes", category: "intrapersonal" },
  { id: 25, text: "Desenvolver novos padrões de comportamento mais produtivos", category: "intrapersonal" },
  { id: 26, text: "Depois das palavras, a ação", category: "intrapersonal" },
  { id: 27, text: "Resolver conflito", category: "interpersonal" },
  { id: 28, text: "Mostrar técnicas eficazes de comunicação interpessoal", category: "interpersonal" },
  { id: 29, text: "Mostrar técnicas eficazes de comunicação interpessoal", category: "interpersonal" },
  { id: 30, text: "Construir a confiança com outras pessoas", category: "interpersonal" },
  { id: 31, text: "Construir a confiança com outras pessoas", category: "interpersonal" },
  { id: 32, text: "Construir a confiança com outras pessoas", category: "interpersonal" },
  { id: 33, text: "Dar conselhos e apoio a outros, quando necessário", category: "interpersonal" },
  { id: 34, text: "Refletir corretamente os sentimentos de outros para eles mesmos", category: "interpersonal" },
  { id: 35, text: "Reconhecer quando uma pessoa está preocupada", category: "interpersonal" },
  { id: 36, text: "Ajudar outras pessoas a controlar as emoções", category: "interpersonal" },
  { id: 37, text: "Mostrar empatia com outras pessoas", category: "interpersonal" },
  { id: 38, text: "Mostrar empatia com outras pessoas", category: "interpersonal" },
  {
    id: 39,
    text: "Perceber incongruências entre as emoções ou sentimentos de uma pessoa e seu comportamento",
    category: "interpersonal",
  },
]

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
  const [currentItem, setCurrentItem] = useState(0)
  const [scores, setScores] = useState<Record<number, number>>({})
  const [selectedScore, setSelectedScore] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleScoreSelect = (score: number) => {
    setSelectedScore(score)
  }

  const handleNextItem = () => {
    if (selectedScore === null) return

    const newScores = { ...scores, [emotionalItems[currentItem].id]: selectedScore }
    setScores(newScores)
    setSelectedScore(null)

    if (currentItem < emotionalItems.length - 1) {
      setCurrentItem(currentItem + 1)
    } else {
      calculateResult(newScores)
    }
  }

  const calculateResult = async (finalScores: Record<number, number>) => {
    const intrapersonalItems = emotionalItems.filter((item) => item.category === "intrapersonal")
    const interpersonalItems = emotionalItems.filter((item) => item.category === "interpersonal")

    const intrapersonalScore = intrapersonalItems.reduce((sum, item) => sum + finalScores[item.id], 0)
    const interpersonalScore = interpersonalItems.reduce((sum, item) => sum + finalScores[item.id], 0)
    const totalScore = intrapersonalScore + interpersonalScore
    const averageScore = totalScore / emotionalItems.length

    // Prepare data for database
    const dbData: any = {
      student_name: studentName,
      student_email: studentEmail,
      shift: studentShift,
      intrapersonal_score: intrapersonalScore,
      interpersonal_score: interpersonalScore,
      total_score: totalScore,
      average_score: averageScore,
      completed_at: new Date().toISOString(),
    }

    // Add individual item scores
    for (let i = 1; i <= 39; i++) {
      dbData[`item_${i}`] = finalScores[i]
    }

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
    if (score >= 6) return "text-green-600"
    if (score >= 4) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 6) return "Alta Capacidade"
    if (score >= 4) return "Capacidade Moderada"
    return "Baixa Capacidade"
  }

  if (showResult) {
    const intrapersonalItems = emotionalItems.filter((item) => item.category === "intrapersonal")
    const interpersonalItems = emotionalItems.filter((item) => item.category === "interpersonal")

    const intrapersonalScore = intrapersonalItems.reduce((sum, item) => sum + scores[item.id], 0)
    const interpersonalScore = interpersonalItems.reduce((sum, item) => sum + scores[item.id], 0)
    const totalScore = intrapersonalScore + interpersonalScore
    const averageScore = totalScore / emotionalItems.length

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
                {studentName} - Pontuação Média: {averageScore.toFixed(1)}/7
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
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    {intrapersonalScore}/{intrapersonalItems.length * 7}
                  </div>
                  <Progress value={(intrapersonalScore / (intrapersonalItems.length * 7)) * 100} className="mb-2" />
                  <p className="text-sm text-gray-600">Autoconhecimento e autorregulação emocional</p>
                </div>

                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">🤝 Interpessoal</h3>
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    {interpersonalScore}/{interpersonalItems.length * 7}
                  </div>
                  <Progress value={(interpersonalScore / (interpersonalItems.length * 7)) * 100} className="mb-2" />
                  <p className="text-sm text-gray-600">Habilidades sociais e relacionamento com outros</p>
                </div>
              </div>

              {/* Items to develop */}
              <div className="bg-yellow-50 p-6 rounded-lg mb-8">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  📈 Itens para Desenvolver (Nota ≤ 4):
                </h3>
                <div className="space-y-2">
                  {emotionalItems
                    .filter((item) => scores[item.id] <= 4)
                    .map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <span className="text-sm">
                          {item.id}. {item.text}
                        </span>
                        <span className="font-bold text-red-600">{scores[item.id]}/7</span>
                      </div>
                    ))}
                  {emotionalItems.filter((item) => scores[item.id] <= 4).length === 0 && (
                    <p className="text-green-600 font-medium">
                      Parabéns! Todas as suas competências estão bem desenvolvidas.
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <Button onClick={onBack} variant="ghost" className="mb-6 ml-2 sm:ml-0">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao Início
        </Button>

        <Card className="border-0 shadow-xl mx-2 sm:mx-0">
          <CardHeader className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-t-lg p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <CardTitle className="text-lg sm:text-xl">Teste de Inteligência Emocional</CardTitle>
                <CardDescription className="text-pink-100 text-sm sm:text-base">
                  Item {currentItem + 1} de {emotionalItems.length}
                </CardDescription>
              </div>
              <div className="text-center sm:text-right">
                <div className="text-xl sm:text-2xl font-bold">{currentItem + 1}</div>
                <div className="text-xs sm:text-sm text-pink-100">/{emotionalItems.length}</div>
              </div>
            </div>
            <Progress value={((currentItem + 1) / emotionalItems.length) * 100} className="mt-6 bg-pink-400" />
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            <div className="text-center mb-8">
              <div className="text-4xl sm:text-6xl mb-4">
                {emotionalItems[currentItem].category === "intrapersonal" ? "🧠" : "🤝"}
              </div>
              <div className="mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    emotionalItems[currentItem].category === "intrapersonal"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {emotionalItems[currentItem].category === "intrapersonal" ? "Intrapessoal" : "Interpessoal"}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-800 leading-relaxed">
                {emotionalItems[currentItem].text}
              </h2>
            </div>

            <div className="mb-8">
              <Label className="text-base sm:text-lg font-medium mb-6 block text-center">
                Em uma escala de 1 a 7, avalie sua capacidade nesta área:
              </Label>

              <div className="grid grid-cols-7 gap-2 sm:gap-3 mb-6">
                {Array.from({ length: 7 }, (_, i) => i + 1).map((score) => (
                  <button
                    key={score}
                    onClick={() => handleScoreSelect(score)}
                    className={`h-12 sm:h-14 rounded-lg border-2 font-bold text-sm sm:text-base transition-all ${
                      selectedScore === score
                        ? "border-pink-500 bg-pink-500 text-white shadow-lg"
                        : "border-gray-300 bg-white text-gray-700 hover:border-pink-300 hover:bg-pink-50"
                    }`}
                  >
                    {score}
                  </button>
                ))}
              </div>

              <div className="flex justify-between text-xs sm:text-sm text-gray-500 mb-8">
                <span>1 - Baixa Capacidade</span>
                <span>4 - Moderada</span>
                <span>7 - Alta Capacidade</span>
              </div>

              {selectedScore !== null && (
                <div className="text-center p-4 bg-pink-50 rounded-lg">
                  <p className="text-pink-800 font-medium">
                    Você selecionou: <span className="font-bold text-lg">{selectedScore}/7</span>
                  </p>
                  <p className="text-pink-600 text-sm">{getScoreLabel(selectedScore)}</p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div className="text-xs sm:text-sm text-gray-500 px-2">Estudante: {studentName}</div>
              <Button
                onClick={handleNextItem}
                disabled={selectedScore === null}
                className="bg-pink-600 hover:bg-pink-700 w-full sm:w-auto h-12"
              >
                {currentItem === emotionalItems.length - 1 ? "Finalizar Teste" : "Próximo Item"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
