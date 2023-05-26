
let productosEnCarrito = localStorage.getItem("productos-en-carrito");
productosEnCarrito = JSON.parse(productosEnCarrito);

const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carrito-acciones-comprar");
const total = document.querySelector("#total");

function cargarProductosCarrito() {
    if (productosEnCarrito && productosEnCarrito.length > 0) {

        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.remove("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");
        contenedorCarritoComprado.classList.add("disabled");

        contenedorCarritoProductos.innerHTML = "";

        productosEnCarrito.forEach(producto => {

            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                <img class="carrito-producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
                <div class="carrito-producto-titulo">
                    <small>Título</small>
                    <h3>${producto.titulo}</h3>
                </div>
                <div class="carrito-producto-cantidad">
                    <small>Cantidad</small>
                    <p>${producto.cantidad}</p>
                </div>
                <div class="carrito-producto-precio">
                    <small>Precio</small>
                    <p>$${producto.precio}</p>
                </div>
                <div class="carrito-producto-subtotal">
                    <small>Subtotal</small>
                    <p>$${producto.precio * producto.cantidad}</p>
                </div>
                <button class="carrito-producto-eliminar" id="${producto.id}">Eliminar<i class="bi bi-trash-fill"></i></button>
            `;

            contenedorCarritoProductos.append(div);
        })

        actualizarBotonesEliminar();
        actualizarTotal();

    } else {
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.remove("disabled");
        
        const p = document.createElement("p");
        p.innerHTML = `
        <p>Tu carrito está vacío</p>
        `;
        contenedorCarritoProductos.append(p);
    }
}

cargarProductosCarrito();

function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

function eliminarDelCarrito(e) {
    Toastify({
        text: "Producto eliminado",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "linear-gradient(to right, #4b33a8, #785ce9)",
            borderRadius: "2rem",
            textTransform: "uppercase",
            fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem', // horizontal axis - can be a number or a string indicating unity. eg: '2em'
            y: '1.5rem' // vertical axis - can be a number or a string indicating unity. eg: '2em'
        },
        onClick: function () { } // Callback after click
    }).showToast();

    const idBoton = e.currentTarget.id;
    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);

    productosEnCarrito.splice(index, 1);
    cargarProductosCarrito();

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

}

botonVaciar.addEventListener("click", vaciarCarrito);

botonVaciar.addEventListener("click", vaciarCarrito);

function vaciarCarrito() {
    fetch('/carrito', { method: 'DELETE' })
        .then(response => {
            if (response.status === 204) { // 204 significa "No Content"
                console.log('Carrito vaciado.');
                return Promise.resolve();
            } else {
                return response.json();
            }
        })
        .then(data => {
            if (data) {
                console.log('Error al vaciar el carrito:', data);
                throw new Error(data.message || 'Error al vaciar el carrito');
            } else {
                // Actualizar el contenido del carrito en la página
                actualizarCarrito();
            }
        })
        .catch(error => console.error(error))
        .finally(() => {
            Swal.fire({
                title: '¿Estás seguro?',
                icon: 'question',
                html: `Se van a borrar ${productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)} productos.`,
                showCancelButton: true,
                focusConfirm: false,
                confirmButtonText: 'Sí',
                cancelButtonText: 'No'
            }).then((result) => {
                if (result.isConfirmed) {
                    productosEnCarrito.length = 0;
                    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
                    cargarProductosCarrito();
                    window.location.reload(); // Actualizar la página
                }
            });
        });
}
document.addEventListener("DOMContentLoaded", () => {
    const botonPagar = document.getElementById("carrito-acciones-comprar");
    botonPagar.addEventListener("click", () => {
        const totalCalculado = productosEnCarrito.reduce(
            (acc, producto) => acc + producto.precio * producto.cantidad,
            0
        );
        const totalConIva = totalCalculado * 1.21;

        Swal.fire({
            title: "Total de la compra",
            html: `<p>Total: $${totalCalculado.toFixed(2)}</p><p>Total con IVA del 21%: $${totalConIva.toFixed(2)}</p><p> Muchas gracias por su compra</p>`,
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Aceptar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                productosEnCarrito.length = 0;
                localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

                contenedorCarritoVacio.classList.add("disabled");
                contenedorCarritoProductos.classList.add("disabled");
                contenedorCarritoAcciones.classList.add("disabled");
                contenedorCarritoComprado.classList.remove("disabled");

                cargarProductosCarrito(); 
                actualizarTotal();
                window.location.reload();
            }
        });
    });
});

function comprarCarrito() {
    productosEnCarrito.length = 0;
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

    contenedorCarritoVacio.classList.add("disabled");
    contenedorCarritoProductos.classList.add("disabled");
    contenedorCarritoAcciones.classList.add("disabled");
    contenedorCarritoComprado.classList.remove("disabled");

    cargarProductosCarrito(); 
    actualizarTotal();
    
}

function actualizarTotal() {
    const totalCalculado = productosEnCarrito.reduce(
        (acc, producto) => acc + producto.precio * producto.cantidad,
        0
    );
    const totalConIva = totalCalculado * 1.21;

    total.innerText = `$${totalCalculado.toFixed(2)}`;
}
