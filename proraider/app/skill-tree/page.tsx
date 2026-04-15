import { Suspense } from 'react'
import SkillTreeBuilder from './SkillTreeBuilder'

export const metadata = {
  title: 'Skill Tree Builder · ProRaider',
  description: 'Planifica tu árbol de habilidades para ARC Raiders antes de entrar al raid.',
}

export default function SkillTreePage() {
  return (
    <Suspense fallback={null}>
      <SkillTreeBuilder />
    </Suspense>
  )
}
