import { describe, it, expect } from 'vitest';

import { getAutoFilterConfig } from '../filter';

/**
 * @file filter.test.ts
 * @module @yimoka/shared
 * @author Yimoka Team
 * @since 1.0.0
 *
 * @summary 表格自动过滤工具函数的单元测试
 * @description 测试表格列自动过滤配置的生成功能
 */

describe('getAutoFilterConfig', () => {
  // 测试数据
  const testData = [
    { id: 1, name: '张三', status: 'active' },
    { id: 2, name: '李四', status: 'inactive' },
    { id: 3, name: '王五', status: 'active' },
  ];

  describe('like模式', () => {
    it('应该正确生成like模式的过滤配置', () => {
      // 测试意图：验证like模式下的过滤配置是否正确生成
      const config = getAutoFilterConfig('like', undefined, 'name');

      expect(config).toHaveProperty('onFilter');
      expect(config.filters).toBeUndefined();

      // 验证过滤函数
      const onFilter = config.onFilter!;
      expect(onFilter('张', testData[0])).toBe(true);
      expect(onFilter('李', testData[1])).toBe(true);
      expect(onFilter('王', testData[2])).toBe(true);
      expect(onFilter('赵', testData[0])).toBe(false);
    });

    it('应该处理空值和undefined的情况', () => {
      // 测试意图：验证like模式下的空值处理
      const config = getAutoFilterConfig('like', undefined, 'name');
      const onFilter = config.onFilter!;

      expect(onFilter('', testData[0])).toBe(true);
      expect(onFilter(undefined, testData[0])).toBe(true);
      expect(onFilter('张', {})).toBe(false);
    });
  });

  describe('enum模式', () => {
    it('应该正确生成enum模式的过滤配置', () => {
      // 测试意图：验证enum模式下的过滤配置是否正确生成
      const config = getAutoFilterConfig('enum', testData, 'status');

      expect(config).toHaveProperty('filters');
      expect(config).toHaveProperty('onFilter');

      // 验证过滤选项
      expect(config.filters).toEqual([
        { label: 'active', value: 'active', text: 'active' },
        { label: 'inactive', value: 'inactive', text: 'inactive' },
      ]);

      // 验证过滤函数
      const onFilter = config.onFilter!;
      expect(onFilter('active', testData[0])).toBe(true);
      expect(onFilter('inactive', testData[1])).toBe(true);
      expect(onFilter('active', testData[2])).toBe(true);
      expect(onFilter('unknown', testData[0])).toBe(false);
    });

    it('应该处理空数组的情况', () => {
      // 测试意图：验证enum模式下空数据源的处理
      const config = getAutoFilterConfig('enum', [], 'status');
      expect(config.filters).toEqual([]);
    });

    it('应该处理undefined值的情况', () => {
      // 测试意图：验证enum模式下undefined值的处理
      const data = [{ id: 1, status: undefined }];
      const config = getAutoFilterConfig('enum', data, 'status');
      expect(config.filters).toEqual([
        { label: 'undefined', value: undefined, text: 'undefined' },
      ]);
    });
  });

  describe('异常情况', () => {
    it('未提供path参数时应该返回空配置', () => {
      // 测试意图：验证未提供path参数时的处理
      const config = getAutoFilterConfig('like');
      expect(config.filters).toBeUndefined();
      expect(config.onFilter).toBeUndefined();
    });

    it('未提供autoFilter参数时应该返回空配置', () => {
      // 测试意图：验证未提供autoFilter参数时的处理
      const config = getAutoFilterConfig(undefined, testData, 'status');
      expect(config.filters).toBeUndefined();
      expect(config.onFilter).toBeUndefined();
    });

    it('无效的autoFilter参数时应该返回空配置', () => {
      // 测试意图：验证无效autoFilter参数时的处理
      const config = getAutoFilterConfig('invalid' as 'like' | 'enum', testData, 'status');
      expect(config.filters).toBeUndefined();
      expect(config.onFilter).toBeUndefined();
    });
  });
});
