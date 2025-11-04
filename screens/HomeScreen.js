import { SafeAreaView } from "react-native-safe-area-context";

import { View, Text } from "react-native";

export default function HomeScreen() {
  return (
	<SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
	  <View>
		<Text>Welcome to the Home Screen!</Text>
	  </View>
	</SafeAreaView>
  );
}