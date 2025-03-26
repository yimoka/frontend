import { QuestionCircleOutlined } from '@ant-design/icons';
import { Field } from '@formily/core';
import { observer, useForm, useField } from '@formily/react';
import { useAdditionalNode, useStore } from '@yimoka/react';
import { IAnyObject, isBlank } from '@yimoka/shared';
import { IStore, ListStore } from '@yimoka/store';
import { Col, ColProps, FormItemProps as AntFormItemProps, FormProps, Row, Form, Tooltip, RowProps } from 'antd';

import { TextProps } from 'antd/lib/typography/Text';
import React, { ReactNode, createContext, isValidElement, useContext, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Text } from '../base/typography';
import { strToIcon } from '../tools/icon';

// 创建一个 from 的上下文 用来记录布局信息
const FormContext = createContext<FormLayoutProps>({});

export const StoreForm = (props: StoreFormProps) => {
  const { fields, store, children, onSubmitCapture, labelWidth, row, col, ...args } = props;
  const curStore = useStore(store);
  const location = useLocation();
  const nav = useNavigate();
  const form = useForm();

  const autoSubmit = (values: never) => {
    onSubmitCapture?.(values);
    form?.submit?.().then(() => {
      const isList = curStore instanceof ListStore;
      if (isList && curStore.isPaginate) {
        curStore.setFieldValue(curStore?.options?.keys?.page, 1);
      }
      curStore?.fetch();
      if (isList && curStore.options.bindRoute) {
        const { pathname, search } = location;
        const valSearch = curStore.genURLSearch();
        if (search !== `?${valSearch}`) {
          nav(`${pathname}?${valSearch}`, { replace: curStore.options.updateRouteType === 'replace' });
        };
      }
    });
  };

  return (
    <FormContext.Provider value={{ row, col, labelWidth }}>
      <Form {...args} onSubmitCapture={autoSubmit}>
        {isBlank(row) ? children : <Row gutter={16} {...(row === true ? {} : row)}>{children}</Row>}
      </Form>
    </FormContext.Provider>
  );
};

export type FormItemProps = AntFormItemProps & Pick<FormLayoutProps, 'col' | 'labelWidth'>;

// eslint-disable-next-line complexity
export const FormItem = observer((props: FormItemProps) => {
  const { required, label, help, validateStatus, extra, col, tooltip, labelWidth, ...args } = props;
  const field = (useField() ?? {}) as Field;
  const curValidateStatus = validateStatus ?? (field.errors?.length > 0 ? 'error' : undefined);
  const curExtra = useAdditionalNode('extra', extra);
  const curHelp = useAdditionalNode('help', help) ?? field.errors?.[0]?.messages?.[0];
  const curLabelText = useAdditionalNode('label', label) ?? field.title;
  const context = useContext(FormContext);
  const curLabelWidth = labelWidth ?? context.labelWidth;

  const curRequired = useMemo(() => ((required ?? field?.required) ? <Text style={{ marginRight: 2 }} type="danger">*</Text> : null), [required, field?.required]);

  const curTooltip = useMemo(() => {
    if (tooltip) {
      const textProps: TextProps = {
        type: 'secondary',
        style: { paddingRight: 2, paddingLeft: 2 },
      };
      if (typeof tooltip === 'object' && !isValidElement(tooltip)) {
        const { icon, ...rest } = tooltip as IAnyObject;
        return <Tooltip {...rest} >{icon ? strToIcon(icon) : <Text {...textProps}><QuestionCircleOutlined /></Text>}</Tooltip >;
      }
      return <Tooltip title={tooltip} ><Text {...textProps}><QuestionCircleOutlined /></Text></Tooltip>;
    }
    return null;
  }, [tooltip]);

  const curLabel = useMemo(() => {
    const node = <>{curRequired} {curLabelText}{curTooltip}</>;
    return curLabelWidth ? <div style={{ width: curLabelWidth }}>{node}</div> : node;
  }, [curRequired, curLabelText, curTooltip, curLabelWidth]);

  const fEl = (
    <Form.Item
      {...args}
      // 为了实现宽度统一在 label 上实现
      extra={curExtra}
      help={curHelp}
      label={curLabel}
      validateStatus={curValidateStatus}
    />);

  // 或者上下文中的 row
  if (isBlank(context.row)) {
    return fEl;
  }
  return <Col {...context.col} {...col} >{fEl}</Col>;
});

export type StoreFormProps = FormProps
  & FormLayoutProps
  & {
    store?: IStore
    children?: ReactNode,
  }

export interface FormLayoutProps {
  row?: Omit<RowProps, 'children'> | true
  col?: Omit<ColProps, 'children'>
  labelWidth?: number
}
