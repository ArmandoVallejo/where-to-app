# Theme Implementation Guide

## Overview
This application now features a complete light/dark theme system with persistent storage using React Context and AsyncStorage.

## Architecture

### ThemeContext (`/context/ThemeContext.js`)
Central theme management using React Context API:
- **ThemeProvider**: Wraps the entire app to provide theme access
- **useTheme()**: Custom hook to access theme in any component
- **Persistent Storage**: Theme preference saved to AsyncStorage
- **React Native Paper Integration**: Full compatibility with Material Design components

### Theme Colors

#### Light Theme
```javascript
{
  primary: '#6B46C1',      // Purple primary
  secondary: '#A855F7',    // Light purple
  tertiary: '#E9D5FF',     // Very light purple
  background: '#f9fafb',   // Light gray background
  surface: '#ffffff',      // White surface
  surfaceVariant: '#f3f4f6', // Light gray variant
  error: '#dc2626',        // Red
  success: '#16a34a',      // Green
  text: '#1f2937',         // Dark text
  textSecondary: '#6b7280', // Gray text
  border: '#e5e7eb',       // Light border
  card: '#ffffff'          // White cards
}
```

#### Dark Theme
```javascript
{
  primary: '#A855F7',      // Lighter purple for dark mode
  secondary: '#6B46C1',    // Darker purple
  tertiary: '#4C1D95',     // Very dark purple
  background: '#111827',   // Very dark background
  surface: '#1f2937',      // Dark surface
  surfaceVariant: '#374151', // Medium dark variant
  error: '#ef4444',        // Brighter red
  success: '#22c55e',      // Brighter green
  text: '#f9fafb',         // Light text
  textSecondary: '#9ca3af', // Medium gray text
  border: '#374151',       // Dark border
  card: '#1f2937'          // Dark cards
}
```

## Implementation

### 1. App.js Setup
```javascript
import { ThemeProvider, useTheme } from "./context/ThemeContext";

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const { theme } = useTheme();
  
  return (
    <PaperProvider theme={theme}>
      {/* Your navigation and screens */}
    </PaperProvider>
  );
}
```

### 2. Using Theme in Components
```javascript
import { useTheme } from '../context/ThemeContext';

export default function MyScreen() {
  const { theme, isDarkMode, toggleTheme, setTheme } = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.text }}>Hello</Text>
    </View>
  );
}
```

### 3. Theme Properties
- `theme`: Current theme object with all colors
- `isDarkMode`: Boolean indicating if dark mode is active
- `toggleTheme()`: Function to toggle between light/dark
- `setTheme(themeName)`: Set theme by name ('Claro' or 'Oscuro')

## Updated Screens

### Fully Themed Screens
1. **ProfileScreen.js**: Complete theme integration including all modals
2. **HomeScreen.js**: Event feed, header, bottom nav, and event cards
3. **HistoryScreen.js**: Event history with themed components
4. **LoginScreen.js**: Theme support added
5. **RegisterScreen.js**: Theme support added

### Theme Changes in ProfileScreen
- Dynamic background colors
- Theme selector modal (Claro/Oscuro)
- Persists selection across app restarts
- All text, icons, and surfaces adapt to theme
- Modal dialogs (Language, Theme, Edit Profile, Change Password)

### Theme Changes in HomeScreen
- Header with theme colors
- Event cards with dynamic text colors
- Bottom navigation bar themed
- StatusBar adapts to theme

### Theme Changes in HistoryScreen
- Location headers themed
- Event cards with dynamic colors
- Bottom navigation matches theme
- StatusBar adapts to theme

## How to Switch Themes

### Method 1: ProfileScreen UI
1. Navigate to Profile (Perfil)
2. Tap "Tema" option
3. Select "Claro" or "Oscuro"
4. Theme changes immediately and persists

### Method 2: Programmatically
```javascript
const { setTheme, toggleTheme } = useTheme();

// Set specific theme
setTheme('Oscuro'); // or 'Claro'

// Toggle between themes
toggleTheme();
```

## Best Practices

### 1. Always use theme colors
❌ Don't: `color: '#000'`
✅ Do: `color: theme.colors.text`

### 2. Apply theme to containers
```javascript
<View style={[styles.container, { backgroundColor: theme.colors.background }]}>
```

### 3. Update StatusBar
```javascript
<StatusBar 
  barStyle={theme.dark ? "light-content" : "dark-content"} 
  backgroundColor={theme.colors.primary} 
/>
```

### 4. Use conditional styling for icons
```javascript
<Ionicons 
  name="icon-name" 
  color={theme.colors.text} 
/>
```

### 5. Theme-aware borders and dividers
```javascript
<View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
```

## Adding Theme to New Screens

1. Import the hook:
```javascript
import { useTheme } from '../context/ThemeContext';
```

2. Use in component:
```javascript
const { theme } = useTheme();
```

3. Apply to components:
```javascript
<View style={{ backgroundColor: theme.colors.surface }}>
  <Text style={{ color: theme.colors.text }}>Content</Text>
</View>
```

## React Native Paper Integration

React Native Paper components automatically adapt to the theme:
```javascript
<Button mode="contained" buttonColor={theme.colors.primary}>
  Click Me
</Button>

<Card style={{ backgroundColor: theme.colors.card }}>
  <Card.Content>
    <Text style={{ color: theme.colors.text }}>Card Content</Text>
  </Card.Content>
</Card>
```

## Storage

Theme preference is stored in AsyncStorage with key: `@app_theme`
- Values: `'light'` or `'dark'`
- Automatically loaded on app start
- Persists across app restarts

## Testing

1. Change theme in ProfileScreen
2. Navigate between screens - theme should persist
3. Close and reopen app - theme should be remembered
4. Toggle multiple times - no lag or issues

## Future Enhancements

Potential improvements:
- System theme detection (follow device settings)
- Custom theme colors (user-defined palettes)
- Theme animations/transitions
- Per-screen theme overrides
- Additional theme variants (e.g., high contrast)

## Troubleshooting

### Theme not persisting
- Check AsyncStorage permissions
- Verify ThemeProvider wraps entire app
- Ensure `@react-native-async-storage/async-storage` is installed

### Colors not changing
- Verify you're using `theme.colors.X` not hardcoded colors
- Check that component is inside ThemeProvider
- Make sure useTheme() is called

### Flickering on load
- ThemeProvider includes loading state
- Theme loads from storage before rendering
- Can add splash screen if needed

## Dependencies

```json
{
  "react-native-paper": "^5.14.5",
  "@react-native-async-storage/async-storage": "^1.24.0"
}
```

## Summary

The theme system is now fully integrated and provides:
✅ Light and dark mode support
✅ Persistent storage of user preference
✅ Consistent Material Design colors
✅ Easy-to-use API with useTheme hook
✅ Integration with React Native Paper
✅ Applied across major screens
✅ Type-safe theme object
✅ No performance overhead
