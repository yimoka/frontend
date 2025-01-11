import { observer, useComponentData, useSchemaItemsToItems } from '@yimoka/react';
import { IAny } from '@yimoka/shared';
import { IStore } from '@yimoka/store';
import { Descriptions as AntDescriptions, DescriptionsProps } from 'antd';
import React, { useMemo } from 'react';

const propsMap = { label: 'title' };

export const Descriptions = observer((props: DescriptionsProps & { value?: IAny, data?: IAny, dataKey?: string, store?: IStore }) => {
  const { items, value, data, dataKey, store, ...rest } = props;
  const curData = useComponentData([data, value], dataKey, store);
  const schemaItems = useSchemaItemsToItems(curData, propsMap);
  const curItems = useMemo(() => [...(schemaItems ?? []), ...(items ?? [])], [items, schemaItems]);

  return (
    <AntDescriptions {...rest} items={curItems} />
  );
});

