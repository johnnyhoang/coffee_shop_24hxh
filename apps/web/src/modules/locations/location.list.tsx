import { Column, RowMouseEventHandlerParams } from 'react-virtualized';

import { LOCATION_COLUMNS } from './location.type';

import { useToggle } from 'hooks/use-toggle';
import { LocationModal } from './location.modal';
import {
  defaultBodyCell,
  defaultHeaderCell,
  VirtualizationTable,
} from 'components/virtualization-table';

import { TLocation } from './location.type';
import { useState } from 'react';
import { ActionType } from 'types';


export const LocationList = ({ locations }: { locations: TLocation[] }) => {
  const [isModalOpen, toggle] = useToggle();
  const [selectedLocation, setSelectedLocation] = useState<TLocation>(null);
  const handleRowClick = (info: RowMouseEventHandlerParams) => {
    setSelectedLocation(info.rowData);
    toggle();
  };

  return (
    <div className="min-h-0 overflow-auto">
      <VirtualizationTable<TLocation>
        dataSource={locations}
        onRowClick={handleRowClick}
        headerClassName="border-r border-cream-200/60 last:border-r-0"
      >
        {LOCATION_COLUMNS.map(({ key, label, width }) => (
          <Column
            key={key}
            label={label}
            dataKey={key}
            width={width}
            headerRenderer={defaultHeaderCell}
            cellRenderer={defaultBodyCell}
          />
        ))}
      </VirtualizationTable>


      <LocationModal
        isOpen={isModalOpen}
        actionType={ActionType.Edit}
        onOpenChange={toggle}
        title="Sửa chi nhánh"
        location={selectedLocation}
      />
    </div>
  );
};
