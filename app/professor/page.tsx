"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Download, Users, Award, FileText, Calendar, Brain } from "lucide-react"
import { createClient } from "@supabase/supabase-js"
import Logo from "@/components/logo"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

interface EtiquetteResponse {
  id: number
  student_name: string
  student_email: string
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
  case_title: string
  answers: string[]
  completed_at: string
}

interface BehavioralCompetencyResponse {
  id: number
  student_name: string
  student_email: string
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

export default function ProfessorDashboard() {
  const [etiquetteResponses, setEtiquetteResponses] = useState<EtiquetteResponse[]>([])
  const [caseStudyResponses, setCaseStudyResponses] = useState<CaseStudyResponse[]>([])
  const [behavioralResponses, setBehavioralResponses] = useState<BehavioralCompetencyResponse[]>([])
  const [loading, setLoading] = useState(true)

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
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Award className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Testes de Etiqueta</p>
                  <p className="text-2xl font-bold text-gray-900">{etiquetteResponses.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Estudos de Caso</p>
                  <p className="text-2xl font-bold text-gray-900">{caseStudyResponses.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Estudantes Únicos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      new Set([
                        ...behavioralResponses.map((r) => r.student_name),
                        ...etiquetteResponses.map((r) => r.student_name),
                        ...caseStudyResponses.map((r) => r.student_name),
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
                <Brain className="h-8 w-8 text-indigo-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Testes Comportamentais</p>
                  <p className="text-2xl font-bold text-gray-900">{behavioralResponses.length}</p>
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
                    {etiquetteResponses.length > 0
                      ? Math.round(
                          etiquetteResponses.reduce((sum, r) => sum + r.total_points, 0) / etiquetteResponses.length,
                        )
                      : 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="etiquette" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="behavioral">Competências</TabsTrigger>
            <TabsTrigger value="etiquette">Teste de Etiqueta</TabsTrigger>
            <TabsTrigger value="cases">Estudos de Caso</TabsTrigger>
          </TabsList>

          <TabsContent value="behavioral" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Respostas do Teste de Competência Comportamental</CardTitle>
                    <CardDescription>Visualize as avaliações de competências dos estudantes</CardDescription>
                  </div>
                  <Button
                    onClick={() => exportToCSV(behavioralResponses, "competencias-comportamentais.csv")}
                    variant="outline"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {behavioralResponses.map((response) => (
                    <div key={response.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{response.student_name}</h3>
                          {response.student_email && <p className="text-sm text-gray-600">{response.student_email}</p>}
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
                  {behavioralResponses.length === 0 && (
                    <p className="text-center text-gray-500 py-8">
                      Nenhuma resposta de competência comportamental ainda.
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
                    <CardDescription>Visualize os resultados dos testes de etiqueta dos estudantes</CardDescription>
                  </div>
                  <Button onClick={() => exportToCSV(etiquetteResponses, "teste-etiqueta.csv")} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {etiquetteResponses.map((response) => (
                    <div key={response.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{response.student_name}</h3>
                          {response.student_email && <p className="text-sm text-gray-600">{response.student_email}</p>}
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
                  {etiquetteResponses.length === 0 && (
                    <p className="text-center text-gray-500 py-8">Nenhuma resposta do teste de etiqueta ainda.</p>
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
                    <CardDescription>Visualize as análises éticas dos estudantes</CardDescription>
                  </div>
                  <Button onClick={() => exportToCSV(caseStudyResponses, "estudos-de-caso.csv")} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {caseStudyResponses.map((response) => (
                    <div key={response.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{response.student_name}</h3>
                          {response.student_email && <p className="text-sm text-gray-600">{response.student_email}</p>}
                          <Badge variant="outline" className="mt-1">
                            {response.case_title}
                          </Badge>
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
                  {caseStudyResponses.length === 0 && (
                    <p className="text-center text-gray-500 py-8">Nenhuma resposta de estudo de caso ainda.</p>
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
