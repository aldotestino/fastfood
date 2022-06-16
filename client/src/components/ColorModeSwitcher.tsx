import {
  useColorMode,
  SwitchProps,
  Switch,
} from '@chakra-ui/react';

type ColorModeSwitcherProps = Omit<SwitchProps, 'aria-label'>

function ColorModeSwitcher(props: ColorModeSwitcherProps) {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Switch
      size="lg"
      isChecked={colorMode === 'dark' ? true : false}
      colorScheme="yellow"
      onChange={toggleColorMode}
      {...props}
    />
  );
}

export default ColorModeSwitcher;