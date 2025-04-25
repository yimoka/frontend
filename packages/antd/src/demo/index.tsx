import { Tabs } from 'antd';
import React, { useState } from 'react';

const DemoList = [
  { key: '1', children: <>1</> },
  { key: '2', children: <>2</> },
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
