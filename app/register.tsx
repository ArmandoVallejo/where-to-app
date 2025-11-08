import Gradient from "@/assets/icons/Gradient";
import { Box } from "@/components/ui/box";
import { router } from "expo-router";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";

// "/register"
export default function register() {
  return (
    <Box className="flex-1 bg-background-300 h-[100vh]">
      <Box className="absolute h-[500px] w-[500px] lg:w-[700px] lg:h-[700px]">
        <Gradient />
      </Box>

      <Box className="flex flex-1 items-center mx-5 lg:my-24 lg:mx-32 py-safe">
        <Box className="flex-1 justify-center items-center h-[20px] w-[300px] lg:h-[160px] lg:w-[400px]">
          <Text className="text-center text-typography-950">
            Pantalla de registro
          </Text>
          <Text className="text-center text-typography-950">
            {"<Pantalla de login aquí>"}
          </Text>
          <Text className="text-center text-typography-950">
            Directorio = ./app/register.tsx
          </Text>
          <Text className="text-center text-typography-950">
            ruta = "/register"
          </Text>
          <Box className="items-center mt-6">
            <Button
              size="lg"
              className="rounded-lg mt-2"
              onPress={() => {
                router.push("/places");
              }}
            >
              <ButtonText>ver lista de lugares</ButtonText>
            </Button>
            <Button
              size="lg"
              className="rounded-lg mt-2"
              onPress={() => {
                router.replace("/tabs/home");
              }}
            >
              <ButtonText>Botón temporal de registro</ButtonText>
            </Button>
            <Text className="text-typography-500 text-sm">
              ¿Ya tienes una cuenta?{" "}
              <Text
                className="text-primary-500 font-semibold"
                onPress={() => router.back()}
              >
                Inicia Sesión
              </Text>
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
