"use client"

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Label } from "../components/ui/label"
import { Loader2 } from 'lucide-react'
import ColorSelector from './ColorSelector'

interface Goal {
  id: number;
  content: string;
  author: string;
  x: number;
  y: number;
  color: string;
}

interface InputModalProps {
  isOpen: boolean
  onClose: () => void
  position: { x: number; y: number }
  addGoal: (newGoal: Omit<Goal, 'id'>) => Promise<void>
}

interface ColorMap {
    [key: string]: string[]
}

const popularColors: ColorMap = {
    calming: [
      '#FFFCF9',
      '#F4F1DE',
      '#E9C46A',
      '#264653',
      '#2A9D8F'
    ],
    vibe50s: [
      '#b73838',
      '#ddd3bc',
      '#322c2c',
      '#5a8696',
      '#e4b854'
    ],
    aethestetic: [
      '#66545e',
      '#a39193',
      '#aa6f73',
      '#eea990',
      '#f6e0b5'
    ],
    cyberpunk: [
      '#00010D',
      '#010326',
      '#2D0140',
      '#660273',
      '#A305A6'
    ]
}

export default function InputModal({ isOpen, onClose, position, addGoal }: InputModalProps) {
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedColor, setSelectedColor] = useState('#00010D')
  const queryClient = useQueryClient()

  const handleColorSelect = (color: string) => {
    setSelectedColor(color)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const newGoal = {
      content,
      author: author || 'Anonymous',
      x: position.x,
      y: position.y,
      color: selectedColor
    }
    await addGoal(newGoal)
    setIsSubmitting(false)
    onClose()
    setContent('')
    setAuthor('')
    setSelectedColor('#00010D')
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isSubmitting && onClose()}>
      <DialogContent 
        className="sm:max-w-[700px] min-h-[600px]"
        style={{ backgroundColor: selectedColor }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add yours to Open Notes</DialogTitle>
        </DialogHeader>
        <ColorSelector 
          colors={popularColors}
          onColorSelect={handleColorSelect}
          selectedColor={selectedColor}
          onCustomColorChange={handleColorSelect}
        />
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="goal">
                Quote
              </Label>
              <p className='text-xs text-[var(--text-b)]'>It can be as simply as: &quot;just make things&quot; or &quot;i forgot to turn off the stove&quot; or &quot;i must at least try, why not?&quot;</p>
              <Textarea
                id="goal"
                value={content}
                onChange={(e) => setContent(e.target.value.slice(0, 50))}
                className="w-full resize-none overflow-y-scroll no-scrollbar placeholder:text-[var(--text-c)] placeholder:text-xs placeholder:sm:text-sm"
                placeholder="Enter your quote (max 50 chars)."
                required
                maxLength={50}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">
                Name
              </Label>
              <p className='text-xs text-[var(--text-b)]'>You can also enter your nickname or a pseudonym, you're well-known on the internet.</p>
              <Input
                id="name"
                value={author}
                onChange={(e) => setAuthor(e.target.value.slice(0, 50))}
                className="w-full placeholder:text-[var(--text-c)] placeholder:text-xs placeholder:sm:text-sm"
                placeholder="Your name (max 50 chars, or leave blank to stay anonymous)."
                maxLength={50}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
                type="submit" 
                variant="default"
                disabled={isSubmitting} 
                className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Now'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
