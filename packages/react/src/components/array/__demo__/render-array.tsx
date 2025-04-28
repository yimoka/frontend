// import { IAnyObject } from '@yimoka/shared';
import React from 'react';

import { Entity } from '../../entity/base';
import { RenderArray } from '../render-array';

// const Test = (props: IAnyObject) => {
//   console.log('props', props);
//   return <div>Test</div>;
// };

export const RenderArrayDemo = () => (
  <Entity
    schema={{
      type: 'object',
      properties: {
        arr: {
          'x-component': RenderArray,
          // 数据的展示 不随着 values 走 只能通过 data 然后在 item 里只能通过 $record $value 来取值
          type: 'void',
          'x-component-props': {
            dataKey: 'values.arr',
          },
          items: {
            type: 'void',
            properties: {
              name: {},
              age: {},
            },
          },
        },
      },
    }}
    store={{
      defaultValues: {
        arr: { name: '张三', age: 18 },
      },
    }}
  />
);
