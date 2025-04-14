import { Slider as AntSlider, GetProps } from 'antd';

export const Slider: typeof AntSlider = AntSlider;

export type SliderProps = GetProps<typeof AntSlider>
