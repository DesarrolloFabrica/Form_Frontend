import { BackButton, PageHeader, SectionWrapper } from '@/components/AppShell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/UiSurfaces';
import { InventoryFabrica } from '@/dashboard/InventoryFabrica';
import { usePageTitle } from '@/hooks/usePageTitle';
import { ROUTES } from '@/utils/routeHelpers';

export function InventoryFabricaPage() {
  usePageTitle('Inventario Fábrica');

  return (
    <SectionWrapper>
      <BackButton to={ROUTES.DASHBOARD} />
      <PageHeader
        title="Inventario Fábrica"
        description="Registro estructurado de requisiciones, materiales y entregas asociadas a programas académicos."
      />
      <Card>
        <CardHeader>
          <CardTitle>Formulario de captura</CardTitle>
          <CardDescription>
            Los datos se validan en el navegador. Más adelante podrás enlazar un servidor si lo necesitas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InventoryFabrica />
        </CardContent>
      </Card>
    </SectionWrapper>
  );
}
