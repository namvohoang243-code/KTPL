import { CtaBand } from '@/components/home/CtaBand'
import { DiscoverSection } from '@/components/home/DiscoverSection'
import { Hero } from '@/components/home/Hero'
import { HowItWorksTimeline } from '@/components/home/HowItWorksTimeline'
import { PersonalityExplorer } from '@/components/home/PersonalityExplorer'

export function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorksTimeline />
      <PersonalityExplorer />
      <DiscoverSection />
      <CtaBand />
    </>
  )
}
