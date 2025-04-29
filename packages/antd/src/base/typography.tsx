import { withChildrenFallback } from '@yimoka/react';
import { Typography as AntTypography, GetProps } from 'antd';
import { TypographyProps as AntTypographyProps } from 'antd/es/typography/Typography';
import { FC, PropsWithChildren } from 'react';
import type { JSX } from 'react';

// 使用类型断言来避免内部类型暴露
const TypographyFn = withChildrenFallback(AntTypography as FC<PropsWithChildren<AntTypographyProps<keyof JSX.IntrinsicElements>>>);

const { Text: AntText, Title: AntTitle, Paragraph: AntParagraph, Link: AntLink } = AntTypography;

export const Text = withChildrenFallback(AntText);
export const Title = withChildrenFallback(AntTitle);
export const Paragraph = withChildrenFallback(AntParagraph);
const Link = withChildrenFallback(AntLink);

// 创建一个新的 Typography 组件，包含所有子组件
const Typography = TypographyFn as typeof TypographyFn & {
  Text: typeof Text;
  Title: typeof Title;
  Paragraph: typeof Paragraph;
  Link: typeof Link;
};

// 添加子组件
Typography.Text = Text;
Typography.Title = Title;
Typography.Paragraph = Paragraph;
Typography.Link = Link;

export { Typography };

export type TextProps = GetProps<typeof Text>;
export type TitleProps = GetProps<typeof Title>;
export type ParagraphProps = GetProps<typeof Paragraph>;
export type TypographyProps = GetProps<typeof Typography>;
