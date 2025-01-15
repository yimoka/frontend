import TIcon from '@ant-design/icons';
import { IconComponentProps } from '@ant-design/icons/lib/components/Icon';
import { RenderAny, useGetIcon } from '@yimoka/react';
import { Spin } from 'antd';
import React, { ComponentType, ReactNode, forwardRef, useEffect, useState } from 'react';

export type IconProps = Partial<Omit<IconComponentProps, 'component'>> & {
  name?: string
  value?: string
};

export const Icon = forwardRef<HTMLSpanElement, IconProps>((props, ref) => {
  const { name, value, ...args } = props;
  const [loading, setLoading] = useState(false);
  const getIcon = useGetIcon();
  const [component, setComponent] = useState<ReactNode | ComponentType | null>(null);
  const file = name ?? value ?? '';

  useEffect(() => {
    if (!file || !getIcon) {
      return;
    }
    setLoading(true);
    const r = getIcon(file);
    if (r instanceof Promise) {
      r.then((c) => {
        setComponent(c);
        setLoading(false);
      });
    } else {
      setComponent(r);
      setLoading(false);
    }
  }, [file, getIcon]);

  if (component) {
    return <RenderAny value={TIcon} props={{ component, ...args, ref }} />;
  }
  return <Spin size='small' spinning={loading} />;
});

// export const getAutoIcon: <T = ReactNode>(name: T) => (T | ReactNode) = (name) => {
//   if (typeof name === 'string' && name) {
//     return <Icon name={name} />;
//   }
//   return name;
// };

// export const getAllowClear = (v?: boolean | { clearIcon?: ReactNode | string }) => {
//   if (typeof v === 'object' && v?.clearIcon) {
//     return { clearIcon: getAutoIcon(v.clearIcon) };
//   }
//   return v;
// };
