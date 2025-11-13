import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  FAB,
  Modal,
  Portal,
  Text,
  Button,
  TextInput,
  Divider,
  List,
  IconButton,
} from 'react-native-paper';
import { DatePickerInput, TimePickerModal } from 'react-native-paper-dates';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Admin = () => {
  const [newEventModalVisible, setNewEventModalVisible] = useState(false);
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const [eventName, setEventName] = useState('');
  const [category, setCategory] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [date, setDate] = useState(undefined);
  const [time, setTime] = useState({ hours: 12, minutes: 0 });
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [description, setDescription] = useState('');

  const onAddEventHandler = () => setNewEventModalVisible(true);
  const onDismissNewEventModal = () => setNewEventModalVisible(false);

  const onSaveEvent = () => {
    console.log({
      eventName,
      category,
      date,
      time: `${time.hours}:${String(time.minutes).padStart(2, '0')}`,
      description,
    });
    setNewEventModalVisible(false);
  };

  const onConfirmTime = ({ hours, minutes }) => {
    setTime({ hours, minutes });
    setTimePickerVisible(false);
  };

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        {/* Botón flotante */}
        <FAB
          style={styles.fab}
          icon="plus"
          size="medium"
          onPress={onAddEventHandler}
        />

        {/* Botón de opciones */}
        <IconButton
          icon="dots-vertical"
          size={30}
          onPress={() => setOptionsModalVisible(true)}
          style={{ position: 'absolute', right: 20, top: 40 }}
        />

        <Portal>
          {/* Modal principal para crear evento */}
          <Modal
            visible={newEventModalVisible}
            onDismiss={onDismissNewEventModal}
            contentContainerStyle={styles.modalContainer}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.title}>Nuevo evento</Text>
              <Divider style={styles.divider} />

              {/* Nombre */}
              <TextInput
                label="Nombre del evento"
                value={eventName}
                onChangeText={setEventName}
                mode="outlined"
                style={styles.roundedInput}
                theme={{ roundness: 20 }}
              />

              {/* Categoría */}
              <View style={styles.block}>
                <List.Section>
                  <List.Accordion
                    title={
                      category
                        ? `Categoría: ${category}`
                        : 'Seleccionar categoría'
                    }
                    expanded={expanded}
                    onPress={() => setExpanded(!expanded)}
                    left={(props) => <List.Icon {...props} icon="folder" />}
                    style={styles.accordion}
                  >
                    {['Académico', 'Deportivo', 'Servicio social', 'Otro'].map(
                      (item) => (
                        <List.Item
                          key={item}
                          title={item}
                          onPress={() => {
                            setCategory(item);
                            setExpanded(false);
                          }}
                        />
                      )
                    )}
                  </List.Accordion>
                </List.Section>
              </View>

              {/* Fecha */}
              <View style={styles.block}>
                <DatePickerInput
                  locale="es"
                  label="Fecha del evento"
                  value={date}
                  onChange={(d) => setDate(d)}
                  inputMode="start"
                  mode="outlined"
                  style={styles.roundedInput}
                  theme={{ roundness: 20 }}
                />
              </View>

              {/* Hora */}
              <View style={styles.block}>
                <Button
                  mode="outlined"
                  icon="clock"
                  onPress={() => setTimePickerVisible(true)}
                  style={styles.roundedButton}
                  labelStyle={{ textTransform: 'none' }}
                >
                  {time
                    ? `Hora seleccionada: ${String(time.hours).padStart(
                        2,
                        '0'
                      )}:${String(time.minutes).padStart(2, '0')}`
                    : 'Seleccionar hora'}
                </Button>
              </View>

              {/* Descripción */}
              <TextInput
                label="Descripción"
                value={description}
                onChangeText={setDescription}
                mode="outlined"
                multiline
                numberOfLines={8}
                style={[styles.roundedInput, styles.textArea]}
                theme={{ roundness: 20 }}
              />

              {/* Botones */}
              <View style={styles.buttonRow}>
                <Button
                  mode="outlined"
                  onPress={onDismissNewEventModal}
                  style={styles.roundedButton}
                >
                  Cancelar
                </Button>
                <Button
                  mode="contained"
                  onPress={onSaveEvent}
                  style={[styles.roundedButton, { backgroundColor: '#6200ee' }]}
                >
                  Guardar
                </Button>
              </View>
            </ScrollView>
          </Modal>

          {/* Modal de hora */}
          <TimePickerModal
            visible={timePickerVisible}
            onDismiss={() => setTimePickerVisible(false)}
            onConfirm={onConfirmTime}
            hours={time.hours}
            minutes={time.minutes}
            locale="es"
          />
        </Portal>
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 20,
    bottom: 40,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 25,
    marginHorizontal: 20,
    borderRadius: 20,
    maxHeight: '85%',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'start',
  },
  divider: {
    marginBottom: 20,
  },
  roundedInput: {
    marginBottom: 20,
    borderRadius: 20,
  },
  block: {
    marginBottom: 20,
  },
  accordion: {
    backgroundColor: '#f7f7f7',
    borderRadius: 20,
  },
  textArea: {
    height: 140,
    textAlignVertical: 'top',
  },
  roundedButton: {
    borderRadius: 20,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 10,
  },
});

export default Admin;
