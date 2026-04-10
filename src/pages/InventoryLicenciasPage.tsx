import { BackButton, PageHeader, SectionWrapper } from '@/components/AppShell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/UiSurfaces';
import { InventoryLicencias } from '@/dashboard/InventoryLicencias';
import { usePageTitle } from '@/hooks/usePageTitle';
import { ROUTES } from '@/utils/routeHelpers';

export function InventoryLicenciasPage() {
  usePageTitle('Inventario Licencias');

  return (
    <SectionWrapper>
      <BackButton to={ROUTES.DASHBOARD} />
      <PageHeader
        title="Inventario Licencias"
        description="Control centralizado de licencias de software: vigencias, costos y responsables."
      />
      <Card>
        <CardHeader>
          <CardTitle>Formulario de licencia</CardTitle>
          <CardDescription>Módulo compartido entre perfiles; conectado al API corporativo.</CardDescription>
        </CardHeader>
        <CardContent>
          <InventoryLicencias />
        </CardContent>
      </Card>
    </SectionWrapper>
  );
}
