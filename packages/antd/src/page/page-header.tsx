import { observer, useExpressionScope } from '@yimoka/react';
import { IAnyObject } from '@yimoka/shared';
import { IEntityConfig } from '@yimoka/store';
import { BreadcrumbProps, DividerProps, Flex } from 'antd';
import React, { ReactNode, useMemo } from 'react';

import { Divider } from '../layout/divider';
import { Breadcrumb } from '../nav/breadcrumb';

export const PageHeader = observer((props: PageBarHeaderProps) => {
  const { breadcrumb, title, divider, children } = props;
  const scope = useExpressionScope();
  const { $config = {} } = scope ?? {};
  const curTitle = title ?? $config?.name;

  const items: BreadcrumbProps['items'] = useMemo(() => {
    const arr = (breadcrumb ?? $config?.breadcrumb)?.map((item: IAnyObject) => {
      const { label } = item;
      return { title: label, ...item };
    });
    if (curTitle) {
      return [...arr, { title: curTitle }];
    }
    return arr;
  }, [breadcrumb, $config?.breadcrumb, curTitle]);

  return (
    <>
      {children
        ? <Flex align='start' justify='space-between'  >
          <Breadcrumb itemRender='link' items={items} />
          {children}
        </Flex>
        : <Breadcrumb itemRender='link' items={items} />
      }
      {divider !== false && <Divider {...divider} />}
    </>
  );
});

export interface PageBarHeaderProps extends Pick<Partial<IEntityConfig>, 'breadcrumb'> {
  title?: string
  divider?: DividerProps | false
  children?: ReactNode
}
