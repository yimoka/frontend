import { useAdditionalNode } from '@yimoka/react';
import { Statistic as AntStatistic, GetProps, StatisticProps } from 'antd';
import React from 'react';

const StatisticFC = (props: StatisticProps) => {
  const { prefix, suffix, title, ...rest } = props;

  const curPrefix = useAdditionalNode('prefix', prefix);
  const curSuffix = useAdditionalNode('suffix', suffix);
  const curTitle = useAdditionalNode('title', title);

  return (
    <AntStatistic
      {...rest}
      prefix={curPrefix}
      suffix={curSuffix}
      title={curTitle}
    />
  );
};

export type CountdownProps = GetProps<typeof AntStatistic.Countdown>

export const Countdown = (props: CountdownProps) => {
  const { prefix, suffix, title, ...rest } = props;

  const curPrefix = useAdditionalNode('prefix', prefix);
  const curSuffix = useAdditionalNode('suffix', suffix);
  const curTitle = useAdditionalNode('title', title);

  return (
    <AntStatistic.Countdown
      {...rest}
      prefix={curPrefix}
      suffix={curSuffix}
      title={curTitle}
    />
  );
};
type IStatisticFC = typeof StatisticFC & {
  Countdown: typeof Countdown
};

export const Statistic = StatisticFC as IStatisticFC;

Statistic.Countdown = Countdown;
