import { observer, PropsWithComponentData, useComponentData, useSchemaItemsToItems } from '@yimoka/react';
import { IAny } from '@yimoka/shared';
import { Descriptions as AntDescriptions, DescriptionsProps as AntDescriptionsProps } from 'antd';
import { DescriptionsItemProps } from 'antd/es/descriptions/Item';
import React, { useMemo } from 'react';

const propsMap = { label: 'title' };

export const Descriptions = observer((props: DescriptionsProps) => {
  const { items, value, data, dataKey, store, ...rest } = props;
  const curData = useComponentData([data, value], dataKey, store);
  const schemaItems = useSchemaItemsToItems(curData, propsMap);
  const curItems = useMemo(() => [...(items ?? []), ...(schemaItems ?? [])], [items, schemaItems]);

  return (
    <AntDescriptions {...rest} items={curItems} />
  );
});

export const DescriptionsItem = AntDescriptions.Item;

export type DescriptionsProps = PropsWithComponentData<AntDescriptionsProps> & { value?: IAny }

export type { DescriptionsItemProps };
