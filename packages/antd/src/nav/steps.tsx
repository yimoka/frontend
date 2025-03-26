import { observer } from '@formily/react';
import { PropsWithComponentData, useAdditionalNode, useComponentData, useSchemaItemsToItems } from '@yimoka/react';
import { IAny } from '@yimoka/shared';
import { Steps as AntSteps, StepProps, StepsProps } from 'antd';
import React, { useMemo } from 'react';

import { strToIcon } from '../tools/icon';

const propsMap = { title: 'title' };

const StepsFC = observer((props: PropsWithComponentData<StepsProps> & { value?: IAny[], }) => {
  const { items, value, data, dataKey, store, ...rest } = props;
  const curData = useComponentData([data, value], dataKey, store);
  const schemaItems = useSchemaItemsToItems(curData, propsMap, 'title');
  const curItems = useMemo(() => [...(items ?? []), ...(schemaItems ?? [])]?.map(item => (typeof item.icon === 'string' ? { ...item, icon: strToIcon(item.icon) } : item)), [items, schemaItems]);

  return <AntSteps  {...rest} items={curItems} />;
});

const Step = (props: StepProps) => {
  const { icon, title, subTitle, description, ...rest } = props;
  const curTitle = useAdditionalNode('title', title);
  const curSubTitle = useAdditionalNode('subTitle', subTitle);
  const curDescription = useAdditionalNode('description', description);

  return (
    <AntSteps.Step
      {...rest}
      description={curDescription}
      icon={strToIcon(icon)}
      subTitle={curSubTitle}
      title={curTitle}
    />
  );
};

export const Steps = Object.assign(StepsFC, { Step });

