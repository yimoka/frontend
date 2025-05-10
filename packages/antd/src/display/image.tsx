import { withValueFallback } from '@yimoka/react';
import { Image as AntImage, ImageProps as AntImageProps, Empty, EmptyProps } from 'antd';
import React, { useMemo } from 'react';


const ImageFn = (props: ImageProps) => {
  const { src, value, empty, ...rest } = props;
  const curValue = useMemo(() => src ?? value, [src, value]);
  if (!curValue) {
    return <Empty description="暂无图片" image={Empty.PRESENTED_IMAGE_SIMPLE} {...empty} />;
  }

  return <AntImage {...rest} src={curValue} />;
};

export const Image: React.FC<ImageProps> = withValueFallback(ImageFn);

export type ImageProps = AntImageProps & {
  withScopeValue?: boolean,
  value?: ImageProps['src'],
  empty?: EmptyProps
};
