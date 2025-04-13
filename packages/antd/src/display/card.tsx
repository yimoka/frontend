import { useAdditionalNode } from '@yimoka/react';
import { CardProps, Card as AntCard } from 'antd';
import { CardMetaProps } from 'antd/lib/card';
import React from 'react';

const CardFC = (props: CardProps) => {
  const { cover, extra, tabBarExtraContent, title, ...rest } = props;
  const coverNode = useAdditionalNode('cover', cover);
  const extraNode = useAdditionalNode('extra', extra);
  const tabBarExtraContentNode = useAdditionalNode('tabBarExtraContent', tabBarExtraContent);
  const titleNode = useAdditionalNode('title', title);

  return (
    <AntCard
      {...rest}
      cover={coverNode}
      extra={extraNode}
      tabBarExtraContent={tabBarExtraContentNode}
      title={titleNode}
    />
  );
};

const Meta = (props: CardMetaProps) => {
  const { avatar, description, title, ...rest } = props;
  const avatarNode = useAdditionalNode('avatar', avatar);
  const descriptionNode = useAdditionalNode('description', description);
  const titleNode = useAdditionalNode('title', title);

  return (
    <AntCard.Meta
      {...rest}
      avatar={avatarNode}
      description={descriptionNode}
      title={titleNode}
    />
  );
};

export const Card = Object.assign(CardFC, { Meta, Grid: AntCard.Grid });

export type { CardProps, CardMetaProps };
