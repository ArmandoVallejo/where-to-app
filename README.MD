# Where-To 📍

Where-To es una aplicación móvil desarrollada en React Native que permite a los estudiantes y personal del Tecnológico descubrir eventos y salones en tiempo real mediante detección de beacons BLE (Bluetooth Low Energy). La app detecta automáticamente tu ubicación dentro del campus utilizando beacons ESP32 y te muestra información relevante sobre el edificio en el que te encuentras.

## 📋 Requisitos previos

- Node.js (v16 o superior)
- npm o yarn
- Expo CLI (`npm install -g expo-cli`)
- Cuenta de Firebase
- Dispositivo Android físico o emulador
- (Opcional) ESP32 para beacons físicos

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/ArmandoVallejo/where-to-app
cd where-to-app
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar Firebase

#### a) Crear proyecto en Firebase

1. Ve a Firebase Console: <https://console.firebase.google.com/>
2. Crea un nuevo proyecto
3. Habilita Realtime Database
4. Ve a Project Settings y copia las credenciales

#### b) Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto con tus credenciales de Firebase:

```env
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_DATABASE_URL=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=
PRODUCT_NAME=
```

#### c) Configurar reglas de Firebase

En Firebase Console, ve a Realtime Database y luego a Rules. Configura las siguientes reglas:

``` json
{
  "rules": {
    "edificios": {
      ".read": true,
      ".write": true
    },
    "users": {
      ".read": true,
      ".write": true,
      ".indexOn": ["control", "email"]
    }
  }
}
```

### 4. Ejecutar la seed

La aplicación incluye datos iniciales (edificios y usuario administrador) que puedes cargar ejecutando:

La seed creará:

- Edificios de ejemplo con sus direcciones MAC de beacons
- Usuario administrador con credenciales:
  - No. Control: `11111111`
  - Password: `Hola1234#`

**Nota:** Solo necesitas ejecutar la seed una vez. Después de la primera ejecución, comenta o elimina la llamada a `runSeed()`.

### 5. Ejecutar la aplicación

```bash
npx expo start

npx expo run:android
```

## 📱 Uso de la aplicación

### Login

- Ingresa con el usuario administrador (ver credenciales arriba)
- O crea una nueva cuenta desde "Create one"

### Detección de beacons

- La app detecta automáticamente beacons cercanos
- Cuando te acercas a un edificio configurado, aparece un modal
- Puedes aceptar cambiar tu ubicación actual al edificio detectado

### Navegación

- Home: Ver eventos y filtrar por categorías
- Lugares: Explorar edificios del campus
- Perfil: Ver tu información y cerrar sesión

## 📂 Estructura del proyecto

``` a
where-to-app/
├── assets/
├── components/
├── config/
│   ├── seed.js
│   └── config.js
├── screens/
│   ├── HomeScreen.js
│   ├── LoginScreen.js
│   ├── RegisterScreen.js
│   └── ...
├── .env
├── .gitignore
├── App.js
├── app.json
└── package.json
```

## 🗄️ Estructura de Firebase

``` a
firebase-database/
├── edificios/
│   ├── -xxxxx/
│   │   ├── mac: "76:A1:2B:7F:24:3E"
│   │   └── name: "Centro de computo"
│   └── -yyyyy/
│       ├── mac: "D1:09:1A:DA:9D:2E"
│       └── name: "Salones A-C"
└── users/
    └── -zzzzz/
        ├── control: "11111111"
        ├── email: "admin@tec.mx"
        ├── password: "Hola1234#"
        ├── role: "admin"
        └── createdAt: "2025-01-15T..."
```
