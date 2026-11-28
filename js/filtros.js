// Clasifica cada tarjeta según la clave HTML data-traduccion.
const buscador = document.querySelector(".buscador");
const campoBusqueda = document.querySelector(".buscador input[type='search']");
const filtroTipo = document.querySelector(".buscador select");
const tarjetas = Array.from(document.querySelectorAll(".tarjeta-contenido"));
const secciones = Array.from(document.querySelectorAll(".seccion-catalogo"));
const catalogo = document.querySelector(".catalogo-principal");

if (buscador && campoBusqueda && filtroTipo && catalogo) {
    const mensaje = document.createElement("p");
    mensaje.className = "mensaje-busqueda";
    mensaje.setAttribute("role", "status");
    catalogo.appendChild(mensaje);

    tarjetas.forEach((tarjeta) => {
        const titulo = tarjeta.querySelector("h3");
        const clave = titulo?.dataset.traduccion || "";
        tarjeta.dataset.tipo = clave.startsWith("serie.") ? "serie" : "pelicula";
    });

    const normalizar = (texto) => texto
        .toLocaleLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

    const mostrarTodos = () => {
        tarjetas.forEach((tarjeta) => tarjeta.classList.remove("oculta"));
        secciones.forEach((seccion) => seccion.classList.remove("oculta"));
        mensaje.classList.remove("visible");
        mensaje.textContent = "";
    };

    const filtrar = () => {
        const consulta = normalizar(campoBusqueda.value);
        const tipo = filtroTipo.value;
        let coincidencias = 0;

        if (!consulta && tipo === "todos") {
            mostrarTodos();
            return;
        }

        tarjetas.forEach((tarjeta) => {
            const titulo = normalizar(tarjeta.querySelector("h3")?.textContent || "");
            const coincideTexto = !consulta || titulo.includes(consulta);
            const coincideTipo = tipo === "todos" || tarjeta.dataset.tipo === tipo;
            const coincide = coincideTexto && coincideTipo;

            tarjeta.classList.toggle("oculta", !coincide);
            if (coincide) {
                coincidencias += 1;
            }
        });

        secciones.forEach((seccion) => {
            const hayCoincidencias = seccion.querySelector(".tarjeta-contenido:not(.oculta)");
            seccion.classList.toggle("oculta", !hayCoincidencias);
        });

        mensaje.textContent = coincidencias
            ? `${coincidencias} resultado${coincidencias === 1 ? "" : "s"}`
            : "No se encontraron títulos.";
        mensaje.classList.add("visible");
    };

    campoBusqueda.addEventListener("input", filtrar);
    filtroTipo.addEventListener("change", filtrar);

    buscador.addEventListener("toggle", () => {
        if (!buscador.open) {
            campoBusqueda.value = "";
            filtroTipo.value = "todos";
            mostrarTodos();
        } else {
            campoBusqueda.focus();
        }
    });

    campoBusqueda.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape") {
            buscador.open = false;
        }
    });
}

document.querySelectorAll(".seccion-catalogo").forEach((seccion, indice) => {
    const fila = seccion.querySelector(".rejilla-contenidos");
    if (!fila) {
        return;
    }

    const controles = document.createElement("div");
    controles.className = "controles-carrusel";
    controles.setAttribute("aria-label", "Controles del carrusel");

    const anterior = document.createElement("button");
    anterior.className = "boton-carrusel";
    anterior.type = "button";
    anterior.textContent = "‹";
    anterior.setAttribute("aria-label", "Desplazar títulos a la izquierda");
    anterior.setAttribute("aria-controls", `carrusel-${indice + 1}`);

    const siguiente = document.createElement("button");
    siguiente.className = "boton-carrusel";
    siguiente.type = "button";
    siguiente.textContent = "›";
    siguiente.setAttribute("aria-label", "Desplazar títulos a la derecha");
    siguiente.setAttribute("aria-controls", `carrusel-${indice + 1}`);

    fila.id = `carrusel-${indice + 1}`;
    controles.append(anterior, siguiente);
    fila.before(controles);

    const actualizarControles = () => {
        const maximo = fila.scrollWidth - fila.clientWidth;
        anterior.disabled = fila.scrollLeft <= 1;
        siguiente.disabled = fila.scrollLeft >= maximo - 1;
        controles.hidden = maximo <= 1;
    };

    anterior.addEventListener("click", () => {
        fila.scrollBy({ left: -fila.clientWidth * 0.8, behavior: "smooth" });
    });

    siguiente.addEventListener("click", () => {
        fila.scrollBy({ left: fila.clientWidth * 0.8, behavior: "smooth" });
    });

    fila.addEventListener("scroll", actualizarControles, { passive: true });
    window.addEventListener("resize", actualizarControles);
    actualizarControles();
});
