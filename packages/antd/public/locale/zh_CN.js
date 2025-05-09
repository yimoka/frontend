import { mergeWithArrayOverride } from '@yimoka/shared';
import zhCN from 'antd/es/locale/zh_CN';

export default mergeWithArrayOverride({}, zhCN, {
  Common: { confirm: '确定', cancel: '取消', submit: '提交', reset: '重置' },
  ListFilter: { query: '查询', reset: '重置' },
  RecordDel: { popconfirmTitle: '确定删除吗？', popconfirmDescription: '删除后无法恢复', text: '删除' },
  RecordEnable: { popconfirmTitle: '确定启用吗？', text: '启用' },
  RecordDisable: { popconfirmTitle: '确定禁用吗？', text: '禁用' },
});
