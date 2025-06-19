"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, CheckCircle, Award } from "lucide-react"
import { createClient } from "@supabase/supabase-js"
import Logo from "@/components/logo"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

interface Question {
  id: number
  question: string
  options: {
    text: string
    points: number
  }[]
}

const questions: Question[] = [
  {
    id: 1,
    question: "Ao chegar ao trabalho, você cumprimenta todos os colegas com simpatia?",
    options: [
      { text: "Sim, sempre e sem distinção.", points: 5 },
      { text: "Nem sempre, depende do meu humor naquele dia.", points: 3 },
      { text: "Não, afinal não gosto deles e prefiro não ser hipócrita.", points: 1 },
    ],
  },
  {
    id: 2,
    question: "Quando alguém solicita sua ajuda, você:",
    options: [
      { text: "Larga imediatamente o que está fazendo para atender o colega.", points: 3 },
      { text: "Não ajuda, pois cada um deve provar sua competência.", points: 1 },
      {
        text: "Se estiver ocupado com algo importante, pede para o colega esperá-lo terminar e então o ajuda.",
        points: 5,
      },
    ],
  },
  {
    id: 3,
    question: "Você deixa escapar palavrões no trabalho?",
    options: [
      { text: "Nunca, só baixinho, para mim mesmo.", points: 5 },
      { text: "Sim, quando o chefe não está perto.", points: 3 },
      { text: "Sempre que algo dá errado. Não consigo me controlar.", points: 1 },
    ],
  },
  {
    id: 4,
    question: "Uma colega foi trabalhar com uma roupa inadequada ao ambiente profissional. Você:",
    options: [
      { text: "Não liga, afinal não tem nada com isso.", points: 3 },
      {
        text: "Chama a colega para conversar reservadamente e tenta explicar por que não se usa esse tipo de roupa para trabalhar.",
        points: 5,
      },
      { text: "Não dá para passar em branco: comenta o deslize e faz piadinhas com os demais colegas.", points: 1 },
    ],
  },
  {
    id: 5,
    question: "Você é do tipo que:",
    options: [
      { text: "Decora o cantinho onde trabalha, com vasinhos, plantas, porta-retratos, adesivos etc.", points: 3 },
      { text: "Não liga para isso, pois o local de trabalho não é seu mesmo.", points: 1 },
      { text: "Procura mantê-lo limpo e organizado apenas.", points: 5 },
    ],
  },
  {
    id: 6,
    question: "Para você, contar piada no trabalho é:",
    options: [
      { text: "Uma forma de descontrair o ambiente sempre tão sério.", points: 1 },
      { text: "Inadequado.", points: 5 },
      {
        text: "Pode acontecer. Dependendo da hora, da situação, da piada e para quem é contada, pode ser divertido.",
        points: 3,
      },
    ],
  },
  {
    id: 7,
    question: "Você costuma chegar atrasado ao trabalho ou em encontros profissionais?",
    options: [
      { text: "Dificilmente. Saio sempre muito mais cedo, pois pontualidade é importante.", points: 5 },
      { text: "Às vezes, pois o trânsito está cada vez pior.", points: 3 },
      { text: "Sempre. Não consigo me programar e estou sempre atrasado para tudo.", points: 1 },
    ],
  },
  {
    id: 8,
    question: "Que tipo de curioso você é:",
    options: [
      { text: "Faz perguntas que podem ser respondidas sem constrangimento.", points: 3 },
      {
        text: "Interroga todos sobre tudo. Com curiosidade, pode descobrir coisas importantes para o seu trabalho.",
        points: 5,
      },
      { text: "Não pergunta nada, pois não gosta de se meter na vida dos outros.", points: 1 },
    ],
  },
  {
    id: 9,
    question: "Ler revistas ou jornais durante o expediente é:",
    options: [
      { text: "Uma falta de respeito com os demais colegas que estão trabalhando.", points: 5 },
      { text: "Inadequado. Para isso, o funcionário deveria chegar mais cedo ou ler em outro horário.", points: 3 },
      { text: "Normal, já que todos devem estar bem informados.", points: 1 },
    ],
  },
  {
    id: 10,
    question: "Reclamar é uma atitude que:",
    options: [
      { text: "Traz resultados, pois as pessoas percebem seu descontentamento e fazem algo.", points: 1 },
      { text: "Só gera mal-estar no ambiente de trabalho.", points: 3 },
      { text: "Deve aparecer na hora certa e de forma educada.", points: 5 },
    ],
  },
]

interface EtiquetteTestProps {
  studentName: string
  studentEmail: string
  onBack: () => void
}

export default function EtiquetteTest({ studentName, studentEmail, onBack }: EtiquetteTestProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAnswerSelect = (optionIndex: number) => {
    setSelectedAnswer(optionIndex)
  }

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return

    const newAnswers = [...answers, selectedAnswer]
    setAnswers(newAnswers)
    setSelectedAnswer(null)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateResult(newAnswers)
    }
  }

  const calculateResult = async (finalAnswers: number[]) => {
    const totalPoints = finalAnswers.reduce((sum, answerIndex, questionIndex) => {
      return sum + questions[questionIndex].options[answerIndex].points
    }, 0)

    let resultText = ""
    if (totalPoints >= 25) {
      resultText =
        "Você demonstra conhecimentos sobre convivência no trabalho. O bom senso pauta suas ações: você é simpático com os colegas e não se mete onde não é chamado; porém ajuda quando solicitado. Tem em mente que competência não é sinônimo de arrogância."
    } else if (totalPoints >= 15) {
      resultText =
        "Você está no caminho certo, mas ainda derrapa em algumas curvas das boas maneiras. Procure prestar mais atenção no seu comportamento e nas reações das pessoas com você. Isso vai ajudá-lo a descobrir pontos que precisa rever."
    } else {
      resultText =
        "Você ainda precisa aprender muito. O seu comportamento pode estar gerando inimizades no ambiente de trabalho. Se não mudar, o resultado pode ser a perda de boas oportunidades profissionais. Afinal, ninguém gosta de trabalhar com um mal-educado."
    }

    // Save to Supabase
    setIsSubmitting(true)
    try {
      const { error } = await supabase.from("etiquette_test_responses").insert({
        student_name: studentName,
        student_email: studentEmail,
        answers: finalAnswers,
        total_points: totalPoints,
        result_text: resultText,
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

  const getResultColor = (points: number) => {
    if (points >= 25) return "text-green-600"
    if (points >= 15) return "text-yellow-600"
    return "text-red-600"
  }

  const getResultIcon = (points: number) => {
    if (points >= 25) return "🏆"
    if (points >= 15) return "👍"
    return "📚"
  }

  if (showResult) {
    const totalPoints = answers.reduce((sum, answerIndex, questionIndex) => {
      return sum + questions[questionIndex].options[answerIndex].points
    }, 0)

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
          <Button onClick={onBack} variant="ghost" className="mb-6 ml-2 sm:ml-0">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Início
          </Button>

          <div className="flex justify-center mb-8">
            <Logo size="md" />
          </div>

          <Card className="border-0 shadow-xl mx-2 sm:mx-0">
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg text-center p-6 sm:p-8">
              <div className="text-4xl sm:text-6xl mb-4">{getResultIcon(totalPoints)}</div>
              <CardTitle className="text-xl sm:text-2xl">Resultado do Teste</CardTitle>
              <CardDescription className="text-green-100 text-sm sm:text-base">
                {studentName} - Pontuação: {totalPoints}/50
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
              <div className="text-center mb-8">
                <div className={`text-2xl sm:text-4xl font-bold mb-4 ${getResultColor(totalPoints)}`}>
                  {totalPoints} pontos
                </div>
                <Progress value={(totalPoints / 50) * 100} className="w-full mb-6" />
              </div>

              <div className="bg-gray-50 p-6 sm:p-8 rounded-lg">
                <h3 className="font-semibold text-base sm:text-lg mb-4 flex items-center gap-2">
                  <Award className="h-4 w-4 sm:h-5 sm:w-5" />
                  Sua Avaliação:
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  {answers.reduce((sum, answerIndex, questionIndex) => {
                    return sum + questions[questionIndex].options[answerIndex].points
                  }, 0) >= 25
                    ? "Você demonstra conhecimentos sobre convivência no trabalho. O bom senso pauta suas ações: você é simpático com os colegas e não se mete onde não é chamado; porém ajuda quando solicitado. Tem em mente que competência não é sinônimo de arrogância."
                    : answers.reduce((sum, answerIndex, questionIndex) => {
                          return sum + questions[questionIndex].options[answerIndex].points
                        }, 0) >= 15
                      ? "Você está no caminho certo, mas ainda derrapa em algumas curvas das boas maneiras. Procure prestar mais atenção no seu comportamento e nas reações das pessoas com você. Isso vai ajudá-lo a descobrir pontos que precisa rever."
                      : "Você ainda precisa aprender muito. O seu comportamento pode estar gerando inimizades no ambiente de trabalho. Se não mudar, o resultado pode ser a perda de boas oportunidades profissionais. Afinal, ninguém gosta de trabalhar com um mal-educado."}
                </p>
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
      <div className="max-w-2xl mx-auto">
        <Button onClick={onBack} variant="ghost" className="mb-6 ml-2 sm:ml-0">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao Início
        </Button>

        <Card className="border-0 shadow-xl mx-2 sm:mx-0">
          <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <CardTitle className="text-lg sm:text-xl">Teste de Boas Maneiras no Trabalho</CardTitle>
                <CardDescription className="text-green-100 text-sm sm:text-base">
                  Questão {currentQuestion + 1} de {questions.length}
                </CardDescription>
              </div>
              <div className="text-center sm:text-right">
                <div className="text-xl sm:text-2xl font-bold">{currentQuestion + 1}</div>
                <div className="text-xs sm:text-sm text-green-100">/{questions.length}</div>
              </div>
            </div>
            <Progress value={((currentQuestion + 1) / questions.length) * 100} className="mt-6 bg-green-400" />
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            <h2 className="text-lg sm:text-xl font-semibold mb-8 text-gray-800 leading-relaxed">
              {questions[currentQuestion].question}
            </h2>

            <RadioGroup
              value={selectedAnswer?.toString()}
              onValueChange={(value) => handleAnswerSelect(Number.parseInt(value))}
              className="space-y-4 sm:space-y-6"
            >
              {questions[currentQuestion].options.map((option, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-4 p-4 sm:p-6 rounded-lg border-2 transition-all cursor-pointer hover:bg-gray-50 ${
                    selectedAnswer === index ? "border-green-500 bg-green-50" : "border-gray-200"
                  }`}
                  onClick={() => handleAnswerSelect(index)}
                >
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} className="mt-1" />
                  <Label
                    htmlFor={`option-${index}`}
                    className="flex-1 cursor-pointer text-gray-700 text-sm sm:text-base leading-relaxed"
                  >
                    <span className="font-medium mr-3 text-blue-600">{String.fromCharCode(65 + index)})</span>
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div className="text-xs sm:text-sm text-gray-500 px-2">Estudante: {studentName}</div>
              <Button
                onClick={handleNextQuestion}
                disabled={selectedAnswer === null}
                className="bg-green-600 hover:bg-green-700 w-full sm:w-auto h-12"
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
