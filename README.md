# Sistema de Ventas - Monorepo

Sistema completo de gestión de ventas con backend TypeScript/Express/Supabase y frontend React/Vite.

## 🏗️ Arquitectura

```
ventas-monorepo/
├── backend/          # API REST con TypeScript, Express, Supabase
├── frontend/         # Aplicación React con Vite y TypeScript
├── package.json      # Configuración del monorepo
└── README.md         # Este archivo
```

## 🚀 Características

### Backend

- **TypeScript**: Código completamente tipado
- **Express.js**: Framework web robusto
- **Supabase**: Base de datos PostgreSQL en la nube
- **Swagger**: Documentación automática de la API
- **Validación**: Validación de datos con express-validator
- **Rate Limiting**: Protección contra spam
- **Helmet**: Seguridad HTTP

### Frontend

- **React 18**: Biblioteca de UI moderna
- **TypeScript**: Código completamente tipado
- **Vite**: Build tool rápido
- **React Router**: Navegación SPA
- **Axios**: Cliente HTTP
- **Lucide Icons**: Iconos modernos
- **Tailwind CSS**: Framework CSS utilitario

## 📋 Prerrequisitos

- Node.js 18+
- npm o yarn
- Cuenta de Supabase

## 🛠️ Instalación Rápida

### Opción 1: Configuración Automática

```bash
# Clonar el repositorio
git clone <repository-url>
cd ventas-monorepo

# Instalar dependencias y configurar todo
npm install
npm run setup
```

### Opción 2: Configuración Manual

```bash
# Instalar dependencias del monorepo
npm install

# Configurar backend
cd backend
npm install
cp env.example .env
# Editar .env con credenciales de Supabase
npm run build

# Configurar frontend
cd ../frontend
npm install
```

## 🗄️ Configuración de Supabase

1. Crear proyecto en [Supabase](https://supabase.com)
2. Ejecutar el script SQL en el SQL Editor:
   ```sql
   -- Copiar y pegar el contenido de backend/supabase-schema.sql
   ```
3. Copiar las credenciales del proyecto
4. Editar `backend/.env` con las credenciales

## 🚀 Ejecución

### Desarrollo (Backend + Frontend)

```bash
npm run dev
```

### Solo Backend

```bash
npm run dev:backend
```

### Solo Frontend

```bash
npm run dev:frontend
```

### Producción

```bash
npm run build
npm start
```

## 📚 Scripts Disponibles

| Comando                | Descripción                              |
| ---------------------- | ---------------------------------------- |
| `npm install`          | Instalar dependencias del monorepo       |
| `npm run setup`        | Configuración automática completa        |
| `npm run dev`          | Iniciar backend y frontend en desarrollo |
| `npm run dev:backend`  | Solo backend en desarrollo               |
| `npm run dev:frontend` | Solo frontend en desarrollo              |
| `npm run build`        | Compilar todo el proyecto                |
| `npm run start`        | Iniciar en producción                    |
| `npm run lint`         | Linting de todo el proyecto              |
| `npm run test`         | Tests de todo el proyecto                |
| `npm run clean`        | Limpiar node_modules y builds            |

## 🔗 Enlaces de Desarrollo

- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api-docs
- **Health Check**: http://localhost:3001/health
- **Frontend**: http://localhost:5173

## 📊 Entidades del Sistema

### Clientes

- Gestión completa de clientes
- Búsqueda y filtrado
- Validación de datos

### Categorías

- Organización de productos
- Jerarquía simple

### Productos

- Gestión de inventario
- Control de stock
- Asociación con categorías

### Ventas

- Proceso de venta completo
- Múltiples estados
- Detalles de venta

## 🛡️ Seguridad

- **CORS**: Configurado para desarrollo y producción
- **Rate Limiting**: Protección contra spam
- **Helmet**: Headers de seguridad HTTP
- **Validación**: Validación de datos de entrada
- **Error Handling**: Manejo centralizado de errores

## 🧪 Testing

```bash
# Tests de todo el proyecto
npm test

# Tests del backend
npm run test:backend

# Tests del frontend
npm run test:frontend
```

## 📝 Logs

- **Backend**: Morgan para logs HTTP
- **Frontend**: Console logs en desarrollo
- **Errores**: Manejo centralizado con stack traces

## 🔄 Variables de Entorno

### Backend (.env)

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PORT=3001
NODE_ENV=development
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3001
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

Si tienes problemas:

1. **Verificar logs**: Revisa la consola del backend y frontend
2. **Variables de entorno**: Asegúrate de que `.env` esté configurado
3. **Supabase**: Verifica la conexión a la base de datos
4. **Dependencias**: Ejecuta `npm run clean && npm install` para reinstalar

## 📈 Roadmap

- [ ] Autenticación JWT
- [ ] Dashboard con gráficos
- [ ] Reportes PDF
- [ ] Notificaciones en tiempo real
- [ ] Tests unitarios y de integración
- [ ] Docker deployment
- [ ] CI/CD pipeline
