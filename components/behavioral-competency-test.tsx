"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, CheckCircle, Brain } from "lucide-react"
import { createClient } from "@supabase/supabase-js"
import Logo from "@/components/logo"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

interface Competency {
  id: string
  name: string
  description: string
  icon: string
}

const competencies: Competency[] = [
  {
    id: "etica",
    name: "Ética",
    description:
      "Capacidade de agir com integridade, honestidade e responsabilidade moral em todas as situações profissionais.",
    icon: "⚖️",
  },
  {
    id: "pensamento_empreendedor",
    name: "Pensamento Empreendedor",
    description: "Habilidade de identificar oportunidades, inovar e tomar iniciativas para criar valor e soluções.",
    icon: "💡",
  },
  {
    id: "criatividade",
    name: "Criatividade",
    description: "Capacidade de gerar ideias originais e encontrar soluções inovadoras para problemas e desafios.",
    icon: "🎨",
  },
  {
    id: "produtividade",
    name: "Produtividade",
    description:
      "Habilidade de organizar o tempo, estabelecer prioridades e entregar resultados de qualidade com eficiência.",
    icon: "⚡",
  },
  {
    id: "relacionamento_interpessoal",
    name: "Relacionamento Interpessoal",
    description: "Capacidade de se comunicar efetivamente, demonstrar empatia e construir relacionamentos positivos.",
    icon: "🤝",
  },
  {
    id: "trabalho_em_equipe",
    name: "Trabalho em Equipe",
    description: "Habilidade de colaborar, compartilhar responsabilidades e contribuir para objetivos coletivos.",
    icon: "👥",
  },
]

interface BehavioralCompetencyTestProps {
  studentName: string
  studentEmail: string
  studentShift: string // Adicionar esta linha
  onBack: () => void
}

export default function BehavioralCompetencyTest({
  studentName,
  studentEmail,
  studentShift,
  onBack,
}: BehavioralCompetencyTestProps) {
  const [currentCompetency, setCurrentCompetency] = useState(0)
  const [scores, setScores] = useState<Record<string, number>>({})
  const [selectedScore, setSelectedScore] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleScoreSelect = (score: number) => {
    setSelectedScore(score)
  }

  const handleNextCompetency = () => {
    if (selectedScore === null) return

    const newScores = { ...scores, [competencies[currentCompetency].id]: selectedScore }
    setScores(newScores)
    setSelectedScore(null)

    if (currentCompetency < competencies.length - 1) {
      setCurrentCompetency(currentCompetency + 1)
    } else {
      calculateResult(newScores)
    }
  }

  const calculateResult = async (finalScores: Record<string, number>) => {
    const totalScore = Object.values(finalScores).reduce((sum, score) => sum + score, 0)
    const averageScore = totalScore / competencies.length

    // Save to Supabase
    setIsSubmitting(true)
    try {
      const { error } = await supabase.from("behavioral_competency_responses").insert({
        student_name: studentName,
        student_email: studentEmail,
        shift: studentShift, // Adicionar esta linha
        etica: finalScores.etica,
        pensamento_empreendedor: finalScores.pensamento_empreendedor,
        criatividade: finalScores.criatividade,
        produtividade: finalScores.produtividade,
        relacionamento_interpessoal: finalScores.relacionamento_interpessoal,
        trabalho_em_equipe: finalScores.trabalho_em_equipe,
        total_score: totalScore,
        average_score: averageScore,
        completed_at: new Date().toISOString(),
      })

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
    if (score >= 8) return "text-green-600"
    if (score >= 6) return "text-blue-600"
    if (score >= 4) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 8) return "Muito Desenvolvida"
    if (score >= 6) return "Desenvolvida"
    if (score >= 4) return "Em Desenvolvimento"
    return "Precisa Desenvolver"
  }

  const getOverallLabel = (average: number) => {
    if (average >= 8) return "Perfil Comportamental Excelente"
    if (average >= 6) return "Perfil Comportamental Bom"
    if (average >= 4) return "Perfil Comportamental Regular"
    return "Perfil Comportamental Precisa Melhorar"
  }

  if (showResult) {
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0)
    const averageScore = totalScore / competencies.length

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
            <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-t-lg text-center p-6 sm:p-8">
              <div className="text-4xl sm:text-6xl mb-4">🧠</div>
              <CardTitle className="text-xl sm:text-2xl">Resultado do Teste de Competência Comportamental</CardTitle>
              <CardDescription className="text-blue-100 text-sm sm:text-base">
                {studentName} - Pontuação Média: {averageScore.toFixed(1)}/10
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
              <div className="text-center mb-8">
                <div className={`text-2xl sm:text-4xl font-bold mb-4 ${getScoreColor(averageScore)}`}>
                  {averageScore.toFixed(1)}/10
                </div>
                <Progress value={(averageScore / 10) * 100} className="w-full mb-6" />
                <div className={`text-lg font-semibold ${getScoreColor(averageScore)}`}>
                  {getOverallLabel(averageScore)}
                </div>
              </div>

              {/* Individual Competencies */}
              <div className="space-y-4 mb-8">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Detalhamento por Competência:
                </h3>
                {competencies.map((competency) => (
                  <div key={competency.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{competency.icon}</span>
                        <span className="font-medium">{competency.name}</span>
                      </div>
                      <div className="text-right">
                        <span className={`font-bold text-lg ${getScoreColor(scores[competency.id])}`}>
                          {scores[competency.id]}/10
                        </span>
                        <div className={`text-xs ${getScoreColor(scores[competency.id])}`}>
                          {getScoreLabel(scores[competency.id])}
                        </div>
                      </div>
                    </div>
                    <Progress value={(scores[competency.id] / 10) * 100} className="h-2" />
                  </div>
                ))}
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
          <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-t-lg p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <CardTitle className="text-lg sm:text-xl">Teste de Competência Comportamental</CardTitle>
                <CardDescription className="text-blue-100 text-sm sm:text-base">
                  Competência {currentCompetency + 1} de {competencies.length}
                </CardDescription>
              </div>
              <div className="text-center sm:text-right">
                <div className="text-xl sm:text-2xl font-bold">{currentCompetency + 1}</div>
                <div className="text-xs sm:text-sm text-blue-100">/{competencies.length}</div>
              </div>
            </div>
            <Progress value={((currentCompetency + 1) / competencies.length) * 100} className="mt-6 bg-blue-400" />
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            <div className="text-center mb-8">
              <div className="text-4xl sm:text-6xl mb-4">{competencies[currentCompetency].icon}</div>
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">
                {competencies[currentCompetency].name}
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-8">
                {competencies[currentCompetency].description}
              </p>
            </div>

            <div className="mb-8">
              <Label className="text-base sm:text-lg font-medium mb-6 block text-center">
                Em uma escala de 0 a 10, o quanto você possui esta competência?
              </Label>

              <div className="grid grid-cols-11 gap-2 sm:gap-3 mb-6">
                {Array.from({ length: 11 }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => handleScoreSelect(i)}
                    className={`h-12 sm:h-14 rounded-lg border-2 font-bold text-sm sm:text-base transition-all ${
                      selectedScore === i
                        ? "border-blue-500 bg-blue-500 text-white shadow-lg"
                        : "border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50"
                    }`}
                  >
                    {i}
                  </button>
                ))}
              </div>

              <div className="flex justify-between text-xs sm:text-sm text-gray-500 mb-8">
                <span>0 - Não possuo</span>
                <span>5 - Moderado</span>
                <span>10 - Muito desenvolvido</span>
              </div>

              {selectedScore !== null && (
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 font-medium">
                    Você selecionou: <span className="font-bold text-lg">{selectedScore}/10</span>
                  </p>
                  <p className="text-blue-600 text-sm">{getScoreLabel(selectedScore)}</p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div className="text-xs sm:text-sm text-gray-500 px-2">Estudante: {studentName}</div>
              <Button
                onClick={handleNextCompetency}
                disabled={selectedScore === null}
                className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto h-12"
              >
                {currentCompetency === competencies.length - 1 ? "Finalizar Teste" : "Próxima Competência"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
