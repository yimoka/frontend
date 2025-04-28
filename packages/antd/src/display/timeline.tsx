import { observer, PropsWithComponentData, useAdditionalNode, useComponentData, useSchemaItemsToItems } from '@yimoka/react';
import { Timeline as AntTimeline, TimelineProps as AntTimelineProps } from 'antd';
import React, { useMemo } from 'react';

const propsMap = { label: 'title' };

export const Timeline = observer((props: TimelineProps) => {
  const { items, data, dataKey, store, pending, pendingDot, ...rest } = props;
  const curData = useComponentData([data], dataKey, store);
  const schemaItems = useSchemaItemsToItems(curData, propsMap);
  const curItems = useMemo(() => [...(items ?? []), ...(schemaItems ?? [])], [items, schemaItems]);
  const curPending = useAdditionalNode('pending', pending);
  const curPendingDot = useAdditionalNode('pendingDot', pendingDot);

  return (
    <AntTimeline
      {...rest}
      items={curItems}
      pending={curPending}
      pendingDot={curPendingDot}
    />
  );
});


export type TimelineProps = PropsWithComponentData<AntTimelineProps>

