export const isPhoneNumber = (str: string) => {
  return (
    typeof str === 'string' &&
    /^[\+]?[0-9]{10,100}$/im.test(str.replace(/ /g, ''))
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
