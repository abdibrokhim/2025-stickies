import React from 'react'
import { Button } from "../components/ui/button"

interface ColorSelectorProps {
  colors: {
    [key: string]: string[]
  }
  onColorSelect: (color: string) => void
  selectedColor: string
  onCustomColorChange: (color: string) => void
}

const ColorSelector: React.FC<ColorSelectorProps> = ({ colors, onColorSelect, selectedColor, onCustomColorChange }) => {
  return (
    <div className="space-y-4 color-selector">
      <div className="flex flex-wrap gap-6 justify-center">
      {Object.entries(colors).map(([category, colorArray]) => (
        <div key={category} className="space-y-2">
          <h3 className="text-start text-sm font-medium capitalize text-[var(--text-b)]">
            {category.replace(/([A-Z])/g, ' $1').trim()}
          </h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {colorArray.map((color) => (
              <Button
                key={color}
                className="w-8 h-8 rounded-md p-0 border-2 shadow-[0_0_20px_rgba(255,255,255,0.25)]"
                style={{ backgroundColor: color, borderColor: selectedColor === color ? 'white' : color }}
                onClick={() => onColorSelect(color)}
              />
            ))}
          </div>
        </div>
      ))}
      </div>
      <div className="flex justify-center items-center space-x-4">
        <input
          type="color"
          value={selectedColor}
          onChange={(e) => onCustomColorChange(e.target.value)}
          className="w-8 h-8 rounded-md bg-[#e5e5e5] overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.25)]"
        />
        <span className="text-sm font-medium bg-transparent">{selectedColor}</span>
      </div>
    </div>
  )
}

export default ColorSelector

