import { BackButton, PageHeader, SectionWrapper } from '@/components/AppShell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/UiSurfaces';
import { InventoryFabrica } from '@/dashboard/InventoryFabrica';
import { ROUTES } from '@/utils/routeHelpers';

export function InventoryFabricaPage() {
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
          <CardDescription>Los datos se envían al API y el listado se actualiza desde el servidor.</CardDescription>
        </CardHeader>
        <CardContent>
          <InventoryFabrica />
        </CardContent>
      </Card>
    </SectionWrapper>
  );
}
