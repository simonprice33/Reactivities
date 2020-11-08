import React from 'react';
import { FieldRenderProps } from 'react-final-form';
import { Form, FormFieldProps, Label, Select } from 'semantic-ui-react';

interface IProps
  extends FieldRenderProps<string, HTMLElement>,
    FormFieldProps {}

export const SelectInput: React.FC<IProps> = ({
  input,
  width,
  options,
  placeholder,
  meta: { touched, error },
}) => {
  return (
    <div>
      <Form.Field error={touched && !!error} width={width}>
        <Select
          onChange={(evt, data) => {
            input.onChange(data.value);
          }}
          value={input.value}
          placeholder={placeholder}
          options={options}
        />
        {touched && error && (
          <Label basic color={'red'}>
            {error}
          </Label>
        )}
      </Form.Field>
    </div>
  );
};
