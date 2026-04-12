import get from 'lodash/get';
import { ReactNode } from 'react';
import { components, GroupBase, ValueContainerProps } from 'react-select';

const ValueContainer = <
  Option,
  IsMulti extends boolean = boolean,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(
  props: ValueContainerProps<Option, IsMulti, Group>,
) => {
  const { children, hasValue, getValue } = props;
  const [, input] = children as ReactNode[];
  const selectedOptions = getValue();

  if (hasValue) {
    const multiValueLabel = selectedOptions.map((option) =>
      get(option, 'label'),
    );

    return (
      <components.ValueContainer {...props}>
        <div className="row-start-1 col-start-1 row-end-2 col-end-3 truncate">
          {multiValueLabel.join(', ')}
        </div>
        {input}
      </components.ValueContainer>
    );
  }

  return (
    <components.ValueContainer {...props}>{children}</components.ValueContainer>
  );
};

export default ValueContainer;
