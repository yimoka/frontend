import { ColorPicker as AntColorPicker, ColorPickerProps as AntColorPickerProps } from 'antd';
import { AggregationColor } from 'antd/es/color-picker/color';
import React from 'react';

export const ColorPicker = (props: ColorPickerProps) => {
  const { onChange, ...rest } = props;
  return <AntColorPicker {...rest} onChange={(color, css) => onChange?.(css, color)} />;
};

export type ColorPickerProps = Omit<AntColorPickerProps, 'onChange'> & { onChange?: (value: string, color: AggregationColor,) => void }
