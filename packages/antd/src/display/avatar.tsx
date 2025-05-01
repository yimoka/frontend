import { withValueFallback } from '@yimoka/react';
import { AvatarProps as AntAvatarProps, Avatar as AntAvatar } from 'antd';
import React from 'react';

import { strToIcon } from '../tools/icon';

type IProps = AntAvatarProps & { value?: IProps['src'] };

const AvatarFC = (props: IProps) => {
  const { icon, src, value, ...rest } = props;
  return <AntAvatar icon={strToIcon(icon)}  {...rest} src={src ?? value} />;
};

export const Avatar = Object.assign(withValueFallback(AvatarFC), {
  Group: AntAvatar.Group,
});
