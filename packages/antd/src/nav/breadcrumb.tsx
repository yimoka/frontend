import { observer } from '@formily/react';
import { PropsWithComponentData, useAdditionalNode, useComponentData, useSchemaItemsToItems } from '@yimoka/react';
import { IAny } from '@yimoka/shared';
import { Breadcrumb as AntBreadcrumb, BreadcrumbProps } from 'antd';
import React, { useMemo } from 'react';

import { Link } from '../display/link';

const propsMap = { title: 'title' };

const BreadcrumbFC = observer((props: PropsWithComponentData<Omit<BreadcrumbProps, 'itemRender'>> & { value?: IAny[], itemRender?: 'link' | BreadcrumbProps['itemRender'] }) => {
  const { items, separator, value, data, dataKey, store, itemRender, ...rest } = props;
  const curSeparator = useAdditionalNode('separator', separator);
  const curData = useComponentData([data, value], dataKey, store);
  const schemaItems = useSchemaItemsToItems(curData, propsMap, 'title');
  const curItems = useMemo(() => [...(items ?? []), ...(schemaItems ?? [])], [items, schemaItems]);

  const curItemRender = useMemo(() => {
    if (itemRender === 'link') {
      const fn: BreadcrumbProps['itemRender'] = (route, _params, _items, paths) => {
        const { href, path, title } = route;
        if (href) {
          return <Link to={href}>{title}</Link>;
        }
        if (path) {
          if (path.startsWith('/')) {
            return <Link to={path}>{title}</Link>;
          }
          const str = `/${paths.join('/')}`;
          const to = str.replace(/([^:])\/\//g, '$1/');
          return <Link to={to}>{title}</Link>;
        }
        return title;
      };
      return fn;
    }
    return itemRender;
  }, [itemRender]);

  return (
    <AntBreadcrumb
      {...rest}
      itemRender={curItemRender}
      items={curItems}
      separator={curSeparator}
    />
  );
});

export const Breadcrumb = Object.assign(BreadcrumbFC, AntBreadcrumb);

export type { BreadcrumbProps };
