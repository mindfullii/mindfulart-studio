import { Card, CardContent } from '@/components/ui/Card'
import Image from 'next/image'

interface StyleCardProps {
  id: string
  name: string
  description: string
  examples: string[]
  artists: string[]
  isSelected: boolean
  onClick: () => void
}

export function StyleCard({
  id,
  name,
  description,
  examples,
  artists,
  isSelected,
  onClick,
}: StyleCardProps) {
  return (
    <Card 
      className={`cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2">{name}</h3>
        <p className="text-sm text-gray-600 mb-2">{description}</p>
        <div className="text-xs text-gray-500">
          <p>Examples: {examples.join(', ')}</p>
          <p>Artists: {artists.join(', ')}</p>
        </div>
      </CardContent>
    </Card>
  )
} 