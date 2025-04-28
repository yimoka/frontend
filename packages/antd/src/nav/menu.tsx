import { observer } from '@formily/react';
import { PropsWithComponentData, useComponentData, useSchemaItemsToItems } from '@yimoka/react';
import { IAny } from '@yimoka/shared';
import { Menu as AntMenu, MenuProps } from 'antd';
import React, { useMemo } from 'react';

import { handleMenuItemIcon, strToIcon } from '../tools/icon';

const propsMap = { title: 'label' };

const MenuFC = observer((props: PropsWithComponentData<Omit<MenuProps, 'itemRender'>> & { value?: IAny[], }) => {
  const { items, value, data, dataKey, store, expandIcon, overflowedIndicator, ...rest } = props;
  const curData = useComponentData([data, value], dataKey, store);
  const schemaItems = useSchemaItemsToItems(curData, propsMap, 'title');
  const curItems = useMemo(() => [...(items ?? []), ...(schemaItems ?? [])]?.map(handleMenuItemIcon), [items, schemaItems]);

  return (
    <AntMenu
      {...rest}
      expandIcon={strToIcon(expandIcon)}
      items={curItems}
      overflowedIndicator={strToIcon(overflowedIndicator)}
    />
  );
});

export const Menu = Object.assign(MenuFC, {
  Item: AntMenu.Item,
  SubMenu: AntMenu.SubMenu,
  ItemGroup: AntMenu.ItemGroup,
  Divider: AntMenu.Divider,
});

export type { MenuProps };
