"use client"

import { useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import StickyNote from './StickyNote'
import { Loader2 } from 'lucide-react'
import InputModal from './InputModal';

interface Goal {
  id: string
  content: string
  author: string
  x: number
  y: number
  color: string
}

interface InfiniteCanvasProps {
  onCanvasClick: (x: number, y: number) => void
}
  
const fetchGoals = async (): Promise<Goal[]> => {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
  
  if (error) throw error
  return data || []
}

export default function InfiniteCanvas({ onCanvasClick }: InfiniteCanvasProps) {
  const queryClient = useQueryClient()
  const [goals, setGoals] = useState<Goal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clickPosition, setClickPosition] = useState<{ x: number; y: number } | null>(null);

  const loadGoals = async () => {
    try {
      const { data, error } = await supabase.from('goals').select('*')
      if (error) throw error
      console.log('All Data: ', data);
      setGoals(data || [])
    } catch (e) {
      setError(e as Error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadGoals()
  }, [])

  const addGoal = async (newGoal: Omit<Goal, 'id'>) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('goals')
        .insert([newGoal])
        .single()
    
      if (error) throw error
      await loadGoals() // Refetch all goals after adding new one
    } catch (e) {
      console.error('Error adding goal:', e)
      setIsLoading(false)
    }
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setClickPosition({x,y});
    setIsModalOpen(true);
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-100px)]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return <div>Error loading goals: {error.message}</div>
  }

  return (
    <>
    <div 
      className="w-full h-[calc(100vh-0px)] overflow-auto bg-transparent cursor-pointer"
      onClick={handleCanvasClick}
    >
      <div className="relative w-[100%] h-[100%]">
        {goals?.map((goal) => (
          <StickyNote key={goal?.id || Math.random()} goal={goal} />
        ))}
      </div>
    </div>
    <InputModal 
      isOpen={isModalOpen} 
      onClose={() => setIsModalOpen(false)}
      position={clickPosition!}
      addGoal={addGoal}
    />
    </>
  )
}
