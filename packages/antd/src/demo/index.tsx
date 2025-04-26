import { Tabs } from 'antd';
import React, { useState } from 'react';

import { Typography } from '../base/typography';
import { DescriptionsDemo } from '../display/__demo__/descriptions';

const DemoList = [
  { key: 'descriptions', children: <DescriptionsDemo /> },
  { key: '2', children: <Typography value="123" >456</Typography> },
];

export const DemoIndex = () => {
  const [search, setSearch] = useState(window.location.search);
  const searchParams = new URLSearchParams(search);
  const demo = searchParams.get('demo') ?? DemoList[0].key;

  return (
    <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <Tabs
        activeKey={demo}
        items={DemoList.map(item => ({ label: item.key, ...item }))}
        onChange={(key) => {
          setSearch(`?demo=${key}`);
          window.history.pushState({}, '', `?demo=${key}`);
        }}
      />
    </div>
  );
};
