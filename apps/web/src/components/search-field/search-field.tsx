import {
  SearchField as AriaSearchField,
  SearchFieldProps as AriaSearchFieldProps,
} from 'react-aria-components';
import { XMarkIcon } from '@heroicons/react/24/outline';

import { composeTailwindRenderProps } from 'utils/tailwind-utils';

import { Button } from 'components/button';
import { Input, Label, FieldGroup } from 'components/field';

export interface SearchFieldProps extends AriaSearchFieldProps {
  label?: string;
  placeholder?: string;
  title?: string;
}

export function SearchField({
  label,
  className,
  placeholder = 'input search text',
  title,
  ...rest
}: SearchFieldProps) {
  return (
    <AriaSearchField
      {...rest}
      className={composeTailwindRenderProps(
        className,
        'group flex items-center gap-1 min-w-[40px] max-w-[200px]',
      )}
    >
      {label && <Label>{label}</Label>}
      <FieldGroup>
        <Input
          className="[&::-webkit-search-cancel-button]:hidden"
          placeholder={placeholder}
          title={title}
        />
        <Button variant="icon" className="mr-1 w-6 group-empty:invisible">
          <XMarkIcon aria-hidden className="w-4 h-4" />
        </Button>
      </FieldGroup>
    </AriaSearchField>
  );
}
