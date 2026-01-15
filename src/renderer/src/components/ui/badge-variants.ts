import { cva } from 'class-variance-authority'

export const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-indigo-600 text-white shadow hover:bg-indigo-500',
        secondary: 'border-transparent bg-slate-800 text-slate-100 hover:bg-slate-700',
        destructive: 'border-transparent bg-red-500 text-white shadow hover:bg-red-500/80',
        outline: 'text-slate-100'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)
