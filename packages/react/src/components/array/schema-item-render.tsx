import { Schema } from '@formily/json-schema';
import { RecordScope, ExpressionScope } from '@formily/react';
import { IAny } from '@yimoka/shared';
import React from 'react';

import { IRecordIndexFn } from '../../hooks/record-index-fn';

import { SchemaItemRecursion } from './schema-item-recursion';

export const SchemaItemRender = (props: { value: IAny, record: IAny, schema: Schema, getRecordIndex?: IRecordIndexFn, componentName?: string }) => {
  const { value, record, schema, getRecordIndex, componentName } = props;
  const index = getRecordIndex?.(record);

  return (
    <RecordScope getRecord={() => record} getIndex={() => index ?? 0} >
      <ExpressionScope value={{ $value: value }}>
        <SchemaItemRecursion schema={schema} componentName={componentName} name={index} />
      </ExpressionScope>
    </RecordScope>
  );
};
