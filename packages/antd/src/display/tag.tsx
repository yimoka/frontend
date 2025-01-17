import { IAny } from '@yimoka/shared';
import { Tag as AntTag, GetProps } from 'antd';
import React, { useMemo } from 'react';

import { strToIcon } from '../tools/icon';

export interface TagProps extends GetProps<typeof AntTag> {
  value?: React.ReactNode;
}

const TagFC = (props: TagProps) => {
  const { value, children, closeIcon, icon, ...rest } = props;
  return <AntTag {...rest} closeIcon={strToIcon(closeIcon)} icon={strToIcon(icon)} >{children ?? value}</AntTag>;
};

export interface CheckableTagProps<T = IAny> extends Omit<GetProps<typeof AntTag.CheckableTag>, 'onChange'> {
  value?: T
  values?: { true: T, false: T }
  onChange?: (value: T, checked: boolean,) => void

}

const CheckableTag = (props: CheckableTagProps) => {
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

  return (
    <AntTag.CheckableTag
      {...rest}
      checked={curValue}
      onChange={(checked) => {
        if (onChange) {
          if (values) {
            onChange(checked ? values.true : values.false, checked);
          } else {
            onChange(checked, checked);
          }
        }
      }}
    />
  );
};

export const Tag = Object.assign(TagFC, { CheckableTag });
