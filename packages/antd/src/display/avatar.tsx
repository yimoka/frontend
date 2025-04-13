import { AvatarProps as AntAvatarProps, Avatar as AntAvatar } from 'antd';
import React from 'react';

import { strToIcon } from '../tools/icon';

const AvatarFC = (props: AvatarProps) => {
  const { icon, src, value, ...rest } = props;
  return <AntAvatar icon={strToIcon(icon)}  {...rest} src={src ?? value} />;
};

export const Avatar = Object.assign(AvatarFC, AntAvatar);

export type AvatarProps = AntAvatarProps & { value?: AvatarProps['src'] };
