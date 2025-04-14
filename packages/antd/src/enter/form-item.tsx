import { QuestionCircleOutlined } from '@ant-design/icons';
import { Field } from '@formily/core';
import { observer, useField } from '@formily/react';
import { getTooltipProps, RenderAny, useAdditionalNode } from '@yimoka/react';
import { IAny, isVacuous } from '@yimoka/shared';
import { IField, IStore } from '@yimoka/store';
import { Form as AntForm, GetProps, Space, Button, Col } from 'antd';
import React, { useContext, useMemo } from 'react';

import { Text } from '../base/typography';
import { Tooltip } from '../display/tooltip';

import { FormLayoutContext, FormLayoutProps } from './form-context';

function FormItemFn<T = IAny>(props: FormItemProps<T>) {
  const {
    col, labelWidth, labelAttached, validateStatus, tooltip, children,
    extra, help, label, required, store, name,
    ...rest } = props;
  const field = (useField() ?? {}) as Field;
  const curExtra = useAdditionalNode('extra', extra);
  const curHelp = useAdditionalNode('help', help) ?? field.errors?.[0]?.messages?.[0];
  const curLabelText = useAdditionalNode('label', label) ?? field.title;
  const context = useContext(FormLayoutContext);
  const curLabelAttached = useMemo(() => labelAttached ?? context.labelAttached, [labelAttached, context.labelAttached]);
  const curCol = useMemo(() => col ?? context.col, [col, context.col]);
  const curLabelWidth = useMemo(() => labelWidth ?? context.labelWidth, [labelWidth, context.labelWidth]);
  const curRequired = useMemo(() => ((required ?? field.required) ? <Text type="danger">*</Text> : null), [required, field.required]);
  const curValidateStatus = useMemo(() => validateStatus ?? (field.errors?.length > 0 ? 'error' : undefined), [validateStatus, field.errors]);

  const curTooltip = useMemo(() => {
    const curTooltip = getTooltipProps(tooltip, (name ? name : field.props.name) as IField, store);
    if (isVacuous(curTooltip)) {
      return undefined;
    }
    return <Text type="secondary"><Tooltip icon={<QuestionCircleOutlined />} {...curTooltip} /></Text>;
  }, [tooltip, name, field.props.name, store]);

  const curLabel = useMemo(() => {
    const arr = [curRequired, curLabelText, curTooltip]?.filter(Boolean);
    if (arr.length === 0) {
      return null;
    }
    if (arr.length === 1) {
      return arr[0];
    }
    return <Space>{arr.map((item, index) => <React.Fragment key={index}>{item}</React.Fragment>)} </Space>;
  }, [curRequired, curLabelText, curTooltip]);

  const curProps = useMemo<Partial<AntFormItemProps>>(() => {
    if (!curLabelAttached && !curLabelWidth) {
      return {
        label: curLabelText,
        tooltip: tooltip ? tooltip : undefined,
        required: required ?? field.required,
        children,
      };
    }

    if (!curLabel) {
      return { children };
    }

    if (curLabelAttached) {
      return {
        childre: (
          <Space.Compact style={{ width: '100%' }}>
            <Button style={{ cursor: 'default', color: 'inherit' }}>
              {curLabel}
            </Button>
            <RenderAny value={children} />
          </Space.Compact>
        ),
      };
    }

    return {
      label: curLabelWidth ? <div style={{ width: curLabelWidth }}>{curLabel}</div> : curLabel,
      children,
    };
  }, [children, curLabel, curLabelAttached, curLabelText, curLabelWidth, field.required, required, tooltip]);

  const fEl = useMemo(() => (
    <AntForm.Item
      {...rest}
      {...curProps}
      extra={curExtra}
      help={curHelp}
      validateStatus={curValidateStatus}
    />
  ), [curProps, curExtra, curHelp, curValidateStatus, rest]);

  if (isVacuous(context.row)) {
    return fEl;
  }

  return <Col {...curCol} >{fEl}</Col>;
};

export const FormItem = observer(FormItemFn);

type AntFormItemProps<T = IAny> = GetProps<typeof AntForm.Item<T>>

export type FormItemProps<T = IAny> = AntFormItemProps<T> & Pick<FormLayoutProps, 'col' | 'labelWidth' | 'labelAttached'> & { store?: IStore, tooltip?: false }
