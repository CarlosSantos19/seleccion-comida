# Configuración de Firebase

Para que la aplicación funcione correctamente, necesitas configurar Firebase. Sigue estos pasos:

## 1. Crear un proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Agregar proyecto" o "Add project"
3. Nombra tu proyecto (ejemplo: "seleccion-comida")
4. Sigue los pasos del asistente

## 2. Configurar Realtime Database

1. En el menú lateral, haz clic en "Realtime Database"
2. Haz clic en "Crear base de datos" o "Create Database"
3. Selecciona una ubicación (elige la más cercana a tu región)
4. **IMPORTANTE:** Selecciona "Modo de prueba" para empezar
5. Haz clic en "Habilitar"

## 3. Configurar las reglas de seguridad

En la pestaña "Reglas" de Realtime Database, pega esto:

```json
{
  "rules": {
    "selecciones": {
      ".read": true,
      ".write": true
    }
  }
}
```

**Nota:** Estas reglas permiten lectura y escritura pública. Para producción, considera implementar autenticación.

## 4. Obtener las credenciales

1. Haz clic en el ícono de engranaje (⚙️) junto a "Descripción general del proyecto"
2. Selecciona "Configuración del proyecto"
3. En la sección "Tus apps", haz clic en el ícono de código web `</>`
4. Registra tu app (ponle un nombre como "Selección Comida Web")
5. Copia la configuración de Firebase que aparece

## 5. Actualizar firebase-config.js

Abre el archivo `firebase-config.js` y reemplaza los valores con tu configuración:

```javascript
const firebaseConfig = {
    apiKey: "TU_API_KEY_AQUI",
    authDomain: "tu-proyecto.firebaseapp.com",
    databaseURL: "https://tu-proyecto-default-rtdb.firebaseio.com",
    projectId: "tu-proyecto",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};
```

## 6. Probar la aplicación

1. Abre `index.html` en tu navegador
2. Selecciona un funcionario
3. Elige algunos alimentos
4. Haz clic en "Guardar Selección"
5. Abre la aplicación en otra ventana o pestaña y verás que los datos se sincronizan en tiempo real

## Características de Firebase en esta app

✅ **Guardado automático en la nube**: Los datos se guardan en Firebase, no en el navegador
✅ **Sincronización en tiempo real**: Todos ven los cambios instantáneamente
✅ **Persistencia**: Los datos no se pierden al cerrar el navegador
✅ **Acceso desde cualquier dispositivo**: Accede desde cualquier computadora o móvil

## Solución de problemas

### Error: "Firebase not defined"
- Asegúrate de que los scripts de Firebase estén cargando correctamente en `index.html`
- Verifica tu conexión a internet

### Error al guardar datos
- Verifica que las reglas de seguridad estén configuradas correctamente
- Asegúrate de que la databaseURL sea correcta

### Los datos no se sincronizan
- Abre la consola del navegador (F12) y busca errores
- Verifica que múltiples usuarios estén usando la misma configuración de Firebase

## Seguridad para producción

Para un entorno de producción, considera:

1. **Implementar autenticación**:
   ```json
   {
     "rules": {
       "selecciones": {
         ".read": "auth != null",
         ".write": "auth != null"
       }
     }
   }
   ```

2. **Usar variables de entorno** para las credenciales
3. **Implementar reglas más específicas** según tus necesidades
