import { InventoryEntryCard } from '@/dashboard/InventoryEntryCard';
import type { DashboardNavItem } from '@/models';

export interface ItemGridProps {
  items: DashboardNavItem[];
}

export function ItemGrid({ items }: ItemGridProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {items.map((item, index) => (
        <InventoryEntryCard key={item.id} item={item} index={index} />
      ))}
    </div>
  );
}
