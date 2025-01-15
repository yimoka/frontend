import TIcon from '@ant-design/icons';
import { IconComponentProps } from '@ant-design/icons/lib/components/Icon';
import { RenderAny, useGetIcon } from '@yimoka/react';
import { Spin } from 'antd';
import React, { ComponentType, ReactNode, useEffect, useState } from 'react';

export type IconProps = Partial<Omit<IconComponentProps, 'component'>> & {
  name?: string
  value?: string
};

export const Icon = (props: IconProps) => {
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
    return <RenderAny value={TIcon} props={{ component, ...args }} />;
  }
  return <Spin size='small' spinning={loading} />;
};
