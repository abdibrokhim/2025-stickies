"use client"

import { useState, useEffect } from 'react'
import InfiniteCanvas from './components/InfiniteCanvas'
import InputModal from './components/InputModal'
import { supabase } from './lib/supabase'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Header from './components/Header'

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 })
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleCanvasClick = (x: number, y: number) => {
    setClickPosition({ x, y })
    setIsModalOpen(true)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

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
        <Header />
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
          click anywhere to add yours
        </div>
      </div>
    </QueryClientProvider>
  )
}
