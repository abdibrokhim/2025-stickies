import React, { useState } from 'react'
import { Button } from "../components/ui/button"
import { ArrowLeft, ArrowRight } from 'lucide-react'

interface ColorSelectorProps {
  colors: {
    [key: string]: string[]
  }
  onColorSelect: (color: string) => void
  selectedColor: string
  onCustomColorChange: (color: string) => void
}

const ColorSelector: React.FC<ColorSelectorProps> = ({ colors, onColorSelect, selectedColor, onCustomColorChange }) => {
  const [currentPalette, setCurrentPalette] = useState(0)
  const colorCategories = Object.keys(colors)

  const nextPalette = () => {
    setCurrentPalette((prev) => (prev + 1) % colorCategories.length)
  }

  const prevPalette = () => {
    setCurrentPalette((prev) => (prev - 1 + colorCategories.length) % colorCategories.length)
  }

  const currentCategory = colorCategories[currentPalette]
  const currentColors = colors[currentCategory]

  return (
    <div className="space-y-4 color-selector mx-auto">
      <div className="flex items-center justify-between gap-4">
        <Button 
          onClick={prevPalette}
          variant="ghost"
          className="p-2"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>

        <div className="flex-1 overflow-x-auto no-scrollbar">
          <div className="flex flex-col gap-2">
            <h3 className="text-center text-sm font-medium text-[var(--text-a)]">
              {currentCategory.toUpperCase()}
            </h3>
            <div className="flex gap-2 px-2">
              {currentColors.map((color) => (
                <Button
                  key={color}
                  className="w-8 h-8 rounded-md p-0 border-2 flex-shrink-0"
                  style={{ backgroundColor: color, borderColor: selectedColor === color ? 'white' : color }}
                  onClick={() => onColorSelect(color)}
                />
              ))}
            </div>
          </div>
        </div>

        <Button 
          onClick={nextPalette}
          variant="ghost"
          className="p-2"
        >
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex justify-center gap-2">
        {colorCategories.map((category, index) => (
          <div
            key={category}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentPalette ? 'bg-white' : 'bg-gray-500'
            }`}
            onClick={() => setCurrentPalette(index)}
          />
        ))}
      </div>

      <div className="flex justify-center items-center space-x-4">
        <input
          type="color"
          value={selectedColor}
          onChange={(e) => onCustomColorChange(e.target.value)}
          className="w-8 h-8 rounded-md bg-[#e5e5e5] overflow-hidden"
        />
        <span className="text-sm font-medium bg-transparent">{selectedColor}</span>
      </div>
    </div>
  )
}

export default ColorSelector
