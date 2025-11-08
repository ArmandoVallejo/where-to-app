import React from "react";
import Gradient from "@/assets/icons/Gradient";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { useRouter } from "expo-router";

// "/places"
export default function Places() {
  const router = useRouter();
  return (
    <Box className="flex-1 bg-background-300 h-[100vh]">
      <Box className="absolute h-[500px] w-[500px] lg:w-[700px] lg:h-[700px]">
        <Gradient />
      </Box>

      <Box className="flex flex-1 items-center mx-5 lg:my-24 lg:mx-32 py-safe">
        <Box className="flex-1 justify-center items-center h-[20px] w-[300px] lg:h-[160px] lg:w-[400px]">
          <Text className="text-center text-typography-950">
            Pantalla de lugares
          </Text>
          <Text className="text-center text-typography-950">
            {"<Pantalla de lugares aquí>"}
          </Text>
          <Text className="text-center text-typography-950">
            Directorio = ./app/places.tsx
          </Text>
          <Text className="text-center text-typography-950">ruta = "/places"</Text>
          <Button size="lg" className="rounded-lg mt-2" onPress={() => { router.back()}}>
            <ButtonText>Regresar a register</ButtonText>
          </Button>
          
        </Box>
      </Box>
    </Box>
  );
}
