import { PropsWithComponentData, useChildrenWithoutFragment, useComponentData, useSchemaItemsToItems } from '@yimoka/react';
import { Carousel as AntCarousel, CarouselProps as AntCarouselProps } from 'antd';
import React from 'react';

export type CarouselProps = PropsWithComponentData<AntCarouselProps>;
export const Carousel = (props: CarouselProps) => {
  const { children, data, dataKey, store, ...rest } = props;
  const curData = useComponentData([data], dataKey, store);
  const items = useSchemaItemsToItems(curData);
  const curChildren = useChildrenWithoutFragment(children);

  // TODO: 实现
  console.log('Carousel', items);

  return <AntCarousel {...rest}>{curChildren}</AntCarousel>;
};

