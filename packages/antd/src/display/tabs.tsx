import { observer, PropsWithComponentData, useAdditionalNode, useComponentData, useSchemaItemsToItems } from '@yimoka/react';
import { Tabs as AntTabs, TabsProps as AntTabsProps } from 'antd';
import React, { useMemo } from 'react';

import { strToIcon } from '../tools/icon';

const propsMap = { label: 'title' };

export const Tabs = observer((props: TabsProps) => {
  const { items, data, dataKey, store, removeIcon, tabBarExtraContent, ...rest } = props;
  const curData = useComponentData([data], dataKey, store);
  const schemaItems = useSchemaItemsToItems(curData, propsMap);
  const curItems = useMemo(() => [...(items ?? []), ...(schemaItems ?? [])], [items, schemaItems]);

  const curTabBarExtraContent = useAdditionalNode('tabBarExtraContent', tabBarExtraContent);
  return (
    <AntTabs {...rest}
      items={curItems}
      removeIcon={strToIcon(removeIcon)}
      tabBarExtraContent={curTabBarExtraContent}
    />
  );
});


export type TabsProps = PropsWithComponentData<AntTabsProps>

