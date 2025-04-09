/**
 * @remarks 工具提示模块单元测试
 * @author ickeep <i@ickeep.com>
 */

import { BaseStore, IField, ITooltip } from '@yimoka/store';
import { describe, it, expect } from 'vitest';

import { getTooltipProps } from '../tools/tooltip';

describe('工具提示模块', () => {
  describe('getTooltipProps', () => {
    it('当 tooltip 为 false 时应该返回 undefined', () => {
      expect(getTooltipProps(false)).toBeUndefined();
    });

    it('当 tooltip 为 true 时应该返回 undefined', () => {
      expect(getTooltipProps(true)).toBeUndefined();
    });

    it('当 tooltip 为字符串时应该返回 { title: tooltip }', () => {
      expect(getTooltipProps('提示文本')).toEqual({ title: '提示文本' });
    });

    it('当 tooltip 为对象时应该返回原对象', () => {
      const tooltip = { title: '提示文本', placement: 'top' };
      expect(getTooltipProps(tooltip)).toEqual(tooltip);
    });

    it('当 tooltip 为 undefined 时应该返回 undefined', () => {
      expect(getTooltipProps(undefined as unknown as ITooltip)).toBeUndefined();
    });

    it('当 tooltip 为 null 时应该返回 undefined', () => {
      expect(getTooltipProps(null as unknown as ITooltip)).toBeUndefined();
    });

    describe('字段配置中的工具提示', () => {
      const store = new BaseStore({
        fieldsConfig: {
          name: {
            'x-tooltip': '名称提示',
          },
        },
      });

      const field: IField = 'name';

      it('当 tooltip 为 true 时应该使用字段配置中的工具提示', () => {
        expect(getTooltipProps(true, field, store)).toEqual({ title: '名称提示' });
      });

      it('当 tooltip 为 undefined 时应该使用字段配置中的工具提示', () => {
        expect(getTooltipProps(undefined as unknown as ITooltip, field, store)).toEqual({ title: '名称提示' });
      });

      it('当字段配置中的工具提示为 true 时应该返回 undefined', () => {
        const customStore = new BaseStore({
          fieldsConfig: {
            name: {
              'x-tooltip': true,
            },
          },
        });
        expect(getTooltipProps(true, field, customStore)).toBeUndefined();
      });

      it('当字段配置中的工具提示为 false 时应该返回 undefined', () => {
        const customStore = new BaseStore({
          fieldsConfig: {
            name: {
              'x-tooltip': false,
            },
          },
        });
        expect(getTooltipProps(true, field, customStore)).toBeUndefined();
      });
    });
  });
});
