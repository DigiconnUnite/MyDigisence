import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'google'
  loading?: boolean
  fullWidth?: boolean
  icon?: React.ReactNode
  asChild?: boolean
}

const AuthButton = React.forwardRef<HTMLButtonElement, AuthButtonProps>(
  ({ className, variant = 'primary', loading = false, fullWidth = false, icon, children, disabled, asChild = false, ...props }, ref) => {
    const getVariantClasses = () => {
      switch (variant) {
        case 'primary':
          return "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90"
        case 'secondary':
          return "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80"
        case 'outline':
          return "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground"
        case 'google':
          return "bg-white text-gray-700 border border-gray-300 shadow-xs hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
        default:
          return "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90"
      }
    }

    const Comp = asChild ? "span" : Button

    return (
      <Comp
        ref={ref}
        className={cn(
          "relative transition-all duration-200",
          getVariantClasses(),
          fullWidth && "w-full",
          loading && "opacity-70",
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        )}
        
        <div className={cn("flex items-center justify-center gap-2", loading && "opacity-0")}>
          {icon}
          {children}
        </div>
      </Comp>
    )
  }
)

AuthButton.displayName = "AuthButton"

export { AuthButton }
