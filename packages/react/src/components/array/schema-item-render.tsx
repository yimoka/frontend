import { Schema, SchemaKey } from '@formily/json-schema';
import { RecordScope, ExpressionScope, useFieldSchema } from '@formily/react';
import { IAny } from '@yimoka/shared';
import React, { useMemo } from 'react';

import { IRecordIndexFn } from '../../hooks/record-index-fn';

import { getSchemaNameByFieldSchema } from '../../tools/schema-items';

import { SchemaItemRecursion } from './schema-item-recursion';

export const SchemaItemRender = (props: { value: IAny, record: IAny, schema: Schema, name?: SchemaKey, getRecordIndex?: IRecordIndexFn, componentName?: string }) => {
  const { value, record, schema, getRecordIndex, componentName, name } = props;
  const index = getRecordIndex?.(record);
  const fieldSchema = useFieldSchema();
  const curName = useMemo(() => (name ? name : `${index}.${getSchemaNameByFieldSchema(schema, fieldSchema)}`), [name, index, schema, fieldSchema]);

  return (
    <RecordScope getRecord={() => record} getIndex={() => index ?? 0} >
      <ExpressionScope value={{ $value: value }}>
        <SchemaItemRecursion schema={schema} componentName={componentName} name={curName} />
      </ExpressionScope>
    </RecordScope>
  );
};
