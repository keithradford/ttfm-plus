import { HStack, Switch, SwitchProps, Text } from '@chakra-ui/react';
import React from 'react';

type Props = { label: string } & SwitchProps;

export function LabeledSwitch({ label, ...rest }: Props): JSX.Element {
  return (
    <HStack color="whitesmoke" w="100%" justifyContent="space-between">
      <Text fontWeight="bold" as="h2" letterSpacing=".5em">
        {label.toUpperCase()}
      </Text>
      <Switch {...rest} colorScheme="logo" />
    </HStack>
  );
}
