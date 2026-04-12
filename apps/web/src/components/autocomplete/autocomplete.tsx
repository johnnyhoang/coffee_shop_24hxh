import Autocomplete, { AutocompleteProps } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { FilterOptionsState } from '@mui/material/useAutocomplete';
import { ForwardedRef, forwardRef } from 'react';
// File: src/components/Header.js

export interface AutoCompleteProps<T>
  extends AutocompleteProps<T, true, false, false> {
  key: string;
  label: string;
  errorMessage?: string;
  getOptionLabel: (option: T) => string;
  filterOptions: (options: T[], state: FilterOptionsState<T>) => T[];
}

export const AutoComplete = forwardRef(
  <T,>(
    {
      key,
      label,
      errorMessage,
      getOptionLabel,
      filterOptions,
      ...props
    }: AutoCompleteProps<T>,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const { disableCloseOnSelect } = props;

    return (
      <div className="group flex flex-col gap-1">
        <Autocomplete
          multiple
          ref={ref}
          {...props}
          id={key}
          disableCloseOnSelect={disableCloseOnSelect ?? true}
          clearOnBlur
          sx={{
            '& .css-wb57ya-MuiFormControl-root-MuiTextField-root': {
              display: 'flex',
              gap: '0.25rem',
            },
            '& .MuiAutocomplete-inputRoot': {
              borderColor: errorMessage
                ? 'rgb(220 38 38 / var(--tw-border-opacity))'
                : 'rgb(209 213 219 / var(--tw-border-opacity))',
              borderWidth: '2px',
              borderRadius: '0.5rem',
              margin: 0,
              '& .MuiAutocomplete-tag': {
                height: 25,
                justifyContent: 'left',
              },
              '& .MuiInput-input': {
                padding: '0.23rem 0.5rem',
                fontSize: '0.875rem',
                lineHeight: '1.25rem',
              },
              '& .MuiAutocomplete-endAdornment': {
                '& .MuiAutocomplete-popupIndicator': {
                  marginRight: '0.25rem',
                  padding: '0.25rem',
                  color: 'rgb(75 85 99 / var(--tw-text-opacity))',
                },
              },
            },
            '& .MuiFormLabel-root': {
              fontSize: '0.875rem',
              lineHeight: '1.25rem',
              fontWeight: 500,
              color: 'rgb(107 114 128 / var(--tw-text-opacity))',
              fontFamily:
                'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
              transform: 'none',
              position: 'inherit',
            },
          }}
          popupIcon={
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
                data-slot="icon"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                ></path>
              </svg>
            </div>
          }
          filterOptions={filterOptions}
          getOptionLabel={getOptionLabel}
          renderInput={(params) => (
            <TextField
              {...params}
              InputProps={{ ...params.InputProps, disableUnderline: true }}
              variant="standard"
              label={label}
            />
          )}
        />
        {errorMessage && (
          <span className="text-sm text-red-600 forced-colors:text-[Mark]">
            {errorMessage}
          </span>
        )}
      </div>
    );
  },
);
