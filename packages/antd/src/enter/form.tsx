import { IAny } from '@yimoka/shared';
import { Form as AntForm, GetProps, Row, theme } from 'antd';
import React from 'react';

import { FormLayoutContext, FormLayoutProps } from './form-context';

const { useToken } = theme;

export function Form<T = IAny>(props: FormProps<T>) {
  const { row, col, labelWidth, labelAttached, children, ...rest } = props;
  const token = useToken();

  return (
    <FormLayoutContext.Provider value={{ row, col, labelWidth, labelAttached }}>
      <AntForm {...rest}>
        {!row
          ? children
          : <Row gutter={token.token.padding} {...(row === true ? {} : row)}>{children}</Row>
        }
      </AntForm>
    </FormLayoutContext.Provider>
  );
};

type AntFormProps<T = IAny> = GetProps<typeof AntForm<T>>

export type FormProps<T = IAny> = AntFormProps<T> & FormLayoutProps

