import { BackButton } from '@/components/BackButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';
import { SectionWrapper } from '@/components/SectionWrapper';
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
          <CardDescription>Validación con Zod en el cliente; sin llamadas a servidor en esta versión.</CardDescription>
        </CardHeader>
        <CardContent>
          <InventoryDesarrollo />
        </CardContent>
      </Card>
    </SectionWrapper>
  );
}
