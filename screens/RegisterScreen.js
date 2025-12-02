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
import { ArrowLeft } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

export default function RegisterScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [control, setControl] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    if (!control.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert(t('register.error'), t('register.fill_fields'));
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(t('register.error'), t('register.passwords_mismatch'));
      return;
    }

    Alert.alert(t('register.success_title'), t('register.success_message'), [
      { text: 'OK', onPress: () => navigation.replace('Main') },
    ]);
  };

  return (
    <Center flex={1} bg="$white">
      {/* Botón de regresar */}
      <Box position="absolute" top="$10" left="$5">
        <Pressable onPress={() => navigation.goBack()}>
          <ArrowLeft size={40} color="#000" />
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
          {t('register.title')}
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
              {t('register.control_number')}
            </Text>
            <Input borderColor="$gray300" borderRadius="$md">
              <InputField
                placeholder={t('register.placeholder')}
                value={control}
                onChangeText={setControl}
                autoCapitalize="none"
              />
            </Input>
          </Box>

          {/* Campo Email */}
          <Box>
            <Text mb="$2" color="$black">
              {t('register.email')}
            </Text>
            <Input borderColor="$gray300" borderRadius="$md">
              <InputField
                placeholder={t('register.placeholder')}
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
              {t('register.password')}
            </Text>
            <Input borderColor="$gray300" borderRadius="$md">
              <InputField
                placeholder={t('register.placeholder')}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </Input>
          </Box>

          {/* Campo Confirm Password */}
          <Box>
            <Text mb="$2" color="$black">
              {t('register.confirm_password')}
            </Text>
            <Input borderColor="$gray300" borderRadius="$md">
              <InputField
                placeholder={t('register.placeholder')}
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </Input>
          </Box>

          {/* Botón Register */}
          <Button bg="$purple600" borderRadius="$md" mt="$2" onPress={handleRegister}>
            <ButtonText color="$white">{t('register.register_button')}</ButtonText>
          </Button>
        </VStack>
      </Card>
    </Center>
  );
}
