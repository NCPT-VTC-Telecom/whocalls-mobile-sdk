import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

export const isPhoneNumber = (str: string) => {
  return str;
  // return (
  //   typeof str === 'string' &&
  //   /^[\+]?[0-9]{10,100}$/im.test(str.replace(/ /g, ''))
  // );
};

export const isEmail = (str: string) => {
  return (
    typeof str === 'string' &&
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@[^|\;:_=+{}'",.?/~`!@#$%^&*<>()[\]\\-]((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(
      str,
    )
  );
};

let timerDebounce: any = null;

export const useDebounce = (
  value: string,
  useCallBack: (value: string) => void,
  wait: number = 500,
) => {
  if (timerDebounce) clearTimeout(timerDebounce);
  timerDebounce = setTimeout(() => {
    clearTimeout(timerDebounce);
    if (typeof useCallBack === 'function') {
      useCallBack(value);
    }
  }, wait);
};

export const useAppNavigation = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  return navigation;
};
