import { BackButton } from '@/components/BackButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';
import { SectionWrapper } from '@/components/SectionWrapper';
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
          <CardDescription>Módulo compartido entre perfiles. Solo front: sin API externa.</CardDescription>
        </CardHeader>
        <CardContent>
          <InventoryLicencias />
        </CardContent>
      </Card>
    </SectionWrapper>
  );
}
