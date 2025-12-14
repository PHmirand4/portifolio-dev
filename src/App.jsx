import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Code,
  Database,
  Smartphone,
  Server,
  ChevronDown,
  Menu,
  X,
  MapPin,
  Calendar,
  GraduationCap,
  Briefcase,
  Star,
  ArrowUp
} from 'lucide-react'
import './App.css'

// Componente de cursor customizado
const CustomCursor = () => {
  const cursorRef = useRef(null)
  const trailRef = useRef(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const trail = trailRef.current
    if (!cursor || !trail) return

    const handleMouseMove = (e) => {
      cursor.style.left = e.clientX + 'px'
      cursor.style.top = e.clientY + 'px'

      // Trail com delay
      setTimeout(() => {
        trail.style.left = e.clientX + 'px'
        trail.style.top = e.clientY + 'px'
      }, 50)
    }

    const handleMouseEnter = () => {
      cursor.style.opacity = '1'
      trail.style.opacity = '1'
    }

    const handleMouseLeave = () => {
      cursor.style.opacity = '0'
      trail.style.opacity = '0'
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <>
      <div ref={cursorRef} className="custom-cursor" />
      <div ref={trailRef} className="custom-cursor-trail" />
    </>
  )
}

// Componente de background animado
const AnimatedBackground = () => {
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const particlesRef = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationId

    // Configurar canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Criar partículas
    const createParticles = () => {
      const particles = []
      const particleCount = 100

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.5 + 0.2,
          color: `hsl(${Math.random() * 60 + 200}, 70%, 60%)` // Tons de azul/roxo
        })
      }
      return particles
    }

    particlesRef.current = createParticles()

    // Rastrear mouse
    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    window.addEventListener('mousemove', handleMouseMove)

    // Função de animação
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Desenhar conexões entre partículas próximas
      particlesRef.current.forEach((particle, i) => {
        particlesRef.current.slice(i + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(100, 150, 255, ${0.1 * (1 - distance / 100)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.stroke()
          }
        })
      })

      // Atualizar e desenhar partículas
      particlesRef.current.forEach(particle => {
        // Movimento
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Bounce nas bordas
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1

        // Interação com mouse
        const mouseDistance = Math.sqrt(
          Math.pow(particle.x - mouseRef.current.x, 2) +
          Math.pow(particle.y - mouseRef.current.y, 2)
        )

        if (mouseDistance < 150) {
          const force = (150 - mouseDistance) / 150
          const angle = Math.atan2(particle.y - mouseRef.current.y, particle.x - mouseRef.current.x)
          particle.x += Math.cos(angle) * force * 2
          particle.y += Math.sin(angle) * force * 2
        }

        // Desenhar partícula
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.globalAlpha = particle.opacity
        ctx.fill()
      })

      // Efeito de brilho no cursor
      const gradient = ctx.createRadialGradient(
        mouseRef.current.x, mouseRef.current.y, 0,
        mouseRef.current.x, mouseRef.current.y, 200
      )
      gradient.addColorStop(0, 'rgba(100, 150, 255, 0.1)')
      gradient.addColorStop(0.5, 'rgba(150, 100, 255, 0.05)')
      gradient.addColorStop(1, 'rgba(255, 100, 150, 0)')

      ctx.globalAlpha = 1
      ctx.fillStyle = gradient
      ctx.fillRect(mouseRef.current.x - 200, mouseRef.current.y - 200, 400, 400)

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  )
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [showScrollTop, setShowScrollTop] = useState(false)

  // Configuração editável do portfólio
  const portfolioData = {
    personal: {
      name: "Pedro H. Miranda",
      title: "Software Developer | IT Security & Networking | Computer Engineering | DevOps",
      subtitle: "Construindo soluções de software com foco em inovação e usabilidade",
      location: "Rio de Janeiro, Brasil",
      email: "p.h.miranda1712@gmail.com",
      bio: "Estudante de Engenharia da Computação com trajetória que evoluiu do suporte técnico ao desenvolvimento de software completo. Focado em criar soluções práticas, inovadoras e centradas no usuário. Apaixonado por tecnologia, busco constantemente aprimorar minhas habilidades e contribuir para projetos que façam a diferença.",
      image: "/api/placeholder/300/300" // Altere para o caminho da sua imagem
    },
    social: {
      github: "https://github.com/PHmirand4",
      email: "mailto:p.h.miranda1712@gmail.com"
    },
    skills: {
      frontend: ["JavaScript", "HTML", "CSS3", "React (Básico)"],
      backend: ["Python (Básico)", "Java (Intermediário)", "Node.js (Básico)", "MySQL"],
      mobile: ["Flutter (Avançado)", "Dart (Avançado)", "Firebase"],
      tools: ["Git/GitHub", "Docker", "Linux", "AWS Cloud", "Figma", "NuvemShop", "WordPress", "n8n", "OpenAI (GPT)"]
    },
    education: {
      degree: "Bacharelado em Engenharia da Computação",
      institution: "Instituto Federal Fluminense (IFF)",
    
    },
    projects: [
      {
        id: 1,
        title: "App de Gestão Rural - Agroecologia_5G (Bolsa PIBITI/CNPq)",
        description: "Aplicativo móvel para gestão de atividades agrícolas com arquitetura offline-first, desenvolvido para auxiliar agricultores familiares no controle de suas atividades rurais.",
        technologies: ["Flutter", "Dart", "Firebase", "SQLite", "Figma"],
        status: "Em desenvolvimento",
        github: "https://github.com/PHmirand4",
        demo: null,
        image: "/api/placeholder/400/250"
      },
      {
        id: 2,
        title: "App de Agendamento para Barbearia (Freelance)",
        description: "Aplicativo móvel completo para agendamento de serviços de barbearia, substituindo o sistema web anterior por uma solução móvel nativa mais eficiente.",
        technologies: ["Flutter", "Dart", "Firebase"],
        status: "Concluído e em uso",
        github: "https://github.com/PHmirand4/Rei_Du_Corte",
        demo: null,
        image: "/api/placeholder/400/250"
      },
      {
        id: 3,
        title: "Loja Virtual para Café Artesanal (NuvemShop)",
        description: "Desenvolvimento completo de loja virtual para produtor de cafés especiais, incluindo personalização de layout responsivo, cadastro de produtos com otimização SEO e integração com gateway de pagamento.",
        technologies: ["NuvemShop", "Web Design", "E-commerce", "SEO"],
        status: "Concluído",
        github: null,
        demo: null, // Adicione o link da loja aqui, se desejar
        image: "/api/placeholder/400/250"
      },
      {
        id: 4,
        title: "Automação de Processos e Chatbots com IA",
        description: "Criação de atendentes virtuais para WhatsApp integrados com OpenAI (GPT) para qualificar leads e automatizar o atendimento. Integração de sistemas via APIs (CRMs, planilhas) e automação de tarefas internas.",
        technologies: ["n8n", "OpenAI (GPT)", "WhatsApp Business API", "APIs REST"],
        status: "Em andamento",
        github: null,
        demo: null,
        image: "/api/placeholder/400/250"
      },
      {
        id: 5,
        title: "Site Institucional e Blog em WordPress",
        description: "Desenvolvimento de um site institucional completo com blog para uma empresa local, incluindo personalização de tema e configuração de plugins de SEO e segurança.",
        technologies: ["WordPress", "PHP", "HTML", "CSS", "SEO"],
        status: "Concluído",
        github: null,
        demo: null, // Adicione o link do site aqui, se desejar
        image: "/api/placeholder/400/250"
      },
      {
        id: 6,
        title: "Protótipo de App para Robô de Secagem de Café",
        description: "Design da experiência do usuário (UX) e prototipação de alta fidelidade no Figma para um aplicativo móvel de monitoramento e controle de um robô de secagem de café (Conceito de Startup).",
        technologies: ["Figma", "UI/UX Design", "Prototipagem", "IoT (Conceito)"],
        status: "Protótipo",
        github: null,
        demo: null, // Adicione o link do protótipo no Figma aqui, se desejar
        image: "/api/placeholder/400/250"
      },
      
    ],
    experience: [
      {
        id: 1,
        title: "Bolsista de Inovação Tecnológica e Suporte de TI",
        company: "Laboratório Maker - Instituto Federal Fluminense (FAPERJ)",
        period: "Março 2023 - Março 2025",
        type: "Bolsa de Inovação",
        description: "Responsável pelo mapeamento de processos (criação de POPs e fluxogramas) e prestação de suporte técnico especializado em TI para todo o campus. Atuação em projetos de inovação tecnológica com fomento FAPERJ.",
        achievements: [
          "Criei documentação técnica (POPs) para equipamentos de prototipagem",
          "Mapeei e otimizei fluxos de trabalho do laboratório",
          "Prestei suporte de TI para centenas de usuários e diversos setores"
        ]
      },
      {
        id: 2,
        title: "Auxiliar de Informática",
        company: "Faculdade Multivix",
        period: "Março 2022 - Setembro 2022",
        type: "Profissional",
        description: "Responsável pelo suporte técnico a usuários e pela manutenção de hardware e software nos laboratórios, garantindo a disponibilidade dos recursos tecnológicos.",
        achievements: [
          "Diagnóstico e resolução de problemas de hardware e software",
          "Configuração de computadores em larga escala para laboratórios",
          "Suporte à infraestrutura de rede da faculdade"
        ]
      }
    ]
  }

  // Scroll spy para navegação
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'projects', 'experience', 'skills', 'contact']
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const offsetTop = element.offsetTop
          const offsetHeight = element.offsetHeight

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }

      setShowScrollTop(window.scrollY > 500)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMenuOpen(false)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-background text-foreground dark relative overflow-x-hidden">
      {/* Cursor Customizado */}
      <CustomCursor />

      {/* Background Animado */}
      <AnimatedBackground />

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
            >
              {portfolioData.personal.name}
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {['home', 'about', 'projects', 'experience', 'skills', 'contact'].map((item, index) => (
                <motion.button
                  key={item}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => scrollToSection(item)}
                  className={`capitalize transition-all duration-300 hover:text-primary hover:scale-105 ${activeSection === item ? 'text-primary' : 'text-muted-foreground'
                    }`}
                >
                  {item === 'home' ? 'Início' :
                    item === 'about' ? 'Sobre' :
                      item === 'projects' ? 'Projetos' :
                        item === 'experience' ? 'Experiência' :
                          item === 'skills' ? 'Habilidades' :
                            'Contato'}
                </motion.button>
              ))}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-background border-t border-border"
            >
              <div className="px-4 py-2 space-y-2">
                {['home', 'about', 'projects', 'experience', 'skills', 'contact'].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item)}
                    className="block w-full text-left px-3 py-2 rounded-md hover:bg-accent capitalize transition-colors"
                  >
                    {item === 'home' ? 'Início' :
                      item === 'about' ? 'Sobre' :
                        item === 'projects' ? 'Projetos' :
                          item === 'experience' ? 'Experiência' :
                            item === 'skills' ? 'Habilidades' :
                              'Contato'}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                {portfolioData.personal.name}
              </span>
            </motion.h1>
            <motion.h2
              className="text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-4"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {portfolioData.personal.title}
            </motion.h2>
            <motion.p
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {portfolioData.personal.subtitle}
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Button
                size="lg"
                onClick={() => scrollToSection('projects')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-105 transition-all duration-300"
              >
                Ver Projetos
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToSection('contact')}
                className="hover:scale-105 transition-all duration-300"
              >
                Entre em Contato
              </Button>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <ChevronDown size={32} className="text-muted-foreground" />
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Sobre Mim</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Conheça mais sobre minha jornada e paixão por tecnologia
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <motion.div
                  className="w-80 h-80 mx-auto rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center"
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-72 h-72 rounded-xl bg-muted flex items-center justify-center">
                    <span className="text-6xl">👨‍💻</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <p className="text-lg leading-relaxed">
                {portfolioData.personal.bio}
              </p>

              <div className="space-y-4">
                <motion.div
                  className="flex items-center gap-3"
                  whileHover={{ x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <MapPin size={20} className="text-primary" />
                  <span>{portfolioData.personal.location}</span>
                </motion.div>
                <motion.div
                  className="flex items-center gap-3"
                  whileHover={{ x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <GraduationCap size={20} className="text-primary" />
                  <span>{portfolioData.education.degree} - {portfolioData.education.institution}</span>
                </motion.div>
                <motion.div
                  className="flex items-center gap-3"
                  whileHover={{ x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Calendar size={20} className="text-primary" />
                  <span>{portfolioData.education.status}</span>
                </motion.div>
              </div>

              <div className="flex gap-4">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Button asChild>
                    <a href={portfolioData.social.github} target="_blank" rel="noopener noreferrer">
                      <Github size={20} className="mr-2" />
                      GitHub
                    </a>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" asChild>
                    <a href={portfolioData.social.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin size={20} className="mr-2" />
                      LinkedIn
                    </a>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4 bg-muted/30 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Projetos</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Alguns dos projetos que desenvolvi durante minha jornada
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioData.projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:shadow-blue-500/20 card-glow">
                  <motion.div
                    className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-t-lg flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Code size={48} className="text-primary group-hover:scale-110 transition-transform duration-300" />
                  </motion.div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      <Badge variant={project.status === 'Concluído' ? 'default' : 'secondary'}>
                        {project.status}
                      </Badge>
                    </div>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button size="sm" variant="outline" asChild>
                            <a href={project.github} target="_blank" rel="noopener noreferrer">
                              <Github size={16} className="mr-1" />
                              Código
                            </a>
                          </Button>
                        </motion.div>
                        {project.demo && (
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button size="sm" asChild>
                              <a href={project.demo} target="_blank" rel="noopener noreferrer">
                                <ExternalLink size={16} className="mr-1" />
                                Demo
                              </a>
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Experiência</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Minha trajetória profissional e principais conquistas
            </p>
          </motion.div>

          <div className="space-y-8">
            {portfolioData.experience.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300 hover:shadow-blue-500/20">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Briefcase size={20} className="text-primary" />
                          {exp.title}
                        </CardTitle>
                        <CardDescription className="text-lg font-medium">
                          {exp.company} • {exp.type}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">{exp.period}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">{exp.description}</p>
                    <div className="space-y-2">
                      <h4 className="font-medium">Principais conquistas:</h4>
                      <ul className="space-y-1">
                        {exp.achievements.map((achievement, i) => (
                          <motion.li
                            key={i}
                            className="flex items-start gap-2"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                          >
                            <Star size={16} className="text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{achievement}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-4 bg-muted/30 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Habilidades</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Tecnologias e ferramentas que domino
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.05 }}
            >
              <Card className="text-center hover:shadow-lg transition-all duration-300 hover:shadow-blue-500/20">
                <CardHeader>
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Code size={48} className="mx-auto text-blue-500 mb-4" />
                  </motion.div>
                  <CardTitle>Frontend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {portfolioData.skills.frontend.map((skill) => (
                      <motion.div
                        key={skill}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Badge variant="secondary">{skill}</Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.05 }}
            >
              <Card className="text-center hover:shadow-lg transition-all duration-300 hover:shadow-green-500/20">
                <CardHeader>
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Server size={48} className="mx-auto text-green-500 mb-4" />
                  </motion.div>
                  <CardTitle>Backend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {portfolioData.skills.backend.map((skill) => (
                      <motion.div
                        key={skill}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Badge variant="secondary">{skill}</Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.05 }}
            >
              <Card className="text-center hover:shadow-lg transition-all duration-300 hover:shadow-purple-500/20">
                <CardHeader>
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Smartphone size={48} className="mx-auto text-purple-500 mb-4" />
                  </motion.div>
                  <CardTitle>Mobile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {portfolioData.skills.mobile.map((skill) => (
                      <motion.div
                        key={skill}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Badge variant="secondary">{skill}</Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.05 }}
            >
              <Card className="text-center hover:shadow-lg transition-all duration-300 hover:shadow-orange-500/20">
                <CardHeader>
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Database size={48} className="mx-auto text-orange-500 mb-4" />
                  </motion.div>
                  <CardTitle>Ferramentas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {portfolioData.skills.tools.map((skill) => (
                      <motion.div
                        key={skill}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Badge variant="secondary">{skill}</Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Entre em Contato</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Vamos conversar sobre oportunidades e projetos interessantes
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-xl font-semibold mb-4">Informações de Contato</h3>

              <div className="space-y-4">
                <motion.div
                  className="flex items-center gap-3"
                  whileHover={{ x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Mail size={20} className="text-primary" />
                  <a href={`mailto:${portfolioData.personal.email}`} className="hover:text-primary transition-colors">
                    {portfolioData.personal.email}
                  </a>
                </motion.div>
                <motion.div
                  className="flex items-center gap-3"
                  whileHover={{ x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <MapPin size={20} className="text-primary" />
                  <span>{portfolioData.personal.location}</span>
                </motion.div>
              </div>

              <div className="flex gap-4">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="sm" asChild>
                    <a href={portfolioData.social.github} target="_blank" rel="noopener noreferrer">
                      <Github size={20} />
                    </a>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="sm" asChild>
                    <a href={portfolioData.social.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin size={20} />
                    </a>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="sm" asChild>
                    <a href={portfolioData.social.email}>
                      <Mail size={20} />
                    </a>
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="hover:shadow-lg transition-all duration-300 hover:shadow-blue-500/20">
                <CardHeader>
                  <CardTitle>Envie uma Mensagem</CardTitle>
                  <CardDescription>
                    Preencha o formulário abaixo e entrarei em contato em breve
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Nome</label>
                        <Input placeholder="Seu nome" className="transition-all duration-300 focus:scale-105" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Email</label>
                        <Input type="email" placeholder="seu@email.com" className="transition-all duration-300 focus:scale-105" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Assunto</label>
                      <Input placeholder="Assunto da mensagem" className="transition-all duration-300 focus:scale-105" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Mensagem</label>
                      <Textarea placeholder="Sua mensagem..." rows={4} className="transition-all duration-300 focus:scale-105" />
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button type="submit" className="w-full">
                        Enviar Mensagem
                      </Button>
                    </motion.div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <motion.p
            className="text-muted-foreground"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            © 2024 {portfolioData.personal.name}. Todos os direitos reservados.
          </motion.p>
        </div>
      </footer>

      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={scrollToTop}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-8 right-8 p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-shadow z-50"
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App

