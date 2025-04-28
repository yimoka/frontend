import { withChildrenFallback } from '@yimoka/react';
import { Typography as AntTypography, GetProps } from 'antd';

const TypographyFn = withChildrenFallback(AntTypography);

const { Text: AntText, Title: AntTitle, Paragraph: AntParagraph, Link: AntLink } = AntTypography;

export const Text = withChildrenFallback(AntText);
export const Title = withChildrenFallback(AntTitle);
export const Paragraph = withChildrenFallback(AntParagraph);

export const Typography = Object.assign(TypographyFn, {
  Text: withChildrenFallback(AntText),
  Title: withChildrenFallback(AntTitle),
  Paragraph: withChildrenFallback(AntParagraph),
  Link: withChildrenFallback(AntLink),
});

export type TextProps = GetProps<typeof Text>;
export type TitleProps = GetProps<typeof Title>;
export type ParagraphProps = GetProps<typeof Paragraph>;
export type TypographyProps = GetProps<typeof Typography>;
