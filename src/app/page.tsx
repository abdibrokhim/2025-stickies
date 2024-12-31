"use client"

import { useState } from 'react'
import InfiniteCanvas from './components/InfiniteCanvas'
import InputModal from './components/InputModal'
import { supabase } from './lib/supabase'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 })

  const handleCanvasClick = (x: number, y: number) => {
    setClickPosition({ x, y })
    setIsModalOpen(true)
  }

  const queryClient = new QueryClient(
    {
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          retry: false,
        },
      },
    }
  )

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen">
        <InfiniteCanvas onCanvasClick={handleCanvasClick} />
        <InputModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          position={clickPosition}
          addGoal={async (newGoal) => {
            // You might want to add error handling here
            await supabase.from('goals').insert([newGoal]).single()
          }}
        />
      </div>
    </QueryClientProvider>
  )
}

