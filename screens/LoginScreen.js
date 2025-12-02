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
  Pressable,
  Heading,
  Card,
} from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

export default function LoginScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [control, setControl] = useState('');
  const [password, setPassword] = useState('');

  // Simulación de usuario válido
  const validUser = {
    control: '11111111',
    password: 'Hola1234#',
  };


  const validateControlNumber = (value) => {
    // Acepta: "19151677", "C19151677", "c19151677"
    const regex = /^[Cc]?\d{8,9}$/;
    return regex.test(value);
  };

  const validatePassword = (value) => {
    // Debe tener al menos: 1 mayúscula, 1 minúscula, 1 carácter especial
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*.,?_=+-]).{6,}$/;
    return regex.test(value);
  };

  const handleLogin = () => {
    if (!control.trim() || !password.trim()) {
      Alert.alert(t('login.error'), t('login.fill_fields'));
      return;
    }

    if (!validateControlNumber(control)) {
      Alert.alert(
        t('login.error'),
        t('login.invalid_control')
      );
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert(
        t('login.error'),
        t('login.invalid_password')
      );
      return;
    }

    // Validación de credenciales simuladas
    if (control === validUser.control && password === validUser.password) {
      Alert.alert(t('login.welcome'), t('login.login_success'), [
        { text: 'OK', onPress: () => navigation.navigate('Main') },
      ]);
    } else {
      Alert.alert(t('login.error'), t('login.invalid_credentials'));
    }
  };

  return (
    <Center flex={1} bg="$white">
      {/* Imagen superior */}
      <Box alignItems="center" mb="$4">
        <Image
          source={require('../assets/avatar.png')}
          style={{
            width: 150,
            height: 150,
            borderRadius: 75,
          }}
        />
      </Box>

      {/* Texto Welcome */}
      <Box mb="$5">
        <Heading size="lg" textAlign="center">
          {t('login.welcome')}
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
              {t('login.control_number')}
            </Text>
            <Input borderColor="$gray300" borderRadius="$md">
              <InputField
                placeholder={t('login.placeholder')}
                value={control}
                onChangeText={setControl}
                autoCapitalize="none"
              />
            </Input>
          </Box>

          {/* Campo Password */}
          <Box>
            <Text mb="$2" color="$black">
              {t('login.password')}
            </Text>
            <Input borderColor="$gray300" borderRadius="$md">
              <InputField
                placeholder={t('login.placeholder')}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </Input>
          </Box>

          {/* Botón Sign In */}
          <Button bg="$purple600" borderRadius="$md" mt="$2" onPress={handleLogin}>
            <ButtonText color="$white">{t('login.sign_in')}</ButtonText>
          </Button>

          {/* Texto Create one */}
          <Center>
            <Text color="$black">
              {t('login.no_account')}{' '}
              <Pressable onPress={() => navigation.navigate('Register')}>
                <Text color="$purple600" bold>
                  {t('login.create_one')}
                </Text>
              </Pressable>
            </Text>
          </Center>
        </VStack>
      </Card>
    </Center>
  );
}
