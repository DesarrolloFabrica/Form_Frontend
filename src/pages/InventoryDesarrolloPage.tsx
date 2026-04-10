import { BackButton, PageHeader, SectionWrapper } from '@/components/AppShell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/UiSurfaces';
import { InventoryDesarrollo } from '@/dashboard/InventoryDesarrollo';
import { usePageTitle } from '@/hooks/usePageTitle';
import { ROUTES } from '@/utils/routeHelpers';

export function InventoryDesarrolloPage() {
  usePageTitle('Inventario Desarrollo');

  return (
    <SectionWrapper>
      <BackButton to={ROUTES.DASHBOARD} />
      <PageHeader
        title="Inventario Desarrollo"
        description="Seguimiento de proyectos tecnológicos: plazos, solicitantes y estado operativo."
      />
      <Card>
        <CardHeader>
          <CardTitle>Formulario de proyecto</CardTitle>
          <CardDescription>Alta de proyectos contra el API y listado en tiempo real.</CardDescription>
        </CardHeader>
        <CardContent>
          <InventoryDesarrollo />
        </CardContent>
      </Card>
    </SectionWrapper>
  );
}
