# Revolution Auto Service - Documentación Frontend

## 📋 Descripción General
Revolution Auto Service es una aplicación web para gestionar citas de servicio automotriz. El sistema permite a los clientes registrar sus vehículos, programar citas de servicio y dar seguimiento a su historial de servicios.

## 🚀 Estructura del Proyecto

```
FrontRevolution/
├── src/
│   ├── assets/
│   │   └── images/              # Imágenes y recursos estáticos
│   ├── components/
│   │   └── forms/              # Componentes de formularios reutilizables
│   │       └── CitaForm.jsx
│   ├── constants/
│   │   └── servicios.js        # Constantes de servicios y precios
│   ├── context/                # Contextos para estado global
│   │   ├── AuthContext.jsx
│   │   ├── CarroContext.jsx
│   │   └── CitasContext.jsx
│   ├── hooks/                  # Hooks personalizados
│   │   └── useCitaForm.js
│   ├── pages/                  # Páginas de la aplicación
│   │   ├── agregar/
│   │   ├── components/
│   │   └── inicio/
│   └── utils/                  # Utilidades y funciones auxiliares
```

## 📚 Librerías y Dependencias

### Dependencias Principales
- **React**: Biblioteca para construir interfaces de usuario
- **React Router Dom**: Manejo de rutas en la aplicación
- **Axios**: Cliente HTTP para peticiones API
- **TailwindCSS**: Framework CSS para estilos

### Componentes de UI
- **Lucide React**: Biblioteca de iconos
- **React Toastify**: Notificaciones tipo toast

## 🔧 Características Principales

### Sistema de Autenticación
```javascript
// AuthContext gestiona:
- Estado de autenticación del usuario
- Funcionalidad de inicio/cierre de sesión
- Gestión de tokens
- Persistencia de sesión
```

### Gestión de Vehículos
```javascript
// CarroContext maneja:
- Registro de vehículos
- Listado de vehículos
- Eliminación de vehículos
- Actualización de datos
```

### Sistema de Citas
```javascript
// CitasContext gestiona:
- Programación de citas
- Selección de tipo de servicio
- Cálculo de costos
- Seguimiento de estado
```

## 💻 Arquitectura de Componentes

### Formularios
- **CitaForm**: Componente reutilizable para citas
  - Selección de vehículo
  - Selección de servicio
  - Programación de fecha y hora
  - Información adicional

### Hooks Personalizados
- **useCitaForm**: Gestiona la lógica del formulario
  - Gestión del estado
  - Validación
  - Manejo de envío
  - Control de errores

### Proveedores de Contexto
- Gestión centralizada del estado
- Compartición de datos entre componentes
- Integración con API

## 🎨 Estilos
- Tema oscuro consistente
- Diseño responsivo
- Efectos de cristal (glass morphism)
- Animaciones interactivas
- Diseño adaptable a móviles

## 🛠️ Utilidades y Constantes

### Utilidades de Fecha
- Formateo de fechas
- Validación de fechas
- Cálculos de fecha mínima

### Constantes de Servicio
```javascript
// Tipos de servicio y costos predefinidos
- Enumeración de tipos de servicio
- Mapeo de precios
- Reglas de validación
```

## 📱 Diseño Responsivo
- Enfoque mobile-first
- Barra lateral adaptativa
- Diseño de tarjetas flexible
- Formularios adaptables

## 🔒 Características de Seguridad
- Autenticación basada en tokens
- Rutas protegidas
- Gestión de sesiones
- Almacenamiento seguro de datos

## 🚦 Gestión de Estado
- Context API para estado global
- Estado local para componentes específicos
- Gestión de estado de formularios
- Estados de carga

## 💡 Mejores Prácticas
- Composición de componentes
- División de código
- Límites de error
- Optimización de rendimiento
- Componentes reutilizables
- Separación de lógica en hooks

## 🌐 Integración con API
- Consumo de API RESTful
- Interceptores de Axios
- Manejo de errores
- Transformación de datos

---

Esta documentación proporciona una visión completa de la arquitectura frontend y sus componentes. Para información más detallada sobre características específicas o detalles de implementación, consulte la documentación en línea en el código fuente.
