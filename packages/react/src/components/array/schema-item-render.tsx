import { Schema, SchemaKey } from '@formily/json-schema';
import { RecordScope, ExpressionScope, useFieldSchema } from '@formily/react';
import { IAny, isBlank } from '@yimoka/shared';
import React, { useMemo } from 'react';

import { IRecordIndexFn } from '../../hooks/record-index-fn';
import { getSchemaNameByFieldSchema } from '../../tools/schema-items';

import { SchemaItemRecursion } from './schema-item-recursion';

export const SchemaItemRender = (props: { value: IAny, record: IAny, schema: Schema, name?: SchemaKey, getRecordIndex?: IRecordIndexFn, componentName?: string }) => {
  const { value, record, schema, getRecordIndex, componentName, name } = props;
  const index = getRecordIndex?.(record);
  const fieldSchema = useFieldSchema();
  const curName = useMemo(() => {
    if (name) {
      return name;
    }
    const schemaName = getSchemaNameByFieldSchema(schema, fieldSchema);
    if (!isBlank(schemaName)) {
      return `${index}.${schemaName}`;
    }
    // 如果不转为字符串 0 会出现问题
    return `${index}`;
  }, [name, index, schema, fieldSchema]);

  return (
    <RecordScope getRecord={() => record} getIndex={() => index ?? 0} >
      <ExpressionScope value={{ $value: value }}>
        <SchemaItemRecursion schema={schema} componentName={componentName} name={curName} />
      </ExpressionScope>
    </RecordScope>
  );
};
