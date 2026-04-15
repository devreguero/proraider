import BuildsClient from './BuildsClient'

export const metadata = {
  title: 'Builds Recomendadas · ProRaider',
  description: 'Las mejores builds del meta actual y las builds de los streamers y creadores más conocidos de ARC Raiders.',
}

export default function BuildsPage() {
  return <BuildsClient />
}
