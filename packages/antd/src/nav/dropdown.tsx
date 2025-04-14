import { observer } from '@formily/react';
import { PropsWithComponentData, useComponentData, useSchemaItemsToItems } from '@yimoka/react';
import { IAny } from '@yimoka/shared';
import { Dropdown as AntDropdown, DropdownProps } from 'antd';
import React, { useMemo } from 'react';

import { strToIcon } from '../tools/icon';

const propsMap = { title: 'label' };

const DropdownFC = observer((props: PropsWithComponentData<DropdownProps> & { value?: IAny[], }) => {
  const { value, data, dataKey, store, menu, ...rest } = props;
  const curData = useComponentData([data, value], dataKey, store);
  const schemaItems = useSchemaItemsToItems(curData, propsMap, 'label');
  const curItems = useMemo(() => [...(menu?.items ?? []), ...(schemaItems ?? [])]?.map(item => (typeof item.icon === 'string' ? { ...item, icon: strToIcon(item.icon) } : item)), [menu?.items, schemaItems]);

  return <AntDropdown  {...rest} menu={{ ...menu, items: curItems }} />;
});

export const Dropdown = Object.assign(DropdownFC, {
  Button: AntDropdown.Button,
});

export type { DropdownProps };
