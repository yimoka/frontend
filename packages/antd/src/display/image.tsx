import { ImageProps as AntImageProps, Image as AntImage } from 'antd';
import React from 'react';

export const Image = (props: ImageProps) => {
  const { src, value, ...rest } = props;
  return <AntImage   {...rest} src={src ?? value} />;
};

export type ImageProps = AntImageProps & { value?: ImageProps['src'] };
