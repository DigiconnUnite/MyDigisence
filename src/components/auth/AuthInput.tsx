import * as React from "react"
import { cn } from "@/lib/utils"
import { Eye, EyeOff, Mail, Phone, User, Lock } from "lucide-react"

interface AuthInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string
  type: 'text' | 'email' | 'password' | 'tel'
  icon?: 'mail' | 'phone' | 'user' | 'lock'
  error?: string
  floatingLabel?: boolean
  onChange?: (value: string) => void
}

const AuthInput = React.forwardRef<HTMLInputElement, AuthInputProps>(
  ({ className, type, label, icon, error, floatingLabel = true, onChange, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const [isFocused, setIsFocused] = React.useState(false)
    const [internalValue, setInternalValue] = React.useState(props.value || '')

    const getIcon = () => {
      switch (icon) {
        case 'mail':
          return <Mail className="h-4 w-4" />
        case 'phone':
          return <Phone className="h-4 w-4" />
        case 'user':
          return <User className="h-4 w-4" />
        case 'lock':
          return <Lock className="h-4 w-4" />
        default:
          return null
      }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setInternalValue(value)
      onChange?.(value)
    }

    return (
      <div className="relative">
        {floatingLabel && (
          <label
            className={cn(
              "absolute left-3 transition-all duration-200 pointer-events-none",
              isFocused || internalValue
                ? "-top-2 text-xs bg-background px-1 text-primary"
                : "top-3 text-sm text-muted-foreground"
            )}
          >
            {label}
          </label>
        )}
        
        <input
          type={type === 'password' && showPassword ? 'text' : type}
          value={internalValue}
          onChange={handleChange}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            icon && "pl-10",
            floatingLabel && "pt-6",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          ref={ref}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {icon && (
          <div className="absolute left-3 top-3 text-muted-foreground">
            {getIcon()}
          </div>
        )}
        
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
        
        {!floatingLabel && (
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </label>
        )}
        
        {error && (
          <p className="text-sm text-destructive mt-1">
            {error}
          </p>
        )}
      </div>
    )
  }
)
AuthInput.displayName = "AuthInput"

export { AuthInput }
