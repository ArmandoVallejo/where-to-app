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
  Pressable,
  Heading,
  Card,
} from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import { ref, query, orderByChild, equalTo, get } from 'firebase/database';
import { db } from "../config/config";

export default function LoginScreen() {
  const navigation = useNavigation();
  const [control, setControl] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validateControlNumber = (value) => {
    const regex = /^[Cc]?\d{8,9}$/;
    return regex.test(value);
  };

  const validatePassword = (value) => {
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*.,?_=+-]).{6,}$/;
    return regex.test(value);
  };

  const handleLogin = async () => {
    if (!control.trim() || !password.trim()) {
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

    if (!validatePassword(password)) {
      Alert.alert(
        "Error",
        "La contraseña debe contener al menos una mayúscula, una minúscula y un carácter especial"
      );
      return;
    }

    setLoading(true);

    try {
      // Buscar usuario por número de control
      const usersRef = ref(db, "users");
      const userQuery = query(
        usersRef,
        orderByChild("control"),
        equalTo(control)
      );
      const snapshot = await get(userQuery);

      if (!snapshot.exists()) {
        Alert.alert("Error", "Usuario no encontrado");
        setLoading(false);
        return;
      }

      // Obtener los datos del usuario
      const userData = Object.values(snapshot.val())[0];
      const userId = Object.keys(snapshot.val())[0];

      // Verificar contraseña
      if (userData.password !== password) {
        Alert.alert("Error", "Contraseña incorrecta");
        setLoading(false);
        return;
      }

      // Login exitoso
      console.log("✅ Login exitoso:", userData);

      Alert.alert("Bienvenido", `Hola ${userData.control}`, [
        {
          text: "OK",
          onPress: () =>
            navigation.replace("Main", {
              user: {
                id: userId,
                ...userData,
              },
            }),
        },
      ]);
    } catch (error) {
      console.error("❌ Error en login:", error);
      Alert.alert("Error", "Ocurrió un error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Center flex={1} bg="$white">
      {/* Imagen superior */}
      <Box alignItems="center" mb="$4">
        <Image
          source={require("../assets/avatar.png")}
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
          Welcome
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

          {/* Botón Sign In */}
          <Button
            bg="$purple600"
            borderRadius="$md"
            mt="$2"
            onPress={handleLogin}
          >
            <ButtonText color="$white">Sign In</ButtonText>
          </Button>

          {/* Texto Create one */}
          <Center>
            <Text color="$black">
              Don´t have an account yet?{" "}
              <Pressable onPress={() => navigation.navigate("Register")}>
                <Text color="$purple600" bold>
                  Create one
                </Text>
              </Pressable>
            </Text>
          </Center>
        </VStack>
      </Card>
    </Center>
  );
}
