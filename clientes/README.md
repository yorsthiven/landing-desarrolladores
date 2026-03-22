# Estructura de Clientes - Multi-cliente Dinámico

Landing pages multi-cliente con **configuración dinámica por cliente**. Escalable, limpio y sin redundancia de código.

## 📁 Estructura

```
clientes/
├── index.html                       # Landing principal (fallback)
├── alejyors/
│   ├── index.html                   # Landing específica (opcional)
│   ├── assets/img/                  # Imágenes de AlejYors
│   └── config.js                    # Configuración y branding
├── martinez/
│   ├── index.html                   # Landing específica
│   ├── assets/img/                  # Imágenes de Martínez
│   └── config.js                    # Configuración y branding
└── README.md                        # Esta documentación
```

## 🚀 Cómo acceder

**En Vercel (URLs limpias):**
```
tu-dominio.vercel.app/clientes/alejyors/
tu-dominio.vercel.app/clientes/martinez/
tu-dominio.vercel.app/clientes/nuevo-cliente/
```

**Localmente (rutas completas):**
```
http://localhost:8000/clientes/alejyors/
http://localhost:8000/clientes/martinez/
```

**Con parámetro URL (alternativa):**
```
http://localhost:8000/clientes/?cliente=alejyors
```

## ⚙️ Cómo funciona

1. **Vercel/Servidor** → Detecta la ruta `/clientes/{cliente}/`
2. **vercel.json** → Redirige a `/clientes/{cliente}/index.html`
3. **Fallback automático** → Si no existe índice del cliente, usa `/clientes/index.html`
4. **JavaScript (scripts.js)** → Detecta el cliente desde la ruta
5. **Carga dinámica** → Inyecta `/clientes/{cliente}/config.js`
6. **Renderizado** → Aplica colores, contenido y servicios del cliente ✅

## 🎨 Sistema de Colores Personalizable

Cada cliente puede personalizar completamente la paleta de colores desde `config.js`:

```javascript
colores: {
    primario: "#3b82f6",              // Botones, links, bordes
    secundario: "#10b981",            // Hovers, acentos secundarios
    letraGrande: "#ffffff",           // Títulos (h1, h2, h3)
    letrasChicas: "#cbd5e1",          // Párrafos y texto pequeño
    spanDestacado: "#a78bfa",         // Gradiente del span entre título
    fondoBanner: "#0f172a",           // Color de fondo general
    botonServicio: "#3b82f6",         // Botones de servicios
    navFondo: "rgba(15, 23, 42, 0.8)", // Fondo del nav (con transparencia)
    navTexto: "#cbd5e1"               // Color de texto del nav
}
```

### Elementos personalizados:
- 🔝 **Navegación** - Fondo con `navFondo`, texto heredado
- ✨ **Título grande y pequeño** - Usan `letraGrande`
- 📝 **Texto descriptivo** - Usa `letrasChicas`
- 🌈 **Span destacado** - Gradiente con `spanDestacado` → `secundario`
- 🔘 **Botones** - Usan `primario` y `botonServicio`
- 🔗 **Links de nav** - Usan `primario` con hover en `secundario`
- 📏 **Bordes de secciones** - Usan `primario`
- 🎨 **Fondo general** - Usa `fondoBanner`

## 🖼️ Imágenes con Fallback Automático

El sistema tiene un **fallback automático** para imágenes:

1. Busca la imagen en `/clientes/{cliente}/assets/img/`
2. Si no existe, usa la de `/assets/img/` (imágenes de AlejYors)
3. Perfecto para nuevos clientes sin necesidad de duplicar imágenes

## ➕ Cómo agregar un nuevo cliente

### 1. Crear la estructura:
```bash
mkdir -p clientes/nuevo-cliente/assets/img
```

### 2. Crear `config.js`:
```javascript
const clienteConfig = {
    nombre: "Nombre del Cliente",
    
    // Colores personalizables
    colores: {
        primario: "#3b82f6",
        secundario: "#10b981",
        letraGrande: "#ffffff",
        letrasChicas: "#cbd5e1",
        spanDestacado: "#a78bfa",
        fondoBanner: "#0f172a",
        botonServicio: "#3b82f6",
        navFondo: "rgba(15, 23, 42, 0.8)",
        navTexto: "#cbd5e1"
    },
    
    // Imágenes (fallback automático)
    logo: "logo.svg",
    favicon: "favicon.ico",
    banner: "banner.jpg",
    
    // Contenido
    heroTitle: "Título principal",
    heroTitle2: "Subtítulo destacado",
    heroDesc: "Descripción del hero",
    metaDescription: "Para SEO",
    metaKeywords: "palabras, clave",
    whatsapp: "123456789",
    footerInfo: "Información del footer",
    
    // Servicios/Proyectos
    servicios: [
        {
            categoria: "Categoría",
            titulo: "Título del servicio",
            desc: "Descripción breve",
            tags: ["tag1", "tag2"],
            estilo: "blue"  // o "emerald"
        }
    ]
};
```

### 3. (Opcional) Crear `index.html` personalizado:
Si quieres un diseño diferente, copia `/clientes/index.html` a `/clientes/nuevo-cliente/`:
```bash
cp clientes/index.html clientes/nuevo-cliente/index.html
```

Luego edita el arquivo si lo necesitas. Si **NO** lo haces, automáticamente usará el principal.

### 4. Agregar imágenes (opcional):
```
clientes/nuevo-cliente/assets/img/
├── logo.svg
├── banner.jpg
└── favicon.ico
```

Si no las copias, **automáticamente usará las de `/assets/img/`** ✅

###📦 Archivos centralizados

Compartidos por todos los clientes:
- `../css/styles.css` → Estilos CSS compartidos
- `../js/scripts.js` → Lógica principal (detección, renderización, theming)
- `../js/animations.js` → Animaciones de scroll
- `../assets/img/` → Imágenes generales (fallback para todos)

## 🔍 Detección de cliente

El script `scripts.js` detecta el cliente en este orden:

```javascript
function obtenerClienteActual() {
    // Prioridad 1: De la ruta /clientes/[cliente]/
    const rutaActual = window.location.pathname;
    const coincidencia = rutaActual.match(/\/clientes\/([^\/]+)\//);
    if (coincidencia) return coincidencia[1];
    
    // Prioridad 2: Parámetro URL ?cliente=
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('cliente');
}
```

Soporta ambas formas:
- Ruta limpia: `/clientes/martinez/` ← **Recomendado en Vercel**
- Parámetro: `/clientes/?cliente=martinez`

## 📋 Archivos centralizados

Compartidos por todos los clientes:
- `../css/styles.css` → Estilos CSS compartidos
- `../js/scripts.js` → Lógica principal (detección, renderización, theming)
- `../js/animations.js` → Animaciones de scroll
- `../assets/img/` → Imágenes generales (fallback para todos)

## 🔍uario accede a: /clientes/nuevo-cliente/
         ↓
    ¿Existe /clientes/nuevo-cliente/index.html?
         ↓
    SÍ → Carga ese index.html
    NO → Usa /clientes/index.html como fallback
         ↓
    scripts.js detecta cliente desde la ruta
    y carga /clientes/nuevo-cliente/config.js
```

**Ventaja:** Nuevos clientes funcionan automáticamente sin crear `index.html`. Solo necesita `config.js` y `assets/`.

## Cómo agregar un nuevo cliente

### 1. Crear la estructura:
```bash
mkdir -p clientes/nuevo-cliente/assets/img
```

### 2. Crear `config.js`:
```javascript
const clienteConfig = {
    nombre: "Nombre del Cliente",
    
    // Colores personalizables
    colores: {
        primario: "#3b82f6",
        secundario: "#10b981",
        letraGrande: "#ffffff",
        letrasChicas: "#cbd5e1",
        spanDestacado: "#a78bfa",
        fondoBanner: "#0f172a",
        botonServicio: "#3b82f6",
        navFondo: "rgba(15, 23, 42, 0.8)",
        navTexto: "#cbd5e1"
    },
    
    // Imágenes (fallback automático)
    logo: "logo.svg",
    favicon: "favicon.ico",
    banner: "banner.jpg",
    
    // Contenido
    heroTitle: "Título principal",
    heroTitle2: "Subtítulo destacado",
    heroDesc: "Descripción del hero",
    metaDescription: "Para SEO",
    metaKeywords: "palabras, clave",
    whatsapp: "123456789",
    footerInfo: "Información del footer",
    
    // Servicios/Proyectos
    servicios: [
        {
            categoria: "Categoría",
            titulo: "Título del servicio",
            desc: "Descripción breve",
            tags: ["tag1", "tag2"],
            estilo: "blue"  // o "emerald"
        }
    ]
};
```

### 3. Agregar imágenes (opcional):
Si quieres imágenes personalizadas, copia a:
```
clientes/nuevo-cliente/assets/img/
├── logo.svg
├── banner.jpg
└── favicon.ico
```

Si no las copias, **automáticamente usará las de `/assets/img/`** ✅

### 4. Acceder:
```
tu-dominio.com/clientes/?cliente=nuevo-cliente
```

¡Listo! 🚀

## Archivos centralizados

Compartidos por todos los clientes:
- `../css/styles.css` → Estilos CSS compartidos
- `../js/scripts.js` → Lógica principal (detección, renderización, theming)
- `../js/animations.js` → Animaciones de scroll
- `../assets/img/` → Imágenes generales (fallback para todos)

## Detección de cliente

```javascript
function obtenerClienteActual() {
    // Prioridad 1: Parámetro URL ?cliente=
    const urlParams = new URLSearchParams(window.location.search);
    const clienteParam = urlParams.get('cliente');
    if (clienteParam) return clienteParam;
    
    // Prioridad 2: Ruta /clientes/[cliente]/
    const rutaActual = window.location.pathname;
    const coincidencia = rutaActual.match(/\/clientes\/([^\/]+)\//);
    return coincidencia ? coincidencia[1] : null;
}
```

## .htaccess para URLs limpias (Producción)

Agrega en `/clientes/.htaccess`:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /clientes/
    
    RewriteRule ^([^/]+)/$ index.html?cliente=$1 [L,QSA]
    RewriteRule ^([^/]+)/index\.html$ index.html?cliente=$1 [L,QSA]
</IfModule>
```

## Ventajas

✅ Un único `index.html` para mantener
✅ Sin duplicación de código HTML
✅ Colores totalmente personalizables por cliente
✅ Imágenes con fallback automático (sin duplicación)
✅ Fácil agregar nuevos clientes
✅ Escalable y profesional
✅ URLs limpias sin parámetros (con .htaccess)
✅ SEO-friendly
✅ Cambios globales en un solo lugar
✅ Sistema de theming dinámico

## Desarrollo Local

Para testing local:
```bash
# Con Live Server
Abre: http://localhost:5500/clientes/?cliente=alejyors

# Con Python
python -m http.server 8000
Abre: http://localhost:8000/clientes/?cliente=alejyors
```

**¡Sistema perfecto para SaaS multi-cliente!** 🎉
