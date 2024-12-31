import { Pin } from 'lucide-react'

interface StickyNoteProps {
    goal: {
      content: string
      author: string
      x: number
      y: number
      color: string
    }
  }
  
  export default function StickyNote({ goal }: StickyNoteProps) {
    return (
      <div 
        className="absolute w-48 h-32 p-4 rounded-lg shadow-[0_0_10px_rgba(255,255,255,0.25)] transform rotate-2 transition-transform hover:rotate-0 hover:scale-105"
        style={{ left: goal.x, top: goal.y, backgroundColor: goal.color }}
      >
        <Pin className="absolute -top-4 -left-4 w-6 h-6 text-[var(--text-c)] z-10 transform -rotate-45" />
        <p className="text-[var(--text-a)] font-medium mb-2">&quot;{goal.content}&quot;</p>
        <p className="text-[var(--text-b)] text-xs italic">- {goal.author}</p>
      </div>
    )
  }
  
  