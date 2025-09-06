# Backend Projects Monorepo

Bienvenido a mi monorepositorio de proyectos de backend. Este espacio está diseñado para prácticas y mejoras de código utilizando JavaScript, TypeScript y Node.js.

## 🚀 Estructura del Proyecto

```
backend-projects/
├── .git/
├── .gitignore
├── eslint.config.js      # Configuración de ESLint
├── package.json          # Dependencias y scripts del workspace raíz
├── pnpm-lock.yaml        # Lock file de pnpm
└── unit-converter/       # Proyecto de conversor de unidades
    ├── public/           # Archivos estáticos
    │   ├── css/
    │   ├── js/
    │   └── index.html
    ├── src/              # Código fuente
    │   ├── core/         # Lógica principal
    │   ├── utils/        # Utilidades
    │   └── main.ts       # Punto de entrada
    ├── .gitignore
    ├── package.json      # Dependencias específicas del proyecto
    ├── pnpm-lock.yaml
    ├── ROADMAP.md        # Planificación del proyecto
    └── tsconfig.json     # Configuración de TypeScript
```

## 🛠️ Tecnologías Principales

- **Node.js** - Entorno de ejecución de JavaScript
- **TypeScript** - Superset tipado de JavaScript
- **ESLint** - Linter para mantener la calidad del código
- **pnpm** - Gestor de paquetes rápido y eficiente

## 📦 Proyectos

### 1. Unit Converter

Un conversor de unidades desarrollado con TypeScript.

**Características:**

- Interfaz web interactiva
- Conversión entre diferentes unidades de medida
- Arquitectura modular y escalable

**Scripts disponibles:**

```bash
# Desarrollar
pnpm --filter unit-converter dev

# Construir para producción
pnpm --filter unit-converter build

# Iniciar en producción
pnpm --filter unit-converter start
```

## 🚀 Cómo Empezar

1. Clona el repositorio:

   ```bash
   git clone <url-del-repositorio>
   cd backend-projects
   ```

2. Instala las dependencias:

   ```bash
   pnpm install
   ```

3. Navega al proyecto que desees ejecutar y sigue sus instrucciones específicas.

## 📝 Notas del Desarrollador

- Este monorepo utiliza pnpm workspaces para gestionar múltiples proyectos.
- Cada proyecto tiene su propio `package.json` con dependencias específicas.
- Se recomienda usar pnpm para instalar dependencias y ejecutar scripts.

## 📄 Licencia

Este proyecto está bajo la licencia ISC. Consulta el archivo [LICENSE](LICENSE) para más información.

---

✨ Desarrollado con pasión por el código limpio y las mejores prácticas de desarrollo.
