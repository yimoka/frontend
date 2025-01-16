import { observer, PropsWithComponentData, useComponentData, useSchemaItemsToItems } from '@yimoka/react';
import { IAny } from '@yimoka/shared';
import { Descriptions as AntDescriptions, DescriptionsProps } from 'antd';
import React, { useMemo } from 'react';

const propsMap = { label: 'title' };

export const Descriptions = observer((props: PropsWithComponentData<DescriptionsProps> & { value?: IAny }) => {
  const { items, value, data, dataKey, store, ...rest } = props;
  const curData = useComponentData([data, value], dataKey, store);
  const schemaItems = useSchemaItemsToItems(curData, propsMap);
  const curItems = useMemo(() => [...(schemaItems ?? []), ...(items ?? [])], [items, schemaItems]);

  return (
    <AntDescriptions {...rest} items={curItems} />
  );
});

