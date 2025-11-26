// Shared types and messages - safe for both server and client
export type Locale = "en" | "es";
export const locales: Locale[] = ["en", "es"];
export const defaultLocale: Locale = "en";

export type Messages = Record<string, string>;

const en: Messages = {
    // Brand / Nav
    "brand.name": "Paws & Pals",
    "nav.home": "Home",
    "nav.dogs": "Dogs",
    "nav.how": "How it works",
    "nav.adopt": "Adopt",

    // Footer
    "footer.copyright": "© {year} Paws & Pals. All rights reserved.",
    "footer.builtWith": "Built with Next.js and Tailwind CSS.",

    // Hero
    "hero.title": "Find your new best friend",
    "hero.subtitle": "We're on a mission to help 45 wonderful dogs find loving homes. Browse profiles, learn their stories, and start the adoption journey.",
    "hero.explore": "Explore dogs",
    "hero.how": "How it works",

    // Stats
    "stats.dogs": "Dogs listed",
    "stats.avgAge": "Avg. age",
    "stats.goal": "Goal",

    // How it works
    "how.title": "How it works",
    "how.subtitle": "A simple, thoughtful process to match you with your new best friend.",
    "how.1.title": "Browse and inquire",
    "how.1.desc": "Explore dogs, open a profile, and start an adoption inquiry.",
    "how.2.title": "Meet and greet",
    "how.2.desc": "We'll schedule an optional visit and help with compatibility questions.",
    "how.3.title": "Bring them home",
    "how.3.desc": "Finalize adoption with guidance on care, training, and supplies.",

    // Explorer / Filters
    "filters.searchLabel": "Search by name or breed",
    "filters.searchPlaceholder": "e.g., Luna or Beagle",
    "filters.breed": "Breed",
    "filters.age": "Age",
    "filters.any": "Any",
    "filters.all": "All",
    "filters.puppy": "Puppy",
    "filters.adult": "Adult",
    "filters.senior": "Senior",
    "grid.empty": "No dogs match your filters.",

    // Dog Details
    "dog.age": "Age",
    "dog.sex": "Sex",
    "dog.size": "Size",
    "dog.location": "Location",
    "dog.about": "About {name}",
    "dog.book": "Book a visit",
    "dog.adopt": "Start adoption",
    "nav.backList": "Back to list",
    "card.viewDetails": "View details for {name}",

    // Dog Attributes
    "attr.male": "Male",
    "attr.female": "Female",
    "attr.small": "Small",
    "attr.medium": "Medium",
    "attr.large": "Large",
    "attr.years": "{count} years",
    "attr.year": "{count} year",
    "attr.months": "{count} months",
    "attr.month": "{count} month",

    // Modal
    "modal.title": "Adopt {name}",
    "modal.subtitle": "Tell us a bit about you and your home. We'll get back within 24–48 hours.",
    "modal.close": "Close",
    "form.name": "Full name",
    "form.name.placeholder": "Jane Doe",
    "form.email": "Email",
    "form.email.placeholder": "you@example.com",
    "form.phone": "Phone",
    "form.phone.placeholder": "(555) 555-1234",
    "form.message": "Tell us about your home/environment",
    "form.message.placeholder": "Yard or nearby park? Any other pets? Daily schedule?",
    "form.submit": "Submit inquiry",
    "form.submitting": "Submitting…",
    "form.error.required": "Name and email are required.",
    "form.error.phone": "Please enter a valid 10-digit phone number.",
    "form.success": "Inquiry sent! Redirecting…",

    // Thank you
    "thanks.title": "Thanks for your inquiry",
    "thanks.body": "We've received your request to adopt {dog}. Our team will reach out within 24–48 hours.",
    "thanks.back": "Back to dogs",
    "thanks.contact": "Contact support",

    // 404
    "404.title": "Page not found",
    "404.body": "The page you're looking for doesn't exist or has been moved.",
    "404.back": "Back to home",
};

const es: Messages = {
    // Brand / Nav
    "brand.name": "Patas y Amigos",
    "nav.home": "Inicio",
    "nav.dogs": "Perros",
    "nav.how": "Cómo funciona",
    "nav.adopt": "Adoptar",

    // Footer
    "footer.copyright": "© {year} Patas y Amigos. Todos los derechos reservados.",
    "footer.builtWith": "Creado con Next.js y Tailwind CSS.",

    // Hero
    "hero.title": "Encuentra a tu nuevo mejor amigo",
    "hero.subtitle": "Nuestra misión es ayudar a 45 perros maravillosos a encontrar hogares amorosos. Explora perfiles, conoce sus historias y comienza el proceso de adopción.",
    "hero.explore": "Explorar perros",
    "hero.how": "Cómo funciona",

    // Stats
    "stats.dogs": "Perros listados",
    "stats.avgAge": "Edad prom.",
    "stats.goal": "Meta",

    // How it works
    "how.title": "Cómo funciona",
    "how.subtitle": "Un proceso simple y cuidadoso para conectarte con tu nuevo mejor amigo.",
    "how.1.title": "Explora y consulta",
    "how.1.desc": "Explora perros, abre un perfil y envía una solicitud de adopción.",
    "how.2.title": "Conoce y saluda",
    "how.2.desc": "Programaremos una visita opcional y te ayudaremos con dudas de compatibilidad.",
    "how.3.title": "Llévalo a casa",
    "how.3.desc": "Finaliza la adopción con orientación sobre cuidados, entrenamiento y suministros.",

    // Explorer / Filters
    "filters.searchLabel": "Buscar por nombre o raza",
    "filters.searchPlaceholder": "p. ej., Luna o Beagle",
    "filters.breed": "Raza",
    "filters.age": "Edad",
    "filters.any": "Cualquiera",
    "filters.all": "Todos",
    "filters.puppy": "Cachorro",
    "filters.adult": "Adulto",
    "filters.senior": "Mayor",
    "grid.empty": "Ningún perro coincide con tus filtros.",

    // Dog Details
    "dog.age": "Edad",
    "dog.sex": "Sexo",
    "dog.size": "Tamaño",
    "dog.location": "Ubicación",
    "dog.about": "Acerca de {name}",
    "dog.book": "Reservar visita",
    "dog.adopt": "Comenzar adopción",
    "nav.backList": "Volver a la lista",
    "card.viewDetails": "Ver detalles de {name}",

    // Dog Attributes
    "attr.male": "Macho",
    "attr.female": "Hembra",
    "attr.small": "Pequeño",
    "attr.medium": "Mediano",
    "attr.large": "Grande",
    "attr.years": "{count} años",
    "attr.year": "{count} año",
    "attr.months": "{count} meses",
    "attr.month": "{count} mes",

    // Modal
    "modal.title": "Adoptar a {name}",
    "modal.subtitle": "Cuéntanos un poco sobre ti y tu hogar. Te responderemos en 24–48 horas.",
    "modal.close": "Cerrar",
    "form.name": "Nombre completo",
    "form.name.placeholder": "Jane Doe",
    "form.email": "Correo electrónico",
    "form.email.placeholder": "tu@ejemplo.com",
    "form.phone": "Teléfono",
    "form.phone.placeholder": "(555) 555-1234",
    "form.message": "Cuéntanos sobre tu hogar/entorno",
    "form.message.placeholder": "¿Patio o parque cercano? ¿Otras mascotas? ¿Horario diario?",
    "form.submit": "Enviar solicitud",
    "form.submitting": "Enviando…",
    "form.error.required": "El nombre y el correo son obligatorios.",
    "form.error.phone": "Ingresa un número de teléfono válido de 10 dígitos.",
    "form.success": "¡Solicitud enviada! Redirigiendo…",

    // Thank you
    "thanks.title": "Gracias por tu solicitud",
    "thanks.body": "Hemos recibido tu solicitud para adoptar a {dog}. Nuestro equipo se comunicará en 24–48 horas.",
    "thanks.back": "Volver a perros",
    "thanks.contact": "Contactar soporte",

    // 404
    "404.title": "Página no encontrada",
    "404.body": "La página que buscas no existe o ha sido movida.",
    "404.back": "Volver al inicio",
};

const dict: Record<Locale, Messages> = { en, es };

export function getMessages(locale: Locale): Messages {
    return dict[locale] ?? en;
}

export function format(msg: string, vars?: Record<string, string | number>): string {
    if (!vars) return msg;
    return Object.entries(vars).reduce((acc, [k, v]) => acc.replaceAll(`{${k}}`, String(v)), msg);
}
