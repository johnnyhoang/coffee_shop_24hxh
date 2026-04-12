import { DropdownItem, DropdownItemWithGroup } from 'common/types';
import { find, groupBy, map, toLower } from 'lodash';

export const groupDropdownItem = (
  data: DropdownItem[],
): DropdownItemWithGroup[] => {
  const filtered = data.filter((item) => item.label);
  const grouped = groupBy(filtered, (obj) => toLower(obj.label) || 'NEWS');

  return map(grouped, (children, group) => ({
    group:
      find(children, (child) => toLower(child.label) === group)?.label ||
      'NEWS',
    children,
  }));
};

export const removeEmpty = <TQuery>(obj: TQuery) => {
  return Object.entries(obj)
    .filter(([, v]) => v != null && v?.length)
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
};
