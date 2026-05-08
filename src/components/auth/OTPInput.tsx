import * as React from "react"
import { cn } from "@/lib/utils"

interface OTPInputProps {
  length?: number
  onComplete: (value: string) => void
  autoFocus?: boolean
  disabled?: boolean
}

const OTPInput = React.forwardRef<HTMLDivElement, OTPInputProps>(
  ({ length = 6, onComplete, autoFocus = false, disabled = false }, ref) => {
    const [values, setValues] = React.useState<string[]>(Array(length).fill(''))
    const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])

    React.useEffect(() => {
      if (autoFocus && inputRefs.current[0]) {
        inputRefs.current[0]?.focus()
      }
    }, [autoFocus])

    const handleChange = (index: number, value: string) => {
      // Only allow single digit
      if (value.length > 1) return
      
      const newValues = [...values]
      newValues[index] = value
      setValues(newValues)

      // Auto-focus next input
      if (value && index < length - 1) {
        inputRefs.current[index + 1]?.focus()
      }

      // Check if all inputs are filled
      if (newValues.every(val => val.length === 1)) {
        onComplete(newValues.join(''))
      }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' && !values[index] && index > 0) {
        // Move to previous input if current is empty
        inputRefs.current[index - 1]?.focus()
      } else if (e.key === 'Backspace' && values[index]) {
        // Clear current and move to previous
        const newValues = [...values]
        newValues[index] = ''
        setValues(newValues)
        inputRefs.current[index - 1]?.focus()
      } else if (e.key === 'ArrowLeft' && index > 0) {
        inputRefs.current[index - 1]?.focus()
      } else if (e.key === 'ArrowRight' && index < length - 1) {
        inputRefs.current[index + 1]?.focus()
      }
    }

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault()
      const pastedData = e.clipboardData.getData('text').slice(0, length)
      
      if (/^\d+$/.test(pastedData)) {
        const newValues = pastedData.split('')
        setValues(newValues)
        
        // Focus last filled input
        const lastFilledIndex = Math.min(pastedData.length - 1, length - 1)
        inputRefs.current[lastFilledIndex]?.focus()
        
        if (pastedData.length === length) {
          onComplete(pastedData)
        }
      }
    }

    return (
      <div ref={ref} className="flex gap-2">
        {Array.from({ length }, (_, index) => (
          <input
            key={index}
            ref={el => {
      inputRefs.current[index] = el
    }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={values[index]}
            onChange={e => handleChange(index, e.target.value)}
            onKeyDown={e => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={disabled}
            className={cn(
              "w-12 h-12 text-center text-lg font-semibold border rounded-md",
              "border-input bg-background text-foreground",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "transition-all duration-200"
            )}
          />
        ))}
      </div>
    )
  }
)

OTPInput.displayName = "OTPInput"

export { OTPInput }
