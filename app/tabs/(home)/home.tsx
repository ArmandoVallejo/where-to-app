import React from "react";
import Gradient from "@/assets/icons/Gradient";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { useRouter } from "expo-router";

// "/tabs/home"
export default function Home() {
  const router = useRouter();
  return (
    <Box className="flex-1 bg-background-300 h-[100vh]">
      <Box className="absolute h-[500px] w-[500px] lg:w-[700px] lg:h-[700px]">
        <Gradient />
      </Box>

      <Box className="flex flex-1 items-center mx-5 lg:my-24 lg:mx-32 py-safe">
        <Box className="flex-1 justify-center items-center h-[20px] w-[300px] lg:h-[160px] lg:w-[400px]">
          <Text className="text-center text-typography-950">
            Pantalla de home
          </Text>
          <Text className="text-center text-typography-950">
            Descripción = donde se van a ver la lista de eventos / o clases
            dependiendo del edificio seleccionado
          </Text>
          <Text className="text-center text-typography-950">
            {"<Pantalla de home aquí>"}
          </Text>
          <Text className="text-center text-typography-950">
            Directorio = ./app/tabs/(home)/home.tsx
          </Text>
          <Text className="text-center text-typography-950">ruta = "/tabs/home"</Text>
          <Button
            size="lg"
            className="rounded-lg mt-2"
            onPress={() => {
              router.replace("/");
            }}
          >
            <ButtonText>Botón temporal de Log Out</ButtonText>
          </Button>
          <Button
            size="lg"
            className="rounded-lg mt-2"
            onPress={() => {
              router.push("/tabs/MDScreen");
            }}
          >
            <ButtonText>Material Design Screen</ButtonText>
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
