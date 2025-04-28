import { RecordsScope } from '@formily/react';
import { IAny, isVacuous } from '@yimoka/shared';

import React from 'react';

import { PropsWithComponentData, useComponentData } from '../../hooks/component-data';
import { useSchemaItemsToItems } from '../../hooks/schema-items-to-items';
import { RenderAny } from '../render-any';

export type RenderArrayProps = PropsWithComponentData<{ value?: IAny[] }>

export const RenderArray = (props: RenderArrayProps) => {
  const { data, dataKey, store, value } = props;
  const curData = useComponentData([data, value], dataKey, store);
  const items = useSchemaItemsToItems(curData);

  return (
    <RecordsScope getRecords={() => curData}>
      {isVacuous(items) ? null : items?.map((item, index) => <RenderAny key={index} value={item.children} />)}
    </RecordsScope>
  );
};
