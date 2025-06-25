"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Users, Award, FileText, Calendar, Brain, Filter, Sun, Moon } from "lucide-react"
import { createClient } from "@supabase/supabase-js"
import Logo from "@/components/logo"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

interface EtiquetteResponse {
  id: number
  student_name: string
  student_email: string
  shift: string
  total_points: number
  result_text: string
  completed_at: string
  answers: number[]
}

interface CaseStudyResponse {
  id: number
  form_number: number
  student_name: string
  student_email: string
  shift: string
  case_title: string
  answers: string[]
  completed_at: string
}

interface BehavioralCompetencyResponse {
  id: number
  student_name: string
  student_email: string
  shift: string
  etica: number
  pensamento_empreendedor: number
  criatividade: number
  produtividade: number
  relacionamento_interpessoal: number
  trabalho_em_equipe: number
  total_score: number
  average_score: number
  completed_at: string
}

interface EmotionalIntelligenceResponse {
  id: number
  student_name: string
  student_email: string
  shift: string
  intrapersonal_score: number
  interpersonal_score: number
  total_score: number
  average_score: number
  completed_at: string
}

interface LifePurposeResponse {
  id: number
  student_name: string
  student_email: string
  shift: string
  question_1: string
  question_2: string
  question_3: string
  question_4: string
  question_5: string
  completed_at: string
}

export default function ProfessorDashboard() {
  const [etiquetteResponses, setEtiquetteResponses] = useState<EtiquetteResponse[]>([])
  const [caseStudyResponses, setCaseStudyResponses] = useState<CaseStudyResponse[]>([])
  const [behavioralResponses, setBehavioralResponses] = useState<BehavioralCompetencyResponse[]>([])
  const [emotionalResponses, setEmotionalResponses] = useState<EmotionalIntelligenceResponse[]>([])
  const [lifePurposeResponses, setLifePurposeResponses] = useState<LifePurposeResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedShift, setSelectedShift] = useState<string>("todos")

  useEffect(() => {
    fetchResponses()
  }, [])

  const fetchResponses = async () => {
    try {
      // Fetch etiquette test responses
      const { data: etiquetteData, error: etiquetteError } = await supabase
        .from("etiquette_test_responses")
        .select("*")
        .order("completed_at", { ascending: false })

      if (etiquetteError) {
        console.error("Error fetching etiquette responses:", etiquetteError)
      } else {
        setEtiquetteResponses(etiquetteData || [])
      }

      // Fetch case study responses
      const { data: caseStudyData, error: caseStudyError } = await supabase
        .from("case_study_responses")
        .select("*")
        .order("completed_at", { ascending: false })

      if (caseStudyError) {
        console.error("Error fetching case study responses:", caseStudyError)
      } else {
        setCaseStudyResponses(caseStudyData || [])
      }

      // Fetch behavioral competency responses
      const { data: behavioralData, error: behavioralError } = await supabase
        .from("behavioral_competency_responses")
        .select("*")
        .order("completed_at", { ascending: false })

      if (behavioralError) {
        console.error("Error fetching behavioral responses:", behavioralError)
      } else {
        setBehavioralResponses(behavioralData || [])
      }

      // Fetch emotional intelligence responses
      const { data: emotionalData, error: emotionalError } = await supabase
        .from("emotional_intelligence_responses")
        .select("*")
        .order("completed_at", { ascending: false })

      if (emotionalError) {
        console.error("Error fetching emotional responses:", emotionalError)
      } else {
        setEmotionalResponses(emotionalData || [])
      }

      // Fetch life purpose responses
      const { data: lifePurposeData, error: lifePurposeError } = await supabase
        .from("life_purpose_responses")
        .select("*")
        .order("completed_at", { ascending: false })

      if (lifePurposeError) {
        console.error("Error fetching life purpose responses:", lifePurposeError)
      } else {
        setLifePurposeResponses(lifePurposeData || [])
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  // Filter functions
  const filterByShift = <T extends { shift?: string }>(data: T[]): T[] => {
    if (selectedShift === "todos") return data
    return data.filter((item) => item.shift === selectedShift)
  }

  const filteredEtiquetteResponses = filterByShift(etiquetteResponses)
  const filteredCaseStudyResponses = filterByShift(caseStudyResponses)
  const filteredBehavioralResponses = filterByShift(behavioralResponses)
  const filteredEmotionalResponses = filterByShift(emotionalResponses)
  const filteredLifePurposeResponses = filterByShift(lifePurposeResponses)

  // Statistics by shift
  const getShiftStats = (shift: string) => {
    const shiftEtiquette = etiquetteResponses.filter((r) => r.shift === shift)
    const shiftCaseStudy = caseStudyResponses.filter((r) => r.shift === shift)
    const shiftBehavioral = behavioralResponses.filter((r) => r.shift === shift)
    const shiftEmotional = emotionalResponses.filter((r) => r.shift === shift)
    const shiftLifePurpose = lifePurposeResponses.filter((r) => r.shift === shift)

    const uniqueStudents = new Set([
      ...shiftBehavioral.map((r) => r.student_name),
      ...shiftEtiquette.map((r) => r.student_name),
      ...shiftCaseStudy.map((r) => r.student_name),
      ...shiftEmotional.map((r) => r.student_name),
      ...shiftLifePurpose.map((r) => r.student_name),
    ]).size

    const avgEtiquetteScore =
      shiftEtiquette.length > 0
        ? Math.round(shiftEtiquette.reduce((sum, r) => sum + r.total_points, 0) / shiftEtiquette.length)
        : 0

    return {
      etiquette: shiftEtiquette.length,
      caseStudy: shiftCaseStudy.length,
      behavioral: shiftBehavioral.length,
      emotional: shiftEmotional.length,
      lifePurpose: shiftLifePurpose.length,
      uniqueStudents,
      avgEtiquetteScore,
    }
  }

  const morningStats = getShiftStats("manha")
  const afternoonStats = getShiftStats("tarde")

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
      alert("Não há dados para exportar.")
      return
    }

    const headers = Object.keys(data[0]).join(",")
    const rows = data.map((row) =>
      Object.values(row)
        .map((value) => (typeof value === "string" ? `"${value.replace(/"/g, '""')}"` : value))
        .join(","),
    )

    const csv = [headers, ...rows].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getScoreColor = (points: number) => {
    if (points >= 25) return "bg-green-100 text-green-800"
    if (points >= 15) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  const getScoreLabel = (points: number) => {
    if (points >= 25) return "Excelente"
    if (points >= 15) return "Bom"
    return "Precisa Melhorar"
  }

  const getShiftIcon = (shift: string) => {
    return shift === "manha" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />
  }

  const getShiftLabel = (shift: string) => {
    return shift === "manha" ? "Manhã" : "Tarde"
  }

  const getShiftColor = (shift: string) => {
    return shift === "manha" ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dados...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <Logo size="md" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard do Professor</h1>
          <p className="text-gray-600">Aulão de Ética Profissional</p>
        </div>

        {/* Shift Filter */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtros
                </CardTitle>
                <CardDescription>Selecione o turno para visualizar os dados</CardDescription>
              </div>
              <Select value={selectedShift} onValueChange={setSelectedShift}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Selecionar turno" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Turnos</SelectItem>
                  <SelectItem value="manha">Turno da Manhã</SelectItem>
                  <SelectItem value="tarde">Turno da Tarde</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
        </Card>

        {/* Shift Comparison Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Morning Stats */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Sun className="h-5 w-5" />
                Turno da Manhã
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{morningStats.uniqueStudents}</p>
                  <p className="text-sm text-gray-600">Estudantes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{morningStats.avgEtiquetteScore}</p>
                  <p className="text-sm text-gray-600">Média Etiqueta</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-blue-600">{morningStats.behavioral}</p>
                  <p className="text-xs text-gray-600">Comportamental</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-green-600">{morningStats.etiquette}</p>
                  <p className="text-xs text-gray-600">Etiqueta</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-pink-600">{morningStats.emotional}</p>
                  <p className="text-xs text-gray-600">Emocional</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-amber-600">{morningStats.lifePurpose}</p>
                  <p className="text-xs text-gray-600">Propósito</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Afternoon Stats */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-blue-400 to-indigo-400 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Moon className="h-5 w-5" />
                Turno da Tarde
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{afternoonStats.uniqueStudents}</p>
                  <p className="text-sm text-gray-600">Estudantes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{afternoonStats.avgEtiquetteScore}</p>
                  <p className="text-sm text-gray-600">Média Etiqueta</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-blue-600">{afternoonStats.behavioral}</p>
                  <p className="text-xs text-gray-600">Comportamental</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-green-600">{afternoonStats.etiquette}</p>
                  <p className="text-xs text-gray-600">Etiqueta</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-pink-600">{afternoonStats.emotional}</p>
                  <p className="text-xs text-gray-600">Emocional</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-amber-600">{afternoonStats.lifePurpose}</p>
                  <p className="text-xs text-gray-600">Propósito</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Overall Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Brain className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Competências</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredBehavioralResponses.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Award className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Testes de Etiqueta</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredEtiquetteResponses.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Estudos de Caso</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredCaseStudyResponses.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-indigo-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Estudantes Únicos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      new Set([
                        ...filteredBehavioralResponses.map((r) => r.student_name),
                        ...filteredEtiquetteResponses.map((r) => r.student_name),
                        ...filteredCaseStudyResponses.map((r) => r.student_name),
                        ...filteredEmotionalResponses.map((r) => r.student_name),
                        ...filteredLifePurposeResponses.map((r) => r.student_name),
                      ]).size
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pontuação Média</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {filteredEtiquetteResponses.length > 0
                      ? Math.round(
                          filteredEtiquetteResponses.reduce((sum, r) => sum + r.total_points, 0) /
                            filteredEtiquetteResponses.length,
                        )
                      : 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="behavioral" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="behavioral">Competências</TabsTrigger>
            <TabsTrigger value="etiquette">Etiqueta</TabsTrigger>
            <TabsTrigger value="emotional">Emocional</TabsTrigger>
            <TabsTrigger value="life-purpose">Propósito</TabsTrigger>
            <TabsTrigger value="cases">Casos</TabsTrigger>
          </TabsList>

          <TabsContent value="behavioral" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Respostas do Teste de Competência Comportamental</CardTitle>
                    <CardDescription>
                      Visualize as avaliações de competências dos estudantes
                      {selectedShift !== "todos" && ` - Turno da ${getShiftLabel(selectedShift)}`}
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => exportToCSV(filteredBehavioralResponses, "competencias-comportamentais.csv")}
                    variant="outline"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredBehavioralResponses.map((response) => (
                    <div key={response.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{response.student_name}</h3>
                          {response.student_email && <p className="text-sm text-gray-600">{response.student_email}</p>}
                          {response.shift && (
                            <Badge className={`mt-1 ${getShiftColor(response.shift)}`}>
                              {getShiftIcon(response.shift)}
                              <span className="ml-1">{getShiftLabel(response.shift)}</span>
                            </Badge>
                          )}
                        </div>
                        <div className="text-right">
                          <Badge className="bg-indigo-100 text-indigo-800">
                            Média: {response.average_score.toFixed(1)}/10
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(response.completed_at).toLocaleString("pt-BR")}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-3 rounded text-sm">
                          <div className="flex items-center gap-2 mb-1">
                            <span>⚖️</span>
                            <strong>Ética:</strong>
                          </div>
                          <span className="text-lg font-bold text-indigo-600">{response.etica}/10</span>
                        </div>

                        <div className="bg-gray-50 p-3 rounded text-sm">
                          <div className="flex items-center gap-2 mb-1">
                            <span>💡</span>
                            <strong>P. Empreendedor:</strong>
                          </div>
                          <span className="text-lg font-bold text-indigo-600">
                            {response.pensamento_empreendedor}/10
                          </span>
                        </div>

                        <div className="bg-gray-50 p-3 rounded text-sm">
                          <div className="flex items-center gap-2 mb-1">
                            <span>🎨</span>
                            <strong>Criatividade:</strong>
                          </div>
                          <span className="text-lg font-bold text-indigo-600">{response.criatividade}/10</span>
                        </div>

                        <div className="bg-gray-50 p-3 rounded text-sm">
                          <div className="flex items-center gap-2 mb-1">
                            <span>⚡</span>
                            <strong>Produtividade:</strong>
                          </div>
                          <span className="text-lg font-bold text-indigo-600">{response.produtividade}/10</span>
                        </div>

                        <div className="bg-gray-50 p-3 rounded text-sm">
                          <div className="flex items-center gap-2 mb-1">
                            <span>🤝</span>
                            <strong>R. Interpessoal:</strong>
                          </div>
                          <span className="text-lg font-bold text-indigo-600">
                            {response.relacionamento_interpessoal}/10
                          </span>
                        </div>

                        <div className="bg-gray-50 p-3 rounded text-sm">
                          <div className="flex items-center gap-2 mb-1">
                            <span>👥</span>
                            <strong>Trabalho Equipe:</strong>
                          </div>
                          <span className="text-lg font-bold text-indigo-600">{response.trabalho_em_equipe}/10</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredBehavioralResponses.length === 0 && (
                    <p className="text-center text-gray-500 py-8">
                      Nenhuma resposta de competência comportamental
                      {selectedShift !== "todos" && ` para o turno da ${getShiftLabel(selectedShift)}`}.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="etiquette" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Respostas do Teste de Boas Maneiras</CardTitle>
                    <CardDescription>
                      Visualize os resultados dos testes de etiqueta dos estudantes
                      {selectedShift !== "todos" && ` - Turno da ${getShiftLabel(selectedShift)}`}
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => exportToCSV(filteredEtiquetteResponses, "teste-etiqueta.csv")}
                    variant="outline"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredEtiquetteResponses.map((response) => (
                    <div key={response.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{response.student_name}</h3>
                          {response.student_email && <p className="text-sm text-gray-600">{response.student_email}</p>}
                          {response.shift && (
                            <Badge className={`mt-1 ${getShiftColor(response.shift)}`}>
                              {getShiftIcon(response.shift)}
                              <span className="ml-1">{getShiftLabel(response.shift)}</span>
                            </Badge>
                          )}
                        </div>
                        <div className="text-right">
                          <Badge className={getScoreColor(response.total_points)}>
                            {response.total_points}/30 - {getScoreLabel(response.total_points)}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(response.completed_at).toLocaleString("pt-BR")}
                          </p>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded text-sm">
                        <strong>Resultado:</strong> {response.result_text}
                      </div>
                    </div>
                  ))}
                  {filteredEtiquetteResponses.length === 0 && (
                    <p className="text-center text-gray-500 py-8">
                      Nenhuma resposta do teste de etiqueta
                      {selectedShift !== "todos" && ` para o turno da ${getShiftLabel(selectedShift)}`}.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="emotional" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Respostas do Teste de Inteligência Emocional</CardTitle>
                    <CardDescription>
                      Visualize as avaliações de inteligência emocional dos estudantes
                      {selectedShift !== "todos" && ` - Turno da ${getShiftLabel(selectedShift)}`}
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => exportToCSV(filteredEmotionalResponses, "inteligencia-emocional.csv")}
                    variant="outline"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredEmotionalResponses.map((response) => (
                    <div key={response.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{response.student_name}</h3>
                          {response.student_email && <p className="text-sm text-gray-600">{response.student_email}</p>}
                          {response.shift && (
                            <Badge className={`mt-1 ${getShiftColor(response.shift)}`}>
                              {getShiftIcon(response.shift)}
                              <span className="ml-1">{getShiftLabel(response.shift)}</span>
                            </Badge>
                          )}
                        </div>
                        <div className="text-right">
                          <Badge className="bg-pink-100 text-pink-800">
                            Média: {response.average_score.toFixed(1)}/7
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(response.completed_at).toLocaleString("pt-BR")}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded">
                          <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">🧠 Intrapessoal</h4>
                          <p className="text-2xl font-bold text-blue-600">{response.intrapersonal_score}/182</p>
                          <p className="text-sm text-gray-600">Autoconhecimento e autorregulação</p>
                        </div>

                        <div className="bg-green-50 p-4 rounded">
                          <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">🤝 Interpessoal</h4>
                          <p className="text-2xl font-bold text-green-600">{response.interpersonal_score}/91</p>
                          <p className="text-sm text-gray-600">Habilidades sociais</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredEmotionalResponses.length === 0 && (
                    <p className="text-center text-gray-500 py-8">
                      Nenhuma resposta de inteligência emocional
                      {selectedShift !== "todos" && ` para o turno da ${getShiftLabel(selectedShift)}`}.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="life-purpose" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Respostas sobre Propósito de Vida</CardTitle>
                    <CardDescription>
                      Visualize as reflexões dos estudantes sobre Viktor Frankl
                      {selectedShift !== "todos" && ` - Turno da ${getShiftLabel(selectedShift)}`}
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => exportToCSV(filteredLifePurposeResponses, "proposito-de-vida.csv")}
                    variant="outline"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {filteredLifePurposeResponses.map((response) => (
                    <div key={response.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{response.student_name}</h3>
                          {response.student_email && <p className="text-sm text-gray-600">{response.student_email}</p>}
                          {response.shift && (
                            <Badge className={`mt-1 ${getShiftColor(response.shift)}`}>
                              {getShiftIcon(response.shift)}
                              <span className="ml-1">{getShiftLabel(response.shift)}</span>
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {new Date(response.completed_at).toLocaleString("pt-BR")}
                        </p>
                      </div>
                      <div className="space-y-3">
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="font-medium text-sm mb-1">1. O que dá sentido à sua vida?</p>
                          <p className="text-sm text-gray-700">{response.question_1}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="font-medium text-sm mb-1">2. Por que e para que você faz as coisas que faz?</p>
                          <p className="text-sm text-gray-700">{response.question_2}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="font-medium text-sm mb-1">3. Você faz ou deixa os outros decidirem por você?</p>
                          <p className="text-sm text-gray-700">{response.question_3}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="font-medium text-sm mb-1">4. Quem é responsável pela sua vida?</p>
                          <p className="text-sm text-gray-700">{response.question_4}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="font-medium text-sm mb-1">5. Como mudar sua vida para chegar aos patamares?</p>
                          <p className="text-sm text-gray-700">{response.question_5}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredLifePurposeResponses.length === 0 && (
                    <p className="text-center text-gray-500 py-8">
                      Nenhuma resposta sobre propósito de vida
                      {selectedShift !== "todos" && ` para o turno da ${getShiftLabel(selectedShift)}`}.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cases" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Respostas dos Estudos de Caso</CardTitle>
                    <CardDescription>
                      Visualize as análises éticas dos estudantes
                      {selectedShift !== "todos" && ` - Turno da ${getShiftLabel(selectedShift)}`}
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => exportToCSV(filteredCaseStudyResponses, "estudos-de-caso.csv")}
                    variant="outline"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {filteredCaseStudyResponses.map((response) => (
                    <div key={response.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{response.student_name}</h3>
                          {response.student_email && <p className="text-sm text-gray-600">{response.student_email}</p>}
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline">{response.case_title}</Badge>
                            {response.shift && (
                              <Badge className={getShiftColor(response.shift)}>
                                {getShiftIcon(response.shift)}
                                <span className="ml-1">{getShiftLabel(response.shift)}</span>
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">
                          {new Date(response.completed_at).toLocaleString("pt-BR")}
                        </p>
                      </div>
                      <div className="space-y-3">
                        {response.answers.map((answer, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded">
                            <p className="font-medium text-sm mb-1">Questão {index + 1}:</p>
                            <p className="text-sm text-gray-700">{answer}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {filteredCaseStudyResponses.length === 0 && (
                    <p className="text-center text-gray-500 py-8">
                      Nenhuma resposta de estudo de caso
                      {selectedShift !== "todos" && ` para o turno da ${getShiftLabel(selectedShift)}`}.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
