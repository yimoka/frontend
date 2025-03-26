import { observer } from '@formily/react';
import { PropsWithComponentData, useComponentData, useSchemaItemsToItems } from '@yimoka/react';
import { IAny } from '@yimoka/shared';
import { Menu as AntMenu, MenuProps } from 'antd';
import React, { useMemo } from 'react';

import { strToIcon } from '../tools/icon';

const propsMap = { title: 'label' };

const MenuFC = observer((props: PropsWithComponentData<Omit<MenuProps, 'itemRender'>> & { value?: IAny[], }) => {
  const { items, value, data, dataKey, store, expandIcon, overflowedIndicator, ...rest } = props;
  const curData = useComponentData([data, value], dataKey, store);
  const schemaItems = useSchemaItemsToItems(curData, propsMap, 'title');
  const curItems = useMemo(() => [...(items ?? []), ...(schemaItems ?? [])]?.map(item => (typeof item.icon === 'string' ? { ...item, icon: strToIcon(item.icon) } : item)), [items, schemaItems]);

  return (
    <AntMenu
      {...rest}
      expandIcon={strToIcon(expandIcon)}
      items={curItems}
      overflowedIndicator={strToIcon(overflowedIndicator)}
    />
  );
});

export const Menu = Object.assign(MenuFC, AntMenu);
