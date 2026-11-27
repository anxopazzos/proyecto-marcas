// Mantiene el perfil seleccionado en el fragmento de la URL al navegar.
const perfiles = ["anxo", "diego", "bampe"];
const perfilActual = window.location.hash.slice(1);
const idiomas = ["en", "fr", "pt", "gl", "eu", "it", "de", "zh", "ja"];
const idiomaActual = new URLSearchParams(window.location.search).get("lang");

if (perfiles.includes(perfilActual)) {
    document.body.dataset.perfil = perfilActual;
}

if (perfiles.includes(perfilActual) || idiomas.includes(idiomaActual)) {
    document.querySelectorAll('a[href]').forEach((enlace) => {
        const destino = new URL(enlace.href, window.location.href);

        if (destino.origin !== window.location.origin) {
            return;
        }

        const perfilDestino = destino.hash.slice(1);
        if (perfiles.includes(perfilActual) && !perfiles.includes(perfilDestino)) {
            destino.hash = perfilActual;
        }

        if (idiomas.includes(idiomaActual)) {
            destino.searchParams.set("lang", idiomaActual);
        }

        enlace.href = destino.href;
    });
}
