import { observer } from '@formily/react';
import { PropsWithComponentData, useArrayStringTransform, useComponentData, useSplitter } from '@yimoka/react';
import { IAny } from '@yimoka/shared';
import { Checkbox as AntCheckbox, CheckboxProps as AntCheckboxProps } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import React, { ComponentProps, useMemo } from 'react';

export interface CheckboxProps<T = IAny> extends Omit<AntCheckboxProps, 'onChange'> {
  values?: { true: T, false: T }
  onChange?: (value: T, e: CheckboxChangeEvent) => void
}

const CheckboxFC = <T extends IAny = IAny>(props: CheckboxProps<T>) => {
  const { checked, value, values, onChange, ...rest } = props;
  const curValue = useMemo(() => {
    if (checked !== undefined) {
      return checked;
    }
    if (value !== undefined) {
      if (values) {
        return value === values.true;
      }
      return value;
    }
    return undefined;
  }, [checked, value, values]);

  const newProps: CheckboxProps<T> = { ...rest };
  if (curValue !== undefined) {
    newProps.checked = curValue;
  }
  if (value !== undefined) {
    newProps.value = value;
  }

  return (
    <AntCheckbox
      {...newProps}
      onChange={(e) => {
        const { checked } = e.target;
        if (values) {
          onChange?.(checked ? values.true : values.false, e);
        } else {
          onChange?.(checked as T, e);
        }
      }} />
  );
};

export type CheckboxGroupOptions<T = IAny> = CheckboxGroupProps<T>['options']
export type CheckboxGroupProps<T = IAny> = PropsWithComponentData<Omit<ComponentProps<typeof AntCheckbox.Group<T>>, 'onChange'> & {
  onChange?: (v: string | CheckboxGroupOptions<T> | Array<string | number>) => void,
  valueType?: 'string' | 'array'
  splitter?: string
}>;

const GroupFn = <T extends IAny = IAny>(props: CheckboxGroupProps<T>) => {
  const { options, data, store, dataKey, valueType, value, splitter, onChange, ...rest } = props;
  const curData = useComponentData([options, data], dataKey, store);
  const curSplitter = useSplitter(splitter);
  const curValue = useArrayStringTransform(value, curSplitter);

  const newProps: CheckboxGroupProps<T> = { ...rest };
  if (value !== undefined) {
    newProps.value = curValue;
  }

  return (
    <AntCheckbox.Group<T>
      {...newProps}
      options={curData}
      onChange={(v) => {
        if (valueType === 'string') {
          onChange?.(v.join(splitter));
        } else {
          onChange?.(v as IAny[]);
        }
      }}
    />
  );
};

export const CheckboxGroup = observer(GroupFn);

type ICheckboxFC = typeof CheckboxFC & {
  Group: typeof CheckboxGroup
};

export const Checkbox = CheckboxFC as ICheckboxFC;

Checkbox.Group = CheckboxGroup;
