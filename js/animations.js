// Animación de tarjetas al hacer scroll
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
