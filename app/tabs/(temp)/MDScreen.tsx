import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, StyleSheet } from "react-native";
import {
  Text,
  Button,
  TextInput,
  Card,
  Avatar,
  Checkbox,
  RadioButton,
  Switch,
  Snackbar,
  ActivityIndicator,
  ProgressBar,
  Divider,
  IconButton,
  FAB,
  Chip,
  List,
  Menu,
  SegmentedButtons,
} from "react-native-paper";

export default function MaterialDesignScreen() {
  const [text, setText] = useState("");
  const [checked, setChecked] = useState(false);
  const [radio, setRadio] = useState("first");
  const [switchOn, setSwitchOn] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [segmented, setSegmented] = useState("one");

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text variant="headlineLarge" style={styles.title}>
          Material Design Components
        </Text>

        <Card style={styles.card}>
          <Card.Title
            title="Card Title"
            subtitle="Card Subtitle"
            left={(props) => <Avatar.Icon {...props} icon="folder" />}
          />
          <Card.Content>
            <Text variant="bodyMedium">
              Este es un Card de Material Design.
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button onPress={() => setSnackbarVisible(true)}>Acción</Button>
          </Card.Actions>
        </Card>

        <Divider style={styles.divider} />

        <TextInput
          label="Input de texto"
          value={text}
          onChangeText={setText}
          mode="outlined"
          style={styles.input}
        />

        {/* Checkbox, Radios, Switch */}
        <View style={styles.row}>
          <Checkbox
            status={checked ? "checked" : "unchecked"}
            onPress={() => setChecked(!checked)}
          />
          <Text>Checkbox</Text>

          <RadioButton
            value="first"
            status={radio === "first" ? "checked" : "unchecked"}
            onPress={() => setRadio("first")}
          />
          <Text>Radio 1</Text>

          <RadioButton
            value="second"
            status={radio === "second" ? "checked" : "unchecked"}
            onPress={() => setRadio("second")}
          />
          <Text>Radio 2</Text>

          <Switch
            value={switchOn}
            onValueChange={setSwitchOn}
            style={{ marginLeft: 16 }}
          />
          <Text style={{ marginLeft: 8 }}>Switch</Text>
        </View>

        {/* IconButton, Chip, FAB */}
        <View style={styles.row}>
          <IconButton icon="camera" size={24} onPress={() => {}} />
          <Chip icon="information" onPress={() => {}}>
            Chip
          </Chip>
          <FAB
            icon="plus"
            style={{ marginLeft: 16 }}
            onPress={() => {}}
            size="small"
          />
        </View>

        {/* Menú */}
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button onPress={() => setMenuVisible(true)}>Mostrar menú</Button>
          }
        >
          <Menu.Item onPress={() => {}} title="Opción 1" />
          <Menu.Item onPress={() => {}} title="Opción 2" />
        </Menu>

        {/* Botones segmentados */}
        <SegmentedButtons
          value={segmented}
          onValueChange={setSegmented}
          buttons={[
            { value: "one", label: "Uno" },
            { value: "two", label: "Dos" },
            { value: "three", label: "Tres" },
          ]}
          style={{ marginVertical: 16 }}
        />

        {/* Indicadores */}
        <ActivityIndicator animating={true} style={styles.spacing} />
        <ProgressBar progress={0.5} style={styles.spacing} />

        {/* Lista */}
        <List.Section>
          <List.Item
            title="Elemento de lista 1"
            left={(props) => <List.Icon {...props} icon="folder" />}
          />
          <List.Item
            title="Elemento de lista 2"
            left={(props) => <List.Icon {...props} icon="star" />}
          />
        </List.Section>

        <Button
          mode="contained"
          onPress={() => setSnackbarVisible(true)}
          style={styles.button}
        >
          Botón principal
        </Button>

        {/* Snackbar */}
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          action={{
            label: "OK",
            onPress: () => setSnackbarVisible(false),
          }}
        >
          ¡Snackbar de Material Design!
        </Snackbar>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    flexWrap: "wrap",
  },
  divider: {
    marginVertical: 8,
  },
  spacing: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
});
