import { observer } from '@formily/react';
import { PropsWithComponentData, useComponentData } from '@yimoka/react';
import { Radio as AntRadio, RadioChangeEvent } from 'antd';
import React, { ComponentProps } from 'react';

export const Radio = AntRadio;

export const RadioGroup = observer((props: RadioGroupProps) => {
  const { options, data, store, dataKey, onChange, ...rest } = props;
  const curData = useComponentData([options, data], dataKey, store);

  return (
    <AntRadio.Group
      {...rest}
      options={curData}
      onChange={e => onChange?.(e.target.value, e)}
    />
  );
});

// type IRadioFC = React.ForwardRefExoticComponent<RadioProps> & {
//   Group: React.FC<RadioGroupProps>;
//   Button: typeof AntRadio.Button;
// };

// export const Radio = AntRadio as IRadioFC;

// Radio.Button = AntRadio.Button;
// 会导致内存泄露 页面崩溃
// Radio.Group = RadioGroup;

export type AntRadioGroupProps = ComponentProps<typeof AntRadio.Group>

export type RadioGroupProps = PropsWithComponentData<Omit<AntRadioGroupProps, 'onChange'> & {
  onChange?: (v?: string | AntRadioGroupProps['options'], e?: RadioChangeEvent) => void,
}>;
