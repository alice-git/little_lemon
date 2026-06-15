# Little Lemon App - Proyecto React Native Expo

Este es el proyecto final del curso **Little Lemon**, desarrollado como parte de la asignación. La aplicación permite a los usuarios registrarse a través de una pantalla de **Onboarding**, ver el menú del restaurante en la pantalla de **Home**, y gestionar su perfil en la pantalla de **Profile** con persistencia de datos.

## Requisitos cumplidos

Según los criterios de evaluación del proyecto, esta aplicación cumple con lo siguiente:

- ✅ Wireframe base diseñado previamente.
- ✅ Pantalla de **Onboarding** al abrir la app por primera vez (solicita nombre, correo y teléfono).
- ✅ Botón **Next** solo habilitado después de ingresar todos los datos personales.
- ✅ Pantalla **Home** contiene las secciones: **header**, **hero**, **menu breakdown** y **food menu list**.
- ✅ Pantalla **Profile** muestra los datos ingresados durante el onboarding.
- ✅ Los cambios guardados en **Profile** persisten al reiniciar la app (usando AsyncStorage o similar).
- ✅ Botón **Log out** limpia todos los datos del perfil y redirige al onboarding.
- ✅ Navegación por stack: se puede regresar a la pantalla anterior usando el botón **Back**.
- ✅ **Hero** contiene una breve descripción del restaurante Little Lemon + una barra de búsqueda.
- ✅ **Menu breakdown** tiene categorías seleccionables.
- ✅ **Food menu list** muestra una vista resumida de los ítems del menú.

## Tecnologías utilizadas

- React Native (Expo o CLI, según tu configuración)
- React Navigation (Stack)
- AsyncStorage (para persistencia de datos del perfil)
- FlatList para el menú
- Componentes funcionales con hooks (useState, useEffect)

## Estructura de archivos (relevante)

```
LittleLemonApp/
├── App.js # Configuración de navegación principal
├── screens/
│ ├── OnboardingScreen.js
│ ├── HomeScreen.js
│ └── ProfileScreen.js
├── components/
│ ├── Filters.js
│ └── MenuItem.js
├── utils/
│ ├── storage.js # Lectura/escritura de perfil
│ └── utils.js # Utilidades (getSectionListData, useUpdateEffect)
├── database.js # Configuración de SQLite y operaciones con menú
├── assets/ # Imágenes (logo, profile, hero, menu items 1.png, 2.png, etc.)
├── wireframe.png # Wireframe del diseño
└── README.md
```

## Cómo ejecutar el proyecto

1. Clona el repositorio o descarga los archivos.
2. Instala dependencias:
   ```bash
   npm install
   npx expo start 
   npx react-native run-android / run-ios