# @yimoka/echarts

基于 [Apache ECharts](https://echarts.apache.org/zh/index.html) 的 React 图表组件，提供了简单易用的接口和自动化的图表管理功能。

## ✨ 特性

- 🔄 自动响应容器大小变化
- 📊 支持动态数据更新
- ⚙️ 完整的 ECharts 配置支持
- 🎨 支持图表实例回调
- 🛠 支持低代码平台集成

## 📦 安装

```bash
# 使用 npm
npm install @yimoka/echarts echarts

# 使用 yarn
yarn add @yimoka/echarts echarts

# 使用 pnpm
pnpm add @yimoka/echarts echarts
```

## 🔨 使用

### 基础使用

```tsx
import { Echarts } from '@yimoka/echarts';

const App = () => {
  const options = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: [150, 230, 224, 218, 135, 147, 260],
      type: 'line'
    }]
  };

  return <Echarts options={options} />;
};
```

### 自动调整大小

组件默认开启自动调整大小功能，当容器大小变化时，图表会自动调整以适应新的大小。

```tsx
// 禁用自动调整大小
<Echarts options={options} autoSize={false} />
```

### 动态数据更新

组件支持通过 `data` 或 `value` 属性传入数据，会自动处理数据更新。

```tsx
const App = () => {
  const [data, setData] = useState([150, 230, 224, 218, 135, 147, 260]);
  
  const options = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      type: 'line'
    }]
  };

  return <Echarts options={options} data={data} />;
};
```

### 图表实例回调

通过 `onChart` 回调可以获取到图表实例，进行更多自定义操作。

```tsx
const App = () => {
  const handleChart = (chart: echarts.ECharts) => {
    // 可以进行更多自定义操作
    chart.on('click', params => {
      console.log(params);
    });
  };

  return <Echarts options={options} onChart={handleChart} />;
};
```

## 📝 API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| options | ECharts 配置项 | `echarts.EChartsOption` | - |
| onChart | 图表实例创建后的回调函数 | `(chart: echarts.ECharts) => void` | - |
| autoSize | 是否自动调整大小 | `boolean` | `true` |
| data | 数据源 | `any[]` | - |
| value | 数据源（兼容低码平台） | `any[]` | - |

除了以上属性外，组件还支持所有 div 元素的原生属性。

## �� 许可证

MIT License
