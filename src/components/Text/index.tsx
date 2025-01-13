import React from 'react';
import {
  StyleProp,
  Text,
  TextProps as TextPropsRN,
  TextStyle as TextStyleRN,
} from 'react-native';
// import {useTranslation} from 'react-i18next'

// import {useTheme} from '~/themesV2'

type TextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'md'
  | 'lg'
  | 'sm'
  | 'title'
  | 'subtitle'
  | 'caption'
  | 'footnote'
  | undefined;

const sizes = {
  h1: 24,
  h2: 20,
  h3: 18,
  h4: 16,
  h5: 14,
  md: 14,
  lg: 16,
  sm: 12,
  title: 16,
  subtitle: 14,
  footnote: 12,
  caption: 10,
};
const weights = {
  h1: '600',
  h2: '600',
  h3: '600',
  h4: '500',
  h5: '500',
  md: 'normal',
  lg: 'normal',
  sm: 'normal',
  title: '600',
  subtitle: '500',
  footnote: '400',
  caption: '400',
};

export type TextStyle = StyleProp<TextStyleRN>;

export interface TextProps extends TextPropsRN {
  variant?: TextVariant;
  // children?: React.ReactNode;
  useI18n?: boolean;
  color?: string | any[];
  style?: TextStyle | TextStyle[];
  suffix?: string;
  onPress?: () => void;
}

const ThemedText: React.FC<TextProps> = props => {
  // const {colors} = useTheme()
  // const {t} = useTranslation()

  const textStyle = {
    color: props.color || 'black',
    fontSize: sizes[props.variant || 'md'],
    fontFamily: 'Sarabun-Bold',
    fontWeight: weights[props.variant as keyof typeof weights] || 'normal',
  } as TextStyle;

  const TextElement = React.createElement(Text, props);
  return React.cloneElement(TextElement, {
    style: [textStyle, props.style],
    children: props.children,
  });
};

export default React.memo(ThemedText);
