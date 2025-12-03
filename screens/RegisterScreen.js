import React, { useState } from "react";
import { Image, Alert } from "react-native";
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
} from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft } from "lucide-react-native";
import { ref, query, orderByChild, equalTo, get, push } from 'firebase/database';
import { db } from '../config/config';
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from 'react-i18next';

export default function RegisterScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const { t } = useTranslation();
  const [control, setControl] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validateControlNumber = (value) => {
    const regex = /^[Cc]?\d{8,9}$/;
    return regex.test(value);
  };

  const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  const validatePassword = (value) => {
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*.,?_=+-]).{6,}$/;
    return regex.test(value);
  };

  const handleRegister = async () => {
    // Validaciones
    if (
      !control.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      Alert.alert("Error", "Por favor llena todos los campos");
      return;
    }

    if (!validateControlNumber(control)) {
      Alert.alert(
        "Error",
        'El número de control debe tener 8-9 caracteres y puede comenzar con "C"'
      );
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Error", "Por favor ingresa un email válido");
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert(
        "Error",
        "La contraseña debe contener al menos una mayúscula, una minúscula y un carácter especial"
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(t('register.error'), t('register.passwords_mismatch'));
      return;
    }

    setLoading(true);

    try {
      // Verificar si el usuario ya existe
      const usersRef = ref(db, "users");
      const controlQuery = query(
        usersRef,
        orderByChild("control"),
        equalTo(control)
      );
      const controlSnapshot = await get(controlQuery);

      if (controlSnapshot.exists()) {
        Alert.alert("Error", "Este número de control ya está registrado");
        setLoading(false);
        return;
      }

      // Verificar si el email ya existe
      const emailQuery = query(usersRef, orderByChild("email"), equalTo(email));
      const emailSnapshot = await get(emailQuery);

      if (emailSnapshot.exists()) {
        Alert.alert("Error", "Este email ya está registrado");
        setLoading(false);
        return;
      }

      // Crear nuevo usuario
      const newUser = {
        control: control.trim(),
        email: email.trim().toLowerCase(),
        password: password, // En producción, hashea esto
        role: "student",
        createdAt: new Date().toISOString(),
      };

      await push(usersRef, newUser);

      console.log("✅ Usuario registrado:", newUser);

      Alert.alert(
        "Registro exitoso",
        "Tu cuenta ha sido creada correctamente",
        [
          {
            text: "OK",
            onPress: () => navigation.replace("Login"),
          },
        ]
      );
    } catch (error) {
      console.error("❌ Error en registro:", error);
      Alert.alert("Error", "Ocurrió un error al crear la cuenta");
    } finally {
      setLoading(false);
    }
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
          source={require("../assets/avatar.png")}
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            borderWidth: 2,
            borderColor: "#A855F7", // morado
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
          <Button
            bg="$purple600"
            borderRadius="$md"
            mt="$2"
            onPress={handleRegister}
          >
            <ButtonText color="$white">{t('register.register_button')}</ButtonText>
          </Button>
        </VStack>
      </Card>
    </Center>
  );
}
