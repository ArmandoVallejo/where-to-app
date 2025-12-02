import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Surface, IconButton, Button } from "react-native-paper";
import { CameraView, Camera } from "expo-camera";
import { useTranslation } from 'react-i18next';

const { width, height } = Dimensions.get("window");

export default function QRScannerScreen({ navigation, route }) {
  const { t } = useTranslation();
  const [hasPermission, setHasPermission] = useState(null);
  const [flashOn, setFlashOn] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(true);
  const eventTitle = route?.params?.eventTitle || t('qr_scanner.event');
  const cameraRef = useRef(null);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    } catch (error) {
      console.error("Error requesting camera permission:", error);
      Alert.alert(t('qr_scanner.error'), t('qr_scanner.camera_error'));
    }
  };

  const toggleFlash = () => {
    setFlashOn(!flashOn);
  };

  const handleBarCodeScanned = ({ type, data }) => {
    if (!scanning || scanned) return;

    setScanned(true);
    setScanning(false);

    Alert.alert(
      t('qr_scanner.qr_scanned'),
      `${t('qr_scanner.type')}: ${type}\n${t('qr_scanner.data')}: ${data}\n${t('qr_scanner.event')}: ${eventTitle}`,
      [
        {
          text: t('qr_scanner.scan_another'),
          onPress: () => {
            setScanned(false);
            setScanning(true);
          },
        },
        {
          text: t('qr_scanner.confirm_attendance'),
          onPress: () => {
            // Here you would typically call an API to register attendance
            Alert.alert(
              t('qr_scanner.attendance_registered'),
              t('qr_scanner.attendance_confirmed').replace('{eventTitle}', eventTitle),
              [
                {
                  text: t('qr_scanner.ok'),
                  onPress: () => navigation.goBack(),
                },
              ]
            );
          },
        },
      ]
    );
  };

  const handleManualEntry = () => {
    Alert.prompt(
      t('qr_scanner.manual_entry'),
      t('qr_scanner.enter_code'),
      [
        {
          text: t('qr_scanner.cancel'),
          style: "cancel",
        },
        {
          text: t('qr_scanner.confirm'),
          onPress: (code) => {
            if (code && code.trim()) {
              Alert.alert(
                t('qr_scanner.code_entered'),
                `${t('qr_scanner.code')}: ${code}\n${t('qr_scanner.event')}: ${eventTitle}`,
                [
                  {
                    text: t('qr_scanner.ok'),
                    onPress: () => navigation.goBack(),
                  },
                ]
              );
            }
          },
        },
      ],
      "plain-text"
    );
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#6B46C1" />
          <Text style={styles.loadingText}>{t('qr_scanner.requesting_permission')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />

        <Surface style={styles.header} elevation={0}>
          <IconButton
            icon="arrow-left"
            size={24}
            iconColor="#fff"
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.headerTitle}>{t('qr_scanner.title')}</Text>
          <View style={{ width: 48 }} />
        </Surface>

        <View style={styles.centerContent}>
          <Ionicons name="camera-off" size={80} color="#666" />
          <Text style={styles.errorTitle}>{t('qr_scanner.permission_denied')}</Text>
          <Text style={styles.errorText}>
            {t('qr_scanner.permission_needed')}
          </Text>
          <Button
            mode="contained"
            onPress={requestCameraPermission}
            style={styles.retryButton}
            buttonColor="#6B46C1"
          >
            {t('qr_scanner.request_again')}
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header */}
      <Surface style={styles.header} elevation={0}>
        <IconButton
          icon="arrow-left"
          size={24}
          iconColor="#fff"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>{t('qr_scanner.title')}</Text>
        {/* <IconButton
          icon={flashOn ? "flash" : "flash-off"}
          size={24}
          iconColor="#fff"
          onPress={toggleFlash}
        /> */}
      </Surface>

      {/* Camera View */}
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFillObject}
          facing="back"
          flash={flashOn ? "on" : "off"}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          onBarcodeScanned={scanning ? handleBarCodeScanned : undefined}
        />

        {/* Overlay with scan frame */}
        <View style={styles.overlay}>
          <View style={styles.overlayTop} />

          <View style={styles.scanArea}>
            <View style={styles.scanCornerTopLeft} />
            <View style={styles.scanCornerTopRight} />
            <View style={styles.scanCornerBottomLeft} />
            <View style={styles.scanCornerBottomRight} />

            {/* Scanning line animation */}
            {scanning && (
              <View style={styles.scanLineContainer}>
                <View style={styles.scanLine} />
              </View>
            )}

            {scanned && (
              <View style={styles.scannedIndicator}>
                <Ionicons name="checkmark-circle" size={60} color="#10B981" />
              </View>
            )}
          </View>

          <View style={styles.overlayBottom}>
            <Text style={styles.instructionText}>
              {scanning
                ? t('qr_scanner.place_qr')
                : t('qr_scanner.code_detected')}
            </Text>
            <Text style={styles.eventText}>{t('qr_scanner.event')}: {eventTitle}</Text>
          </View>
        </View>
      </View>

      {/* Bottom Actions */}
      {/* <Surface style={styles.bottomContainer} elevation={4}>
        <Button
          mode="outlined"
          onPress={handleManualEntry}
          style={styles.manualButton}
          textColor="#6B46C1"
          icon="keyboard"
        >
          Ingresar código manualmente
        </Button>

        <View style={styles.helpContainer}>
          <Ionicons name="information-circle-outline" size={20} color="#666" />
          <Text style={styles.helpText}>
            Asegúrate de tener buena iluminación
          </Text>
        </View>
      </Surface> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
    paddingHorizontal: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    flex: 1,
    textAlign: "center",
  },
  cameraContainer: {
    flex: 1,
    position: "relative",
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    paddingHorizontal: 40,
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 16,
  },
  errorTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 12,
    textAlign: "center",
  },
  errorText: {
    color: "#999",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  retryButton: {
    borderRadius: 8,
    marginTop: 8,
  },
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
  overlayTop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  scanArea: {
    width: 280,
    height: 280,
    alignSelf: "center",
    position: "relative",
  },
  scanCornerTopLeft: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 40,
    height: 40,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: "#6B46C1",
    borderTopLeftRadius: 8,
  },
  scanCornerTopRight: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: "#6B46C1",
    borderTopRightRadius: 8,
  },
  scanCornerBottomLeft: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 40,
    height: 40,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: "#6B46C1",
    borderBottomLeftRadius: 8,
  },
  scanCornerBottomRight: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: "#6B46C1",
    borderBottomRightRadius: 8,
  },
  scanLineContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  scanLine: {
    width: "90%",
    height: 2,
    backgroundColor: "#6B46C1",
    shadowColor: "#6B46C1",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  scannedIndicator: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -30 }, { translateY: -30 }],
  },
  instructionText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 8,
    fontWeight: "500",
  },
  eventText: {
    color: "#A855F7",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "600",
  },
  bottomContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  manualButton: {
    borderRadius: 8,
    borderColor: "#6B46C1",
    marginBottom: 16,
  },
  helpContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  helpText: {
    color: "#666",
    fontSize: 13,
  },
});
