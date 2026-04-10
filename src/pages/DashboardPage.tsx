import { EmptyState } from '@/components/EmptyState';
import { SectionWrapper } from '@/components/SectionWrapper';
import { ItemGrid } from '@/dashboard/ItemGrid';
import { WelcomeBanner } from '@/dashboard/WelcomeBanner';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useRoleNavigation } from '@/hooks/useRoleNavigation';

export function DashboardPage() {
  usePageTitle('Panel principal');
  const { dashboardItems } = useRoleNavigation();

  return (
    <SectionWrapper>
      <WelcomeBanner />
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Tus módulos</h2>
        <p className="text-sm text-muted">Selecciona un inventario para registrar o consultar información.</p>
      </div>
      {dashboardItems.length > 0 ? (
        <ItemGrid items={dashboardItems} />
      ) : (
        <EmptyState
          title="Sin módulos asignados"
          description="Tu rol no tiene vistas de inventario configuradas en esta fase."
        />
      )}
    </SectionWrapper>
  );
}
