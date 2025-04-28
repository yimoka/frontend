import { PropsWithComponentData, useAdditionalNode, useComponentData, useSplitter, useStore } from '@yimoka/react';
import { IAny, strToArr } from '@yimoka/shared';
import { Select as AntSelect, SelectProps as AntSelectProps } from 'antd';
import React, { useMemo } from 'react';

import { handleAllowClear, strToIcon } from '../tools/icon';

export const Select = (props: SelectProps) => {
  const {
    store, data, dataKey, options,
    mode, splitter, value, valueType, onChange,
    notFoundContent, maxTagPlaceholder, prefix, allowClear, suffixIcon, menuItemSelectedIcon, removeIcon,
    ...rest
  } = props;

  const curNotFoundContent = useAdditionalNode('notFoundContent', notFoundContent);
  const curMaxTagPlaceholder = useAdditionalNode('maxTagPlaceholder', maxTagPlaceholder);
  const curMenuItemSelectedIcon = useAdditionalNode('menuItemSelectedIcon', menuItemSelectedIcon);
  const curPrefix = useAdditionalNode('prefix', prefix);
  const curStore = useStore(store);
  const curOptions = useComponentData([options, data], dataKey, curStore);
  const curSplitter = useSplitter(splitter);

  const curValue = useMemo(() => {
    if (mode && ['multiple', 'tags'].includes(mode) && typeof value === 'string') {
      return strToArr(value, curSplitter);
    }
    return value;
  }, [mode, curSplitter, value]);

  const handleChange: AntSelectProps['onChange'] = (value, selectedOptions) => {
    if (valueType === 'string' && Array.isArray(value)) {
      onChange?.(value.join(curSplitter), selectedOptions);
    } else {
      onChange?.(value, selectedOptions);
    }
  };

  return (
    <AntSelect
      {...rest}
      allowClear={handleAllowClear(allowClear)}
      maxTagPlaceholder={curMaxTagPlaceholder}
      menuItemSelectedIcon={curMenuItemSelectedIcon}
      mode={mode}
      notFoundContent={curNotFoundContent}
      options={curOptions}
      prefix={curPrefix}
      removeIcon={strToIcon(removeIcon)}
      suffixIcon={strToIcon(suffixIcon)}
      value={curValue}
      onChange={handleChange}
    />
  );
};

export type SelectProps = PropsWithComponentData<Omit<AntSelectProps, 'onChange'>> & {
  splitter?: string
  valueType?: 'string' | 'array'
  onChange?: (value: string | string[], selectedOptions: IAny | IAny[]) => void
}
