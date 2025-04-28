import { observer, PropsWithComponentData, useComponentData, useSchemaItemsToItems } from '@yimoka/react';
import { Collapse as AntCollapse, CollapseProps as AntCollapseProps } from 'antd';
import React, { useMemo } from 'react';

const propsMap = { label: 'title' };

export const Collapse = observer((props: CollapseProps) => {
  const { items, data, dataKey, store, ...rest } = props;
  const curData = useComponentData([data], dataKey, store);
  const schemaItems = useSchemaItemsToItems(curData, propsMap);
  const curItems = useMemo(() => [...(items ?? []), ...(schemaItems ?? [])], [items, schemaItems]);

  return (
    <AntCollapse {...rest} items={curItems} />
  );
});


export type CollapseProps = PropsWithComponentData<AntCollapseProps>

