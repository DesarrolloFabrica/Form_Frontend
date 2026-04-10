import { cn } from '@/lib/utils';
import { CalendarDays, Clock } from 'lucide-react';
import {
  forwardRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';

/* —— Button —— */
const buttonVariants = {
  primary:
    'bg-accent text-white shadow-sm hover:bg-accent-hover focus-visible:ring-2 focus-visible:ring-accent/40',
  secondary:
    'border border-border/90 bg-surface-elevated text-foreground shadow-sm shadow-slate-900/4 hover:bg-surface focus-visible:ring-2 focus-visible:ring-accent/30 dark:shadow-black/20',
  ghost: 'text-muted hover:text-foreground hover:bg-surface-elevated/80',
  danger: 'bg-red-600/90 text-white hover:bg-red-600 focus-visible:ring-2 focus-visible:ring-red-400/40',
} as const;

const buttonSizes = {
  sm: 'h-9 px-3 text-sm rounded-lg',
  md: 'h-11 px-4 text-sm rounded-lg',
  lg: 'h-12 px-6 text-base rounded-xl',
} as const;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading,
      disabled,
      children,
      type = 'button',
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled ?? isLoading}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
          buttonVariants[variant],
          buttonSizes[size],
          className,
        )}
        {...props}
      >
        {isLoading ? (
          <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

/* —— Input —— */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, hint, error, id, type, ...props }, ref) => {
    const inputId = id ?? props.name;

    const isTime = type === 'time';
    const isDateLike =
      type === 'date' ||
      type === 'datetime-local' ||
      type === 'month' ||
      type === 'week';
    const useNativePickerShell = isDateLike || isTime;
    const PickerIcon = isTime ? Clock : CalendarDays;

    const inputClassName = cn(
      'h-11 w-full rounded-lg border bg-surface px-3 text-sm text-foreground transition-colors placeholder:text-muted',
      'shadow-[0_1px_2px_rgb(15_23_42/0.05),inset_0_1px_0_0_rgb(255_255_255/0.85)] dark:shadow-[inset_0_2px_4px_rgb(0_0_0/0.25)]',
      'border-border/90 focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/25',
      error && 'border-danger focus-visible:border-danger focus-visible:ring-danger/25',
      useNativePickerShell && 'date-input-shell dark:pr-10',
      className,
    );

    const control = (
      <input
        ref={ref}
        id={inputId}
        type={type}
        className={inputClassName}
        {...props}
      />
    );

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label ? (
          <label htmlFor={inputId} className="text-sm font-medium text-foreground/90">
            {label}
          </label>
        ) : null}
        {useNativePickerShell ? (
          <div className="relative w-full">
            {control}
            <PickerIcon
              className="pointer-events-none absolute right-3 top-1/2 hidden size-4.5 -translate-y-1/2 text-muted dark:block"
              aria-hidden
              strokeWidth={1.75}
            />
          </div>
        ) : (
          control
        )}
        {error ? <p className="text-xs text-danger">{error}</p> : null}
        {!error && hint ? <p className="text-xs text-muted">{hint}</p> : null}
      </div>
    );
  },
);

Input.displayName = 'Input';

/* —— Textarea —— */
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, hint, error, id, ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label ? (
          <label htmlFor={inputId} className="text-sm font-medium text-foreground/90">
            {label}
          </label>
        ) : null}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            'min-h-[120px] w-full resize-y rounded-lg border bg-surface px-3 py-2.5 text-sm text-foreground transition-colors placeholder:text-muted',
            'shadow-[0_1px_2px_rgb(15_23_42/0.05),inset_0_1px_0_0_rgb(255_255_255/0.85)] dark:shadow-[inset_0_2px_4px_rgb(0_0_0/0.25)]',
            'border-border/90 focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/25',
            error && 'border-danger focus-visible:border-danger focus-visible:ring-danger/25',
            className,
          )}
          {...props}
        />
        {error ? <p className="text-xs text-danger">{error}</p> : null}
        {!error && hint ? <p className="text-xs text-muted">{hint}</p> : null}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';

/* —— Select —— */
export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, hint, error, id, options, placeholder, ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label ? (
          <label htmlFor={inputId} className="text-sm font-medium text-foreground/90">
            {label}
          </label>
        ) : null}
        <div className="relative">
          <select
            ref={ref}
            id={inputId}
            className={cn(
              'h-11 w-full appearance-none rounded-lg border bg-surface px-3 pr-10 text-sm text-foreground transition-colors',
              'shadow-[0_1px_2px_rgb(15_23_42/0.05),inset_0_1px_0_0_rgb(255_255_255/0.85)] dark:shadow-[inset_0_2px_4px_rgb(0_0_0/0.25)]',
              'border-border/90 focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/25',
              error && 'border-danger focus-visible:border-danger focus-visible:ring-danger/25',
              className,
            )}
            {...props}
          >
            {placeholder ? (
              <option value="" disabled>
                {placeholder}
              </option>
            ) : null}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted">▾</span>
        </div>
        {error ? <p className="text-xs text-danger">{error}</p> : null}
        {!error && hint ? <p className="text-xs text-muted">{hint}</p> : null}
      </div>
    );
  },
);

Select.displayName = 'Select';

/* —— Badge —— */
const badgeVariants = {
  default: 'bg-surface-elevated text-foreground border border-border',
  accent:
    'border border-blue-200 bg-blue-100 text-blue-950 dark:border-accent/30 dark:bg-accent/15 dark:text-blue-200',
  success:
    'border border-emerald-200 bg-emerald-100 text-emerald-950 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-200',
  warning:
    'border border-amber-200 bg-amber-100 text-amber-950 dark:border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-100',
} as const;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof badgeVariants;
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
        badgeVariants[variant],
        className,
      )}
      {...props}
    />
  );
}

/* —— StatusChip —— */
const toneMap = {
  neutral: 'bg-surface-elevated text-foreground border-border',
  info: 'bg-blue-500/15 text-blue-100 border-blue-500/35',
  success: 'bg-emerald-500/15 text-emerald-100 border-emerald-500/35',
  warning: 'bg-amber-500/15 text-amber-100 border-amber-500/35',
  danger: 'bg-red-500/15 text-red-100 border-red-500/35',
} as const;

export interface StatusChipProps {
  label: string;
  tone?: keyof typeof toneMap;
  className?: string;
}

export function StatusChip({ label, tone = 'neutral', className }: StatusChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        toneMap[tone],
        className,
      )}
    >
      {label}
    </span>
  );
}
