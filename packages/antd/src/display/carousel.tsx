import { Carousel as AntCarousel, CarouselProps } from 'antd';
import React from 'react';

// Carousel 可以通过 RenderArray 来渲染内容
export const Carousel = (props: CarouselProps) => {
  const { children, ...rest } = props;
  console.log('children', children);
  // 在 json schema 中，Carousel 的 children 会多一层 react.fragment 应去掉
  return <AntCarousel {...rest}>{children}</AntCarousel>;
};

// const renderWithoutFragment = (children) => {
//   if (!children) return null;

//   // 如果是数组，递归处理每个子元素
//   if (Array.isArray(children)) {
//     return children.map(child => renderWithoutFragment(child));
//   }

//   // 如果是 React.Fragment，直接返回其子元素
//   if (React.isValidElement(children) && children.type === React.Fragment) {
//     const newxxx = renderWithoutFragment(children.props.children);
//     if (Array.isArray(newxxx)) {
//       return newxxx?.map(child => renderWithoutFragment(child));
//     }
//     return newxxx;
//   }

//   // 否则直接返回原始元素
//   return children;
// };
