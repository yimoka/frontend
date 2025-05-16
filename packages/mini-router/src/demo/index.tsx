import React, { useState } from 'react';

const DemoList: { title: string, component: React.ComponentType }[] = [];

export const DemoIndex = () => {
  // 获取 url 参数
  const [search, setSearch] = useState(window.location.search);
  const searchParams = new URLSearchParams(search);
  const demo = searchParams.get('demo');
  const currentDemo = DemoList.find(item => item.title === demo);

  return (
    <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <nav style={{ display: 'flex', gap: '5px' }}>
        {DemoList.map(demo => (
          <button key={demo.title}
            onClick={() => {
              const str = `?demo=${demo.title}`;
              setSearch(str);
              window.history.pushState({}, '', str);
            }}>
            {demo.title}
          </button>
        ))}
      </nav>
      <div >
        <div>
          {currentDemo && <currentDemo.component />}
        </div>
      </div>
    </div>
  );
};
