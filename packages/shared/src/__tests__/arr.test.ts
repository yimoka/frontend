import { describe, it, expect } from 'vitest';

import { normalizeToArray, arrayToTree } from '../arr';

describe('数组标准化工具', () => {
  it('当输入为数组时应返回原数组', () => {
    const input = [1, 2, 3];
    const result = normalizeToArray(input);
    expect(result).toBe(input);
  });

  it('当输入为 null 时应返回空数组', () => {
    const result = normalizeToArray(null);
    expect(result).toEqual([]);
  });

  it('当输入为 undefined 时应返回空数组', () => {
    const result = normalizeToArray(undefined);
    expect(result).toEqual([]);
  });

  it('当输入为空字符串时应返回空数组', () => {
    const result = normalizeToArray('');
    expect(result).toEqual([]);
  });

  it('当输入为非数组且非空值时应返回包含该值的数组', () => {
    const input = 42;
    const result = normalizeToArray(input);
    expect(result).toEqual([input]);
  });

  it('当输入为非空字符串时应返回包含该字符串的数组', () => {
    const input = 'hello';
    const result = normalizeToArray(input);
    expect(result).toEqual([input]);
  });
});

describe('数组转树形结构工具', () => {
  it('应该正确地将扁平数组转换为树形结构', () => {
    const input = [
      { id: 1, parentID: 0, name: '节点1' },
      { id: 2, parentID: 1, name: '节点2' },
      { id: 3, parentID: 1, name: '节点3' },
      { id: 4, parentID: 2, name: '节点4' },
    ];

    const expected = [
      {
        id: 1,
        parentID: 0,
        name: '节点1',
        children: [
          {
            id: 2,
            parentID: 1,
            name: '节点2',
            children: [
              { id: 4, parentID: 2, name: '节点4' },
            ],
          },
          { id: 3, parentID: 1, name: '节点3' },
        ],
      },
    ];

    const result = arrayToTree(input);
    expect(result).toEqual(expected);
  });

  it('应该支持自定义键名', () => {
    const input = [
      { nodeId: 1, pid: 0, name: '节点1' },
      { nodeId: 2, pid: 1, name: '节点2' },
    ];

    const expected = [
      {
        nodeId: 1,
        pid: 0,
        name: '节点1',
        kids: [
          { nodeId: 2, pid: 1, name: '节点2' },
        ],
      },
    ];

    const result = arrayToTree(input, 0, {
      id: 'nodeId',
      parentID: 'pid',
      children: 'kids',
    });

    expect(result).toEqual(expected);
  });

  it('当输入为空数组时应返回空数组', () => {
    const result = arrayToTree([]);
    expect(result).toEqual([]);
  });

  it('当输入为非数组时应返回空数组', () => {
    const result = arrayToTree(null as unknown as Record<string, unknown>[]);
    expect(result).toEqual([]);
  });

  it('应该支持自定义根节点ID', () => {
    const input = [
      { id: 1, parentID: 0, name: '节点1' },
      { id: 2, parentID: 1, name: '节点2' },
      { id: 3, parentID: 2, name: '节点3' },
    ];

    const result = arrayToTree(input, 2);
    expect(result).toEqual([
      { id: 3, parentID: 2, name: '节点3' },
    ]);
  });
});
