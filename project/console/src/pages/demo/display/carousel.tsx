import { Carousel } from '@yimoka/antd';
import { Entity } from '@yimoka/react';
import { Tabs } from 'antd';
import React from 'react';

export const CarouselDemo = () => (
  <div>
    <Tabs defaultActiveKey="schema" items={[
      { key: 'JSX', label: 'JSX 调用', children: <CarouselJSX /> },
      { key: 'schema', label: 'Schema', children: <CarouselSchema /> },
    ]} />
  </div>
);

const api = () => {
  console.log(' fetch api');
  return { code: 0, msg: '', data: {} };
};

export const CarouselSchema = () => (
  <Entity
    store={{ api, defaultValues: { arr: [1, 2, 3, 4] } }}
    schema={
      {
        type: 'object',
        properties: {
          divider1: {
            type: 'void',
            'x-component': 'Divider',
            'x-component-props': {
              children: '标准 受按 读取 values 的值',
            },
          },
          Carousel1: {
            type: 'void',
            'x-component': 'Carousel',
            properties: {
              div1: {
                type: 'void',
                'x-component': 'div',
                properties: {
                  h3: {
                    type: 'void',
                    'x-component': 'h3',
                    'x-component-props': {
                      style: {
                        margin: 0,
                        height: '160px',
                        color: '#fff',
                        lineHeight: '160px',
                        textAlign: 'center',
                        background: '#364d79',
                      },
                    },
                  },
                },
              },
              dev2: {
                type: 'void',
                'x-component': 'div',
                properties: {
                  h3: {
                    type: 'void',
                    'x-component': 'h3',
                    'x-component-props': {
                      style: {
                        margin: 0,
                        height: '160px',
                        color: '#fff',
                        lineHeight: '160px',
                        textAlign: 'center',
                        background: '#364d79',
                      },
                    },
                  },
                },
              },
              // arr: {
              //   type: 'array',
              //   'x-component': 'RenderArray',
              //   items: {
              //     type: 'void',
              //     'x-component': 'div',
              //     properties: {
              //       h3: {
              //         type: 'void',
              //         'x-component': 'h3',
              //         'x-component-props': {
              //           style: {
              //             margin: 0,
              //             height: '160px',
              //             color: '#fff',
              //             lineHeight: '160px',
              //             textAlign: 'center',
              //             background: '#364d79',
              //           },
              //         },
              //       },
              //     },
              //   },
              // },
            },
          },
        },
      }}
  />);

const contentStyle: React.CSSProperties = {
  margin: 0,
  height: '160px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
};
export const CarouselJSX = () => (
  <Carousel >
    {[1, 2, 3, 4].map(item => <div key={item}><h3 style={contentStyle}>{item}</h3></div>)}
  </Carousel>
);
