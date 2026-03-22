// Detectar cliente desde parámetro URL o ruta
function obtenerClienteActual() {
    // Intentar obtener cliente desde parámetro URL: ?cliente=alejyors
    const urlParams = new URLSearchParams(window.location.search);
    const clienteParam = urlParams.get('cliente');
    
    if (clienteParam) {
        return clienteParam;
    }
    
    // Alternativa: detectar desde ruta /clientes/alejyors/
    const rutaActual = window.location.pathname;
    const coincidencia = rutaActual.match(/\/clientes\/([^\/]+)\//);
    return coincidencia ? coincidencia[1] : null;
}

// Cargar dinámicamente el config.js del cliente
function cargarConfigCliente() {
    return new Promise((resolve, reject) => {
        const cliente = obtenerClienteActual();
        
        if (!cliente) {
            console.error('No se pudo detectar el cliente');
            reject('Cliente no detectado. Usa: ?cliente=alejyors o accede a /clientes/alejyors/');
            return;
        }
        
        const scriptConfig = document.createElement('script');
        // Si ya estamos EN /clientes/cliente/, cargamos ./config.js
        // Si estamos en /clientes/, cargamos ./{cliente}/config.js
        const isInClientFolder = window.location.pathname.includes(`/clientes/${cliente}/`);
        scriptConfig.src = isInClientFolder ? './config.js' : `./${cliente}/config.js`;
        scriptConfig.onload = () => {
            if (typeof clienteConfig !== 'undefined') {
                resolve(clienteConfig);
            } else {
                reject('clienteConfig no definido en ' + cliente);
            }
        };
        scriptConfig.onerror = () => {
            reject('No se pudo cargar config.js para ' + cliente);
        };
        document.head.appendChild(scriptConfig);
    });
}

// Sistema de fallback para imágenes del cliente
function setImageWithFallback(elementId, clientImagePath, mainImagePath) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.onerror = () => {
        element.src = mainImagePath;
        console.warn(`Fallback: usando imagen principal para ${elementId}`);
    };
    element.src = clientImagePath;
}

// Sistema de fallback para favicon
function setFaviconWithFallback(clientImagePath, mainImagePath) {
    const favicon = document.getElementById('dynamic-favicon');
    if (!favicon) return;
    
    const img = new Image();
    img.onerror = () => {
        favicon.href = mainImagePath;
        console.warn('Fallback: usando favicon principal');
    };
    img.onload = () => {
        favicon.href = clientImagePath;
    };
    img.src = clientImagePath;
}

function cargarDatosCliente() {
    cargarConfigCliente().then(data => {
        const cliente = obtenerClienteActual();
        
        // 1. Título y Favicon
        document.title = data.nombre;
        
        // Rutas con fallback: cliente → principal (alejyors)
        const clientImgPath = `/clientes/${cliente}/assets/img/`;
        const mainImgPath = `/assets/img/`;
        
        // Favicon con fallback
        const faviconName = data.favicon.split('/').pop();
        setFaviconWithFallback(
            `${clientImgPath}${faviconName}`,
            `${mainImgPath}${faviconName}`
        );
        
        // Aplicar variables CSS del cliente
        const colores = data.colores || {
            primario: "#3b82f6",
            secundario: "#10b981",
            letraGrande: "#ffffff",
            letrasChicas: "#cbd5e1",
            spanDestacado: "#a78bfa",
            fondoBanner: "#0f172a",
            botonServicio: "#3b82f6"
        };
        
        document.documentElement.style.setProperty('--color-primario', colores.primario);
        document.documentElement.style.setProperty('--color-secundario', colores.secundario);
        document.documentElement.style.setProperty('--letra-grande', colores.letraGrande);
        document.documentElement.style.setProperty('--letras-chicas', colores.letrasChicas);
        document.documentElement.style.setProperty('--span-destacado', colores.spanDestacado);
        document.documentElement.style.setProperty('--fondo-banner', colores.fondoBanner);
        document.documentElement.style.setProperty('--boton-servicio', colores.botonServicio);
        
        // Inyectar CSS dinámico para el fondo
        const style = document.createElement('style');
        style.textContent = `
            :root {
                --color-primario: ${colores.primario};
                --color-secundario: ${colores.secundario};
                --letra-grande: ${colores.letraGrande};
                --letras-chicas: ${colores.letrasChicas};
                --span-destacado: ${colores.spanDestacado};
                --fondo-banner: ${colores.fondoBanner};
                --boton-servicio: ${colores.botonServicio};
            }
            
            body {
                background-color: ${colores.fondoBanner} !important;
            }
            
            h1, h2, h3 {
                color: ${colores.letraGrande} !important;
            }
            
            p, .text-slate-400 {
                color: ${colores.letrasChicas} !important;
            }
            
            /* Span destacado entre títulos */
            #hero-title-2 {
                background: linear-gradient(to right, ${colores.spanDestacado}, ${colores.secundario}) !important;
                -webkit-background-clip: text !important;
                background-clip: text !important;
                -webkit-text-fill-color: transparent !important;
            }
            
            /* Botón Ver Servicios */
            header a[href="#servicios"] {
                background-color: ${colores.botonServicio} !important;
                border-color: ${colores.botonServicio} !important;
            }
            
            header a[href="#servicios"]:hover {
                opacity: 0.9;
            }
            
            /* Links de navegación */
            nav a[href="#servicios"] {
                color: ${colores.letrasChicas};
            }
            
            nav a[href="#servicios"]:hover {
                color: ${colores.primario};
            }
            
            /* Botón contacto en nav */
            #nav-contact-btn {
                border-color: ${colores.primario} !important;
                color: ${colores.primario} !important;
            }
            
            #nav-contact-btn:hover {
                background-color: ${colores.primario} !important;
                color: white !important;
            }
            
            /* Títulos de secciones */
            h2 {
                border-left-color: ${colores.primario} !important;
            }
            
            /* Navegación */
            nav {
                background-color: ${colores.navFondo} !important;
            }
            
            nav div:first-child {
                color: ${colores.letraGrande} !important;
            }
            
            /* Links en general */
            a {
                color: ${colores.primario};
            }
            
            a:hover {
                color: ${colores.secundario};
            }
        `;
        document.head.appendChild(style);
        
        // 2. Logo con fallback
        const logoName = data.logo.split('/').pop();
        setImageWithFallback(
            'client-logo',
            `${clientImgPath}${logoName}`,
            `${mainImgPath}${logoName}`
        );
        
        // 3. Meta tags
        document.getElementById('meta-description').content = data.metaDescription;
        document.getElementById('meta-keywords').content = data.metaKeywords;
        document.getElementById('og-url').content = window.location.href;
        document.getElementById('og-title').content = data.nombre;
        document.getElementById('og-description').content = data.metaDescription;
        
        const bannerName = data.banner.split('/').pop();
        document.getElementById('og-image').content = `${clientImgPath}${bannerName}`;
        
        document.getElementById('twitter-title').content = data.nombre;
        document.getElementById('twitter-description').content = data.metaDescription;
        
        // 4. Hero section
        document.getElementById('hero-title-1').innerText = data.heroTitle;
        document.getElementById('hero-title-2').innerText = data.heroTitle2;
        document.getElementById('hero-desc').innerHTML = data.heroDesc;
        
        // 5. Links de WhatsApp
        const waLink = `https://wa.me/${data.whatsapp}?text=Hola%20${encodeURIComponent(data.nombre)},%20deseo%20consultar%20sobre%20sus%20servicios`;
        document.getElementById('nav-contact-btn').href = waLink;
        document.getElementById('floating-whatsapp').href = waLink;
        
        // 6. Footer
        document.getElementById('footer-content').innerHTML = data.footerInfo;
        
        // 7. Generar tarjetas de servicios dinámicamente
        generarTarjetasServicios(data.servicios, colores.primario);
    }).catch(error => {
        console.error('Error cargando datos del cliente:', error);
        alert('Error: ' + error);
    });
}

function generarTarjetasServicios(servicios, colorPrimario) {
    const container = document.getElementById('servicios-container');
    container.innerHTML = ''; // Limpiar
    
    const colorEstilos = {
        blue: { text: 'text-blue-500', border: 'hover:border-blue-500/50' },
        emerald: { text: 'text-emerald-500', border: 'hover:border-emerald-500/50' }
    };
    
    servicios.forEach(servicio => {
        const estilo = colorEstilos[servicio.estilo] || colorEstilos.blue;
        
        const card = document.createElement('div');
        card.className = `bg-slate-900 p-8 rounded-2xl border border-slate-800 ${estilo.border} transition group card-hidden`;
        card.setAttribute('data-scroll-animate', '');
        
        card.innerHTML = `
            <span class="${estilo.text} font-mono text-sm">${servicio.categoria}</span>
            <h3 class="text-2xl font-bold text-white mt-2 mb-4">${servicio.titulo}</h3>
            <p class="text-slate-400 mb-6">${servicio.desc}</p>
            <div class="flex gap-2 flex-wrap">
                ${servicio.tags.map(tag => `<span class="bg-slate-800 px-3 py-1 rounded text-xs">${tag}</span>`).join('')}
            </div>
        `;
        
        container.appendChild(card);
    });
    
    // Re-observar las nuevas tarjetas para la animación
    inicializarAnimacionesTarjetas();
}

function inicializarAnimacionesTarjetas() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('card-hidden');
                entry.target.classList.add('animate-slide-in');
            } else {
                entry.target.classList.remove('animate-slide-in');
                entry.target.classList.add('card-hidden');
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-scroll-animate]').forEach(card => {
        observer.observe(card);
    });
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cargarDatosCliente);
} else {
    cargarDatosCliente();
}