import { observer } from '@formily/react';
import { isBlank } from '@yimoka/shared';
import { Typography } from 'antd';
import { LinkProps as ALinkProps } from 'antd/lib/typography/Link';
import React, { useMemo } from 'react';
import { LinkProps as RLinkProps, useHref, useLinkClickHandler } from 'react-router-dom';

const { Link: ALink } = Typography;

export type LinkProps = Pick<RLinkProps, 'to' | 'reloadDocument' | 'replace' | 'state'> & ALinkProps & React.RefAttributes<HTMLElement>;

export const Link = observer((props: LinkProps) => {
  const { href, to, target, ...args } = props;

  const curTo = useMemo(() => {
    const val = to ?? href;
    if (typeof val === 'string') {
      return val;
    }
    if (isBlank(val)) {
      return '';
    }
    const { pathname = '', search = '', hash = '' } = val;
    return pathname + search + hash;
  }, [to, href]);

  const isExternal = useMemo(() => curTo && /^[\w]+:\/\//.test(curTo), [curTo]);

  const curTarget = useMemo(() => {
    if (target) {
      return target;
    }
    return isExternal ? '_blank' : undefined;
  }, [isExternal, target]);

  if (!isExternal) {
    return (<LinkAdapter {...args} target={curTarget} to={curTo} />);
  }

  return <ALink rel="noopener noreferrer" {...args} href={curTo} target={curTarget} />;
});

export const LinkAdapter = (props: LinkProps) => {
  const { onClick, replace = false, state, target, to, type, ...args } = props;
  const href = useHref(to);
  const handleClick = useLinkClickHandler<HTMLElement>(to, { replace, state, target });

  return (
    <ALink
      {...args}
      href={href}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          handleClick(event);
        }
      }}
      target={target}
    />
  );
};
