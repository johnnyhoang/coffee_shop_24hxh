import { ChevronDownIcon } from '@heroicons/react/24/outline';
import {
  ComboBox as AriaComboBox,
  ComboBoxProps as AriaComboBoxProps,
  ListBox,
  ListBoxItemProps,
  ValidationResult,
} from 'react-aria-components';
import { ForwardedRef, forwardRef, useEffect, useMemo, useState } from 'react';

import { Button } from 'components/button';
import {
  Description,
  FieldError,
  FieldGroup,
  Input,
  Label,
} from 'components/field';
import {
  DropdownItem,
  DropdownSection,
  DropdownSectionProps,
} from 'components/list-box';
import { Popover } from 'components/popover';
import { composeTailwindRenderProps } from 'utils';
import { v4 as uuidv4 } from 'uuid';

export interface ComboBoxProps extends Omit<AriaComboBoxProps<T>, 'children'> {
  label?: string;
  description?: string | null;
  errorMessage?: string | ((validation: ValidationResult) => string);
  children: React.ReactNode;
  // Add the allowFreeform prop to the type definition
  allowFreeform?: boolean;
}

export const ComboBox = forwardRef(
  (
    {
      // Include the allowFreeform prop in the destructured props
      allowFreeform,
      label,
      description,
      errorMessage,
      children,
      items,
      ...props
    }: ComboBoxProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const triggerBtnGuid: string = useMemo(() => uuidv4(), []);
    const inputGuid: string = useMemo(() => uuidv4(), []);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
      const inputElement = document.getElementById(
        inputGuid,
      ) as HTMLInputElement;
      if (!items || !Array.isArray(items) || items.length === 0 || isMenuOpen) {
        return;
      }
      if (
        !!inputElement?.value &&
        Array.from(items).length > 0 &&
        !isMenuOpen
      ) {
        setTimeout(() => {
          const btn = document.getElementById(triggerBtnGuid) as HTMLElement;
          btn.click();
        }, 0);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items]);

    const handleBtnFocus = (event: boolean) => {
      if (isMenuOpen !== event) {
        setIsMenuOpen(event);
      }
    };

    return (
      <AriaComboBox
        ref={ref}
        {...props}
        className={composeTailwindRenderProps(
          props.className,
          'group flex flex-col gap-1',
        )}
        onOpenChange={($event) => handleBtnFocus($event)}
      >
        <Label>{label}</Label>
        <FieldGroup>
          <Input
            style={{
              textOverflow: 'ellipsis',
              textAlign: 'left',
              color: 'black',
              cursor: 'text',
            }}
            // disabled={allowFreeform}
            dir="ltr"
            id={inputGuid}
          />
          <Button
            variant="icon"
            className="w-6 mr-1 rounded outline-offset-0"
            id={triggerBtnGuid}
          >
            <ChevronDownIcon aria-hidden className="w-4 h-4" />
          </Button>
        </FieldGroup>
        {description && <Description>{description}</Description>}
        <FieldError>{errorMessage}</FieldError>
        <Popover>
          <ListBox
            items={items}
            className="outline-0 p-1 max-h-[inherit] overflow-auto [clip-path:inset(0_0_0_0_round_.75rem)]"
          >
            {children}
          </ListBox>
        </Popover>
      </AriaComboBox>
    );
  },
);

export const ComboBoxItem = (props: ListBoxItemProps) => {
  return <DropdownItem {...props} />;
};

export const ComboBoxSection = <T extends object>(
  props: DropdownSectionProps<T>,
) => {
  return <DropdownSection {...props} />;
};
