import React, { useState } from 'react';
import { Image, Alert } from 'react-native';
import {
  Box,
  VStack,
  Input,
  InputField,
  Button,
  ButtonText,
  Text,
  Center,
  Heading,
  Card,
  Pressable,
} from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [control, setControl] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    if (!control.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Por favor llena todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    Alert.alert('Registro exitoso', 'Tu cuenta ha sido creada', [
      { text: 'OK', onPress: () => navigation.replace('Main') },
    ]);
  };

  return (
    <Center flex={1} bg="$white">
      {/* Botón de regresar */}
      <Box position="absolute" top="$10" left="$5">
        <Pressable onPress={() => navigation.goBack()}>
          <Text fontSize="$xl" color="$black">←</Text>
        </Pressable>
      </Box>

      {/* Imagen superior */}
      <Box alignItems="center" mb="$4" mt="$12">
        <Image
          source={require('../assets/avatar.png')}
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            borderWidth: 2,
            borderColor: '#A855F7', // morado
          }}
        />
      </Box>

      {/* Texto Registro */}
      <Box mb="$5">
        <Heading size="lg" textAlign="center">
          REGISTRO
        </Heading>
      </Box>

      {/* Tarjeta del formulario */}
      <Card
        w="$80"
        py="$6"
        px="$5"
        bg="$white"
        borderRadius="$lg"
        shadowColor="#000"
        elevation={4}
      >
        <VStack space="lg">
          {/* Campo No. Control */}
          <Box>
            <Text mb="$2" color="$black">
              No. Control
            </Text>
            <Input borderColor="$gray300" borderRadius="$md">
              <InputField
                placeholder="Value"
                value={control}
                onChangeText={setControl}
                autoCapitalize="none"
              />
            </Input>
          </Box>

          {/* Campo Email */}
          <Box>
            <Text mb="$2" color="$black">
              Email
            </Text>
            <Input borderColor="$gray300" borderRadius="$md">
              <InputField
                placeholder="Value"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </Input>
          </Box>

          {/* Campo Password */}
          <Box>
            <Text mb="$2" color="$black">
              Password
            </Text>
            <Input borderColor="$gray300" borderRadius="$md">
              <InputField
                placeholder="Value"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </Input>
          </Box>

          {/* Campo Confirm Password */}
          <Box>
            <Text mb="$2" color="$black">
              Confirm Password
            </Text>
            <Input borderColor="$gray300" borderRadius="$md">
              <InputField
                placeholder="Value"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </Input>
          </Box>

          {/* Botón Register */}
          <Button bg="$purple600" borderRadius="$md" mt="$2" onPress={handleRegister}>
            <ButtonText color="$white">Register</ButtonText>
          </Button>
        </VStack>
      </Card>
    </Center>
  );
}
