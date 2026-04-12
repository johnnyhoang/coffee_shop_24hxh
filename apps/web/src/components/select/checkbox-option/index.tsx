import { MouseEvent } from 'react';
import { GroupBase, OptionProps, components } from 'react-select';

const CheckboxOption = <
  Option,
  IsMulti extends boolean = true,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(
  props: OptionProps<Option, IsMulti, Group>,
) => {
  const { label, data, isSelected, selectOption, setValue } = props;

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    selectOption({ ...data });
  };
  const handleCheckboxChange = () => {
    setValue(data);
  };
  return (
    <components.Option {...props}>
      <div
        className="flex items-center justify-between gap-2"
        onClick={handleClick}
      >
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleCheckboxChange}
        />
        <div>{label}</div>
      </div>
    </components.Option>
  );
};

export default CheckboxOption;
