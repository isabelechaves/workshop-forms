"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BookOpen, Users, Award, FileText } from "lucide-react"
import EtiquetteTest from "@/components/etiquette-test"
import CaseStudy from "@/components/case-study"
import Logo from "@/components/logo"

export default function HomePage() {
  const [currentForm, setCurrentForm] = useState<number | null>(null)
  const [studentName, setStudentName] = useState("")
  const [studentEmail, setStudentEmail] = useState("")

  const handleStartForm = (formNumber: number) => {
    if (!studentName.trim()) {
      alert("Por favor, insira seu nome antes de começar!")
      return
    }
    setCurrentForm(formNumber)
  }

  const handleBackToHome = () => {
    setCurrentForm(null)
  }

  if (currentForm === 1) {
    return <EtiquetteTest studentName={studentName} studentEmail={studentEmail} onBack={handleBackToHome} />
  }

  if (currentForm === 2) {
    return (
      <CaseStudy
        formNumber={2}
        title="Estudo de Caso: Ética e Moral no Polo Industrial de Manaus"
        description="Entre o Lucro e a Responsabilidade: O Dilema da BioToc Amazônia"
        caseText={`A empresa BioToc Amazônia S.A. é uma indústria de médio porte localizada no Polo Industrial de Manaus (PIM), voltada para a produção de cosméticos naturais utilizando extratos vegetais da floresta amazônica. Fundada com o discurso de respeito à biodiversidade e compromisso com o desenvolvimento sustentável, a empresa ganhou rapidamente reconhecimento local e internacional.

Nos primeiros anos de operação, a BioToc firmou parcerias com comunidades ribeirinhas para a coleta de insumos vegetais, prometendo pagamento justo, preservação ambiental e capacitação da mão de obra local. No entanto, após a mudança na diretoria executiva, os objetivos da empresa começaram a se alinhar mais com o aumento do lucro e a expansão de mercado do que com os compromissos iniciais de responsabilidade social.

**Relatórios internos recentes apontaram práticas como:**

• Extração acima dos limites acordados com órgãos ambientais, sem o devido replantio das espécies coletadas

• Terceirização da produção para cooperativas informais que não garantem condições mínimas de segurança e saúde para os trabalhadores

• Pagamentos reduzidos às comunidades extrativistas, contrariando os contratos firmados anteriormente

• Pressão interna sobre os funcionários para ocultar dados ambientais em auditorias externas, sob ameaça de demissão

**O Caso de Larissa Oliveira:**

Uma das colaboradoras da área de controle de qualidade, Larissa Oliveira, encontrou inconsistências nos laudos ambientais e procurou a ouvidoria interna. Em vez de receber apoio, passou a ser ignorada pela chefia e transferida de setor de maneira punitiva.

Ao tentar denúncia externa ao Ministério Público do Trabalho, Larissa enfrentou retaliações e teve sua conduta questionada pelos colegas, muitos dos quais temiam perder o emprego.

**Repercussão:**

O caso chegou à imprensa, gerando forte repercussão local e exigindo uma resposta urgente da empresa. A BioToc divulgou uma nota afirmando que "segue todos os princípios legais e éticos vigentes", mas não apresentou provas claras de correções ou compromissos concretos.`}
        questions={[
          "Quais princípios éticos foram violados pela direção da BioToc Amazônia? Aponte também os impactos morais dessas violações para os funcionários e comunidades envolvidas.",
          "Como o conceito de responsabilidade social empresarial foi comprometido neste caso? Que medidas práticas poderiam ter sido adotadas para alinhar lucro e ética?",
          "Qual é o papel do trabalhador, como Larissa, em denunciar práticas antiéticas? Que mecanismos institucionais poderiam proteger profissionais que agem com integridade nesse tipo de situação?",
          "Considerando o contexto do Polo Industrial de Manaus, qual deve ser o papel do Estado, das organizações civis e da sociedade para garantir que o desenvolvimento econômico respeite os valores éticos e morais?",
        ]}
        studentName={studentName}
        studentEmail={studentEmail}
        onBack={handleBackToHome}
      />
    )
  }

  if (currentForm === 3) {
    return (
      <CaseStudy
        formNumber={3}
        title="Estudo de Caso: Respeitando os Princípios e Valores da Empresa"
        description="O Bônus Que Custou Caro"
        caseText={`A empresa Verde Norte Ambiental S.A. atua no ramo de soluções sustentáveis para o tratamento de resíduos industriais no Polo Industrial de Manaus. Fundada com base em valores como transparência, responsabilidade socioambiental, integridade e trabalho em equipe, ela sempre destacou a importância da conduta ética entre seus colaboradores e líderes.

**A Campanha de Incentivo:**

Durante o primeiro semestre de 2025, a empresa lançou uma campanha de incentivo de produtividade para o setor de logística, prometendo bonificações para equipes que reduzissem os prazos de coleta e transporte de resíduos perigosos.

**As Práticas Adotadas:**

Motivada pela meta, a equipe liderada pelo supervisor André Costa passou a adotar práticas não convencionais para acelerar o serviço:

• Ignorou paradas obrigatórias para manutenção dos caminhões

• Flexibilizou o tempo de descanso dos motoristas

• Transportou cargas acima do limite em algumas rotas

**O Conflito:**

Apesar de atingir os resultados e receber o bônus, uma denúncia anônima chegou ao canal de ética da empresa. Uma auditoria interna foi aberta, e descobriu-se que as práticas adotadas contrariavam tanto os procedimentos de segurança quanto os valores oficiais da organização, além de colocarem em risco a saúde dos motoristas e a imagem da empresa no mercado.

**A Justificativa:**

Ao ser questionado, André alegou que apenas fez o necessário para atingir os objetivos propostos, e que "todos estavam fazendo o mesmo" em outros setores. A diretoria, então, se viu diante de um dilema: reconhecer o esforço da equipe ou aplicar sanções pelo desrespeito aos princípios organizacionais.

O episódio gerou discussões entre os colaboradores sobre o que significa, na prática, agir conforme os valores da empresa, especialmente quando há pressão por resultados.`}
        questions={[
          "Quais foram os principais conflitos entre os valores institucionais da Verde Norte Ambiental e as ações adotadas pelo supervisor André? Como isso impacta a cultura da empresa?",
          "É possível atingir metas desafiadoras sem abrir mão dos princípios organizacionais? Que estratégias de liderança poderiam ter evitado esse tipo de conduta?",
          "Como a empresa pode reforçar a importância de seus valores na prática diária, evitando que sejam apenas 'palavras bonitas' nos quadros de missão e visão?",
        ]}
        studentName={studentName}
        studentEmail={studentEmail}
        onBack={handleBackToHome}
      />
    )
  }

  if (currentForm === 4) {
    return (
      <CaseStudy
        formNumber={4}
        title="Estudo de Caso: Cultura Organizacional"
        description="Transformação Cultural na TechManaus"
        caseText={`A empresa TechManaus Indústria de Componentes, instalada no coração do Polo Industrial de Manaus, é reconhecida há mais de duas décadas por sua eficiência na produção de dispositivos eletrônicos para o setor automotivo. Com quase 800 colaboradores, a empresa sempre foi vista como sólida, mas sua gestão interna era marcada por uma cultura organizacional rígida, departamentalizada e com pouca abertura para o diálogo entre os níveis hierárquicos.

**Os Problemas Crônicos:**

Apesar dos bons resultados em produtividade, a empresa enfrentava problemas crônicos:

• Comunicação fragmentada entre departamentos

• Falta de engajamento dos operadores da linha de produção

• Alta rotatividade no setor de montagem

• Cultura de "comando e controle" que desestimulava a proatividade

Relatórios do setor de Recursos Humanos apontavam um índice crescente de presenteísmo, ou seja, trabalhadores que estavam fisicamente presentes, mas emocionalmente desligados de suas funções.

**A Nova Diretora:**

Em 2024, diante da pressão por inovação tecnológica e mudanças nos padrões de certificação internacional, a alta direção contratou uma nova diretora de produção, Isabela Moura, com histórico de sucesso em reestruturação de equipes industriais e implementação de metodologias ágeis. Isabela acreditava que o verdadeiro diferencial competitivo viria da transformação cultural, e não apenas de novas máquinas ou softwares.

**As Mudanças Propostas:**

Nos primeiros meses, ela propôs uma série de mudanças estruturais:

• Criação de equipes multifuncionais com representantes da produção, manutenção e qualidade

• Implantação de reuniões de alinhamento semanais, com espaços para ouvir sugestões diretamente dos operadores

• Redefinição de metas: de indicadores individuais e punitivos para metas coletivas de desempenho com foco em aprendizado e melhoria contínua

• Programa de "Embaixadores da Cultura", onde colaboradores voluntários seriam capacitados para liderar ações de integração e reforço de valores

**A Resistência:**

Apesar da boa intenção, as mudanças rapidamente encontraram resistência. Supervisores com mais de 15 anos de casa se mostraram céticos: "Isso não vai funcionar aqui", diziam nos corredores. Alguns líderes médios, inseguros quanto ao seu papel, passaram a sabotar discretamente as iniciativas, evitando reuniões, distorcendo informações e desmotivando suas equipes.

A cultura de "fazer o básico para não ser cobrado" prevaleceu em muitos setores.

**O Fracasso Inicial:**

Nos bastidores, começaram a circular boatos de que Isabela estava "trazendo modismos do Sul que não servem para o Polo de Manaus". Em menos de seis meses, o programa de transformação já parecia enfraquecido. Os colaboradores, sem ver coerência entre discurso e prática, voltaram a se fechar em seus setores. O índice de sugestões caía, e os indicadores de clima organizacional pioravam.

**A Reflexão:**

O caso ganhou relevância na matriz da empresa, que pediu uma reavaliação profunda. Isabela percebeu que não se tratava apenas de implantar ferramentas, mas de tocar nas crenças e hábitos construídos ao longo de anos. Ela então propôs um plano de médio prazo, com apoio de consultoria externa, para trabalhar a cultura organizacional como um processo vivo, respeitando as raízes locais, mas preparando a empresa para o futuro.

O episódio gerou uma importante reflexão: é possível inovar sem mudar a forma como as pessoas se relacionam, se comunicam e cooperam? E mais: como transformar uma cultura sem parecer uma imposição externa?`}
        questions={[
          "Que aspectos da cultura organizacional da TechManaus criaram resistência à transformação proposta? A mudança cultural falhou ou apenas foi mal planejada?",
          "Como as práticas de trabalho em equipe poderiam ser adaptadas à realidade e à identidade da empresa, sem parecer uma ruptura brusca com sua história?",
          "De que forma a comunicação interna e o exemplo da liderança influenciam o sucesso ou fracasso de uma mudança cultural em ambientes industriais?",
          "Que estratégias poderiam ser usadas para fortalecer a confiança entre setores e criar um ambiente onde o trabalho em equipe seja valorizado de forma autêntica?",
        ]}
        studentName={studentName}
        studentEmail={studentEmail}
        onBack={handleBackToHome}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 px-2">
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3">Aulão de Ética Profissional</h1>
          <p className="text-gray-500 text-sm sm:text-base px-4">
            Desenvolva suas competências éticas no ambiente profissional
          </p>
        </div>

        {/* Student Info Form */}
        <Card className="mb-8 sm:mb-10 border-0 shadow-lg mx-2 sm:mx-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg p-6 sm:p-8">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Users className="h-4 w-4 sm:h-5 sm:w-5" />
              Identificação do Estudante
            </CardTitle>
            <CardDescription className="text-blue-100 text-sm sm:text-base">
              Preencha seus dados antes de iniciar as atividades
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <Label htmlFor="name" className="text-sm sm:text-base font-medium">
                  Nome Completo *
                </Label>
                <Input
                  id="name"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Digite seu nome completo"
                  className="mt-2 h-12"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm sm:text-base font-medium">
                  E-mail (opcional)
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  placeholder="seu.email@exemplo.com"
                  className="mt-2 h-12"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Forms Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 px-2 sm:px-0">
          {/* Form 1 - Etiquette Test */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg p-6 sm:p-8">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Award className="h-5 w-5 sm:h-6 sm:w-6" />
                Formulário 1
              </CardTitle>
              <CardDescription className="text-green-100 text-sm sm:text-base">
                Teste de Boas Maneiras no Trabalho
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
              <p className="text-gray-600 mb-6 text-sm sm:text-base leading-relaxed">
                Teste seus conhecimentos sobre etiqueta e boas maneiras no ambiente profissional. 10 questões de
                múltipla escolha com resultado personalizado.
              </p>
              <Button onClick={() => handleStartForm(1)} className="w-full bg-green-600 hover:bg-green-700 h-12">
                Iniciar Teste
              </Button>
            </CardContent>
          </Card>

          {/* Form 2 - Case Study 1 */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg p-6 sm:p-8">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
                Formulário 2
              </CardTitle>
              <CardDescription className="text-orange-100 text-sm sm:text-base">
                Ética e Moral no Polo Industrial de Manaus
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
              <p className="text-gray-600 mb-6 text-sm sm:text-base leading-relaxed">
                Analise o caso da BioToc Amazônia e reflita sobre os dilemas éticos entre lucro e responsabilidade
                social empresarial.
              </p>
              <Button onClick={() => handleStartForm(2)} className="w-full bg-orange-600 hover:bg-orange-700 h-12">
                Iniciar Estudo
              </Button>
            </CardContent>
          </Card>

          {/* Form 3 - Case Study 2 */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg p-6 sm:p-8">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
                Formulário 3
              </CardTitle>
              <CardDescription className="text-purple-100 text-sm sm:text-base">
                Princípios e Valores da Empresa
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
              <p className="text-gray-600 mb-6 text-sm sm:text-base leading-relaxed">
                Examine o caso "O Bônus Que Custou Caro" e analise os conflitos entre metas de produtividade e valores
                organizacionais.
              </p>
              <Button onClick={() => handleStartForm(3)} className="w-full bg-purple-600 hover:bg-purple-700 h-12">
                Iniciar Estudo
              </Button>
            </CardContent>
          </Card>

          {/* Form 4 - Case Study 3 */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
            <CardHeader className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-t-lg p-6 sm:p-8">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
                Formulário 4
              </CardTitle>
              <CardDescription className="text-teal-100 text-sm sm:text-base">Cultura Organizacional</CardDescription>
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
              <p className="text-gray-600 mb-6 text-sm sm:text-base leading-relaxed">
                Estude o caso da TechManaus e reflita sobre os desafios da transformação cultural em ambientes
                industriais.
              </p>
              <Button onClick={() => handleStartForm(4)} className="w-full bg-teal-600 hover:bg-teal-700 h-12">
                Iniciar Estudo
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-10 sm:mt-12 text-gray-500 px-4">
          <p className="text-xs sm:text-sm">© 2025 Aulão de Ética Profissional - Prof. Elvis de Aguiar</p>
        </div>
      </div>
    </div>
  )
}
