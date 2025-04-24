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
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', 'x-component': 'input' },
              age: { type: 'number', 'x-component': 'input' },
            },
          },
        },
      },
    }}
    store={{
      defaultValues: {
        arr: [{ name: '张三', age: 18 }, { name: '李四', age: 20 }],
      },
    }}
  />
);
