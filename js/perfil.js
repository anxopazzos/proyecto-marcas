// Mantiene el perfil seleccionado en el fragmento de la URL al navegar.
const perfiles = ["anxo", "diego", "bampe"];
const perfilActual = window.location.hash.slice(1);

if (perfiles.includes(perfilActual)) {
    document.body.dataset.profile = perfilActual;

    document.querySelectorAll('a[href]').forEach((enlace) => {
        const destino = new URL(enlace.href, window.location.href);

        if (destino.origin !== window.location.origin) {
            return;
        }

        const perfilDestino = destino.hash.slice(1);
        if (!perfiles.includes(perfilDestino)) {
            destino.hash = perfilActual;
            enlace.href = destino.href;
        }
    });
}
