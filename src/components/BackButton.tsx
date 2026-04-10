import { Button } from '@/components/Button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface BackButtonProps {
  to?: string;
  label?: string;
}

export function BackButton({ to, label = 'Volver' }: BackButtonProps) {
  const navigate = useNavigate();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="-ml-2 px-2 text-muted hover:text-foreground"
      onClick={() => (to ? navigate(to) : navigate(-1))}
    >
      <ArrowLeft className="size-4" />
      {label}
    </Button>
  );
}
