import { IAny, IAnyObject, isBlank, JSONStringify } from '@yimoka/shared';
import React, { isValidElement } from 'react';
import { isValidElementType } from 'react-is';

export interface RenderAnyProps {
  value?: IAny
  props?: IAnyObject
}

export const RenderAny = (props: RenderAnyProps) => {
  const { value, props: cProps } = props;
  const type = typeof value;

  if (isValidElementType(value)) {
    const C: IAny = value;
    return <C {...cProps} />;
  }

  if (isValidElement(value) || type === 'string') {
    return value;
  }

  if (isBlank(value)) {
    return null;
  }

  const typeFnMap: IAnyObject = {
    boolean: () => String(value),
    number: () => String(value),
    bigint: () => String(value),
    // eslint-disable-next-line no-underscore-dangle
    object: () => (value.default && value.__esModule ? <RenderAny props={cProps} value={value.default} /> : JSONStringify(value)
    ),
  };
  return typeFnMap[type]?.();
};
