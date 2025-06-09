'use client';

import Link from 'next/link'
import { motion } from 'framer-motion';
import { VoiceInput } from '@/components/voice/VoiceInput';
import { TextToSpeech } from '@/components/voice/TextToSpeech';
import { TranslationReveal } from '@/components/translation/TranslationReveal';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="font-heading text-xl font-bold">Deutsch123</span>
            </Link>
          </div>
          <nav className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="flex items-center space-x-2">
              <Link
                href="/immersion"
                className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Virtual Immersion
              </Link>
              <Link
                href="/features"
                className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Features
              </Link>
              <Link
                href="/login"
                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Get Started
              </Link>
            </div>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <motion.h1 
              className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Learn German Through Immersive Experiences
            </motion.h1>
            <motion.p 
              className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Experience the most effective way to learn German. Our platform combines
              cutting-edge technology with proven learning methods to create an
              immersive, engaging, and personalized learning journey.
            </motion.p>
            <motion.div 
              className="space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link
                href="/immersion"
                className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Try Virtual Immersion
              </Link>
              <Link
                href="/features"
                className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Explore Features
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Interactive Demo Section */}
        <section className="container space-y-6 py-8 md:py-12 lg:py-24 bg-gradient-to-br from-primary-50 to-amber-50 rounded-2xl mx-4">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <motion.h2 
              className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Try Our Features
            </motion.h2>
            <motion.p 
              className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Experience the power of voice recognition, text-to-speech, and smart translations.
            </motion.p>
          </div>

          <div className="mx-auto max-w-4xl grid gap-8 md:grid-cols-2">
            {/* Voice Recognition Demo */}
            <motion.div
              className="bg-white rounded-xl shadow-lg p-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">🎤 Voice Recognition</h3>
              <p className="text-gray-600 mb-4">
                Try speaking German phrases and see how our advanced speech recognition works.
              </p>
              <VoiceInput
                onTranscript={(transcript, confidence) => {
                  console.log('Transcript:', transcript, 'Confidence:', confidence);
                }}
                placeholder="Say 'Guten Morgen' or 'Wie geht es Ihnen'"
                className="mb-4"
              />
            </motion.div>

            {/* Text-to-Speech Demo */}
            <motion.div
              className="bg-white rounded-xl shadow-lg p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">🔊 Text-to-Speech</h3>
              <p className="text-gray-600 mb-4">
                Listen to German text with natural pronunciation and multiple voice options.
              </p>
              <TextToSpeech
                text="Willkommen bei Deutsch123! Lassen Sie uns gemeinsam Deutsch lernen."
                showControls={true}
                showVoiceSelector={true}
                showSpeedControl={true}
                className="mb-4"
              />
            </motion.div>

            {/* Translation Demo */}
            <motion.div
              className="bg-white rounded-xl shadow-lg p-6 md:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">👁️ Smart Translation Reveal</h3>
              <p className="text-gray-600 mb-4">
                Hover over or click on German phrases to see translations and cultural context:
              </p>
              <div className="space-y-2 text-lg text-center">
                <p>
                  <TranslationReveal germanText="Guten Morgen" />, wie geht es Ihnen heute?
                </p>
                <p>
                  Entschuldigung, können Sie mir helfen? Ich suche nach einem <TranslationReveal germanText="Kaffee und Kuchen" />.
                </p>
                <p>
                  Das ist wirklich <TranslationReveal germanText="Gemütlichkeit" /> hier!
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="container space-y-6 py-8 md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
              Features
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Discover how Deutsch123 revolutionizes language learning through
              innovative features and immersive experiences.
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="relative overflow-hidden rounded-lg border bg-background p-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                  <feature.icon className="h-12 w-12" />
                  <div className="space-y-2">
                    <h3 className="font-bold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Navigation */}
        <nav className="flex flex-wrap justify-center gap-4 mb-12">
          <Link
            href="/features"
            className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors font-medium"
          >
            Phase 1: Core Features
          </Link>
          <Link
            href="/phase2"
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors font-medium"
          >
            Phase 2: Advanced Immersion
          </Link>
          <Link
            href="/phase3"
            className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors font-medium"
          >
            Phase 3: AI & Social Learning
          </Link>
        </nav>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              Built by{' '}
              <a
                href="https://deutsch123.com"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
              >
                Deutsch123
              </a>
              . The source code is available on{' '}
              <a
                href="https://github.com/yourusername/deutsch123"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
              >
                GitHub
              </a>
              .
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

const features = [
  {
    title: 'Voice Conversation',
    description:
      'Practice speaking German with advanced speech recognition and natural text-to-speech technology.',
    icon: function VoiceIcon(props: React.ComponentProps<'svg'>) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          {...props}
        >
          <path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      )
    },
  },
  {
    title: 'Smart Translation',
    description:
      'Get contextual translations and cultural insights when you need them, with progressive difficulty adaptation.',
    icon: function TranslationIcon(props: React.ComponentProps<'svg'>) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          {...props}
        >
          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )
    },
  },
  {
    title: 'Virtual Immersion',
    description:
      'Experience German language and culture through interactive virtual scenarios that simulate real-world situations.',
    icon: function VirtualImmersionIcon(props: React.ComponentProps<'svg'>) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          {...props}
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      )
    },
  },
  {
    title: 'AI Conversation Partners',
    description:
      'Practice speaking with AI-powered conversation partners that adapt to your level and provide instant feedback.',
    icon: function AIConversationIcon(props: React.ComponentProps<'svg'>) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          {...props}
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <path d="M8 10h.01" />
          <path d="M12 10h.01" />
          <path d="M16 10h.01" />
        </svg>
      )
    },
  },
  {
    title: 'Cultural Immersion',
    description:
      'Explore German culture through authentic content, including music, films, news, and interactive cultural scenarios.',
    icon: function CulturalImmersionIcon(props: React.ComponentProps<'svg'>) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          {...props}
        >
          <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" />
          <path d="M12 8v4l3 3" />
        </svg>
      )
    },
  },
  {
    title: 'Progress Tracking',
    description:
      'Monitor your advancement with comprehensive analytics and visual progress indicators that motivate and guide your learning.',
    icon: function ProgressTrackingIcon(props: React.ComponentProps<'svg'>) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          {...props}
        >
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      )
    },
  },
] 