import { mergeWithArrayOverride } from '@yimoka/shared';
import zhCN from 'antd/es/locale/zh_CN';

export default mergeWithArrayOverride({}, zhCN, {
  Common: { confirm: '确定', cancel: '取消', submit: '提交', reset: '重置' },
  ListFilter: { query: '查询', reset: '重置' },
  RecordDel: { popconfirmTitle: '确定删除吗？', popconfirmDescription: '删除后无法恢复', text: '删除' },
  RecordEnable: { popconfirmTitle: '确定启用吗？', text: '启用' },
  RecordDisable: { popconfirmTitle: '确定禁用吗？', text: '禁用' },
  RecordBatchDel: { popconfirmTitle: '确定批量删除吗？', popconfirmDescription: '删除后无法恢复', text: '批量删除' },
  RecordBatchEnable: { popconfirmTitle: '确定批量启用吗？', text: '批量启用' },
  RecordBatchDisable: { popconfirmTitle: '确定批量禁用吗？', text: '批量禁用' },
});
