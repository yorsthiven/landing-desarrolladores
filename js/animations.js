// Animación de tarjetas al hacer scroll
// Nota: La lógica principal está en scripts.js con inicializarAnimacionesTarjetas()
// Este archivo mantiene la configuración de CSS de animaciones

// Si por alguna razón las tarjetas no fueron observadas, ejecutar de nuevo al cargar
window.addEventListener('load', () => {
    // Pequeño delay para asegurar que todo esté cargado
    setTimeout(() => {
        const tarjetas = document.querySelectorAll('[data-scroll-animate]');
        if (tarjetas.length > 0 && !tarjetas[0].classList.contains('animate-slide-in')) {
            if (typeof inicializarAnimacionesTarjetas === 'function') {
                inicializarAnimacionesTarjetas();
            }
        }
    }, 100);
});
