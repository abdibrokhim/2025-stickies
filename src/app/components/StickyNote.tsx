import { Pin, GripVertical } from 'lucide-react'
import { useState } from 'react'

interface StickyNoteProps {
    goal: {
      content: string
      author: string
      x: number
      y: number
      color: string
    }
    onHover?: (isHovering: boolean) => void
    onDragging?: (isDragging: boolean) => void
  }
  
  export default function StickyNote({ goal, onHover, onDragging }: StickyNoteProps) {
    const [position, setPosition] = useState({ x: goal.x, y: goal.y })
    const [isDragging, setIsDragging] = useState(false)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
      setIsDragging(true)
      onDragging?.(true)
      
      let startX: number, startY: number, initialX: number, initialY: number
      
      if ('touches' in e) {
        startX = e.touches[0].clientX - position.x
        startY = e.touches[0].clientY - position.y
        initialX = e.touches[0].clientX
        initialY = e.touches[0].clientY
      } else {
        startX = e.clientX - position.x
        startY = e.clientY - position.y
        initialX = e.clientX
        initialY = e.clientY
      }

      const handleDrag = (e: MouseEvent | TouchEvent) => {
        let clientX: number, clientY: number
        
        if ('touches' in e) {
          clientX = e.touches[0].clientX
          clientY = e.touches[0].clientY
        } else {
          clientX = e.clientX
          clientY = e.clientY
        }

        setPosition({
          x: clientX - startX,
          y: clientY - startY
        })
        setMousePosition({ x: clientX, y: clientY })
      }

      const handleDragEnd = () => {
        setIsDragging(false)
        onDragging?.(false)
        document.removeEventListener('mousemove', handleDrag)
        document.removeEventListener('mouseup', handleDragEnd)
        document.removeEventListener('touchmove', handleDrag)
        document.removeEventListener('touchend', handleDragEnd)
      }

      document.addEventListener('mousemove', handleDrag)
      document.addEventListener('mouseup', handleDragEnd)
      document.addEventListener('touchmove', handleDrag, { passive: false })
      document.addEventListener('touchend', handleDragEnd)
    }

    return (
      <>
        {isDragging && (
          <div
            style={{
              position: 'fixed',
              left: mousePosition.x + 20,
              top: mousePosition.y - 20,
              pointerEvents: 'none',
              zIndex: 50
            }}
            className="text-xs text-[var(--text-b)]"
          >
            click and hold to drag
          </div>
        )}
        <div 
          className={`absolute w-48 h-32 p-4 rounded-lg shadow-[0_0_10px_rgba(255,255,255,0.25)] transform rotate-2 transition-transform hover:rotate-0 hover:scale-105 cursor-move ${isDragging ? 'scale-105 rotate-0' : ''}`}
          style={{ 
            left: position.x, 
            top: position.y, 
            backgroundColor: goal.color,
            transition: isDragging ? 'none' : 'all 0.2s ease-in-out'
          }}
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          onMouseEnter={() => onHover?.(true)}
          onMouseLeave={() => onHover?.(false)}
        >
          <Pin className="absolute -top-4 -left-4 w-6 h-6 text-[var(--text-c)] z-10 transform -rotate-45" />
          <p className="text-[var(--text-a)] font-medium mb-2">&quot;{goal.content}&quot;</p>
          <p className="text-[var(--text-b)] text-xs italic">- {goal.author}</p>
          <GripVertical className="absolute bottom-2 right-2 w-4 h-4 text-[var(--text-b)] opacity-50" />
        </div>
      </>
    )
  }