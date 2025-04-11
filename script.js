const productos = [
  { 
    id: 1, 
    nombre: "Tutú Clásico", 
    precio: 45.00,
    imagen: "https://cdn.pixabay.com/photo/2025/01/22/21/09/ai-generated-9353161_1280.jpg",
    categoria: "ballet"
  },
  { 
    id: 2, 
    nombre: "Mallas de Ballet", 
    precio: 28.00,
    imagen: "https://media.istockphoto.com/id/2151117662/es/foto/two-ballerinas-child-girl-and-woman-in-ballet-pointe-shoes-little-kid-and-adult-teacher-are.jpg?s=1024x1024&w=is&k=20&c=zuxCZFa-_vmOudSxBHkM1Smo0V-3QOapI54syctTfuU=",
    categoria: "ballet"
  },
  { 
    id: 3, 
    nombre: "Zapatillas de Punta", 
    precio: 75.00,
    imagen: "https://media.istockphoto.com/id/89158922/photo/ballet-shoes.jpg?s=1024x1024&w=is&k=20&c=IORSYGA74IcUvjQn3DMPa1LCwydI3CSZ1-E_YV55Kn8=",
    categoria: "ballet"
  },
  { 
    id: 4, 
    nombre: "Falda de Ensayo", 
    precio: 22.00,
    imagen: "https://media.istockphoto.com/id/1443493450/es/foto/baile-fitness-ballet-chica-chicas-estiramiento-de-piernas-con-entrenamiento-ejercicio-o.jpg?s=1024x1024&w=is&k=20&c=MTjsY6MUdSOfYrg4AIxWBg6xiGMWGudNt8d1i5Mij-4=",
    categoria: "ballet"
  },
  { 
    id: 5, 
    nombre: "Calentadores de Lana", 
    precio: 18.00,
    imagen: "https://media.istockphoto.com/id/1186665894/es/foto/piernas-femeninas-bien-cuidadas-en-calentador-de-piernas-blancas-manos-de-mujer-poniendo-en.jpg?s=1024x1024&w=is&k=20&c=-eFu5ire6XFmG-D5O-a1urdozdKurdQ1O5HZXEWnOYY=",
    categoria: "accesorios"
  },
  { 
    id: 6, 
    nombre: "Top de Danza Contemporánea", 
    precio: 32.00,
    imagen: "https://i.pinimg.com/originals/10/2e/94/102e94c26ff57263ecd50547b20729ee.jpg",
    categoria: "contemporaneo"
  },
  { 
    id: 7, 
    nombre: "Pantalón de Jazz", 
    precio: 38.00,
    imagen: "https://th.bing.com/th/id/OIP.LfFtHs6IJFROeBai8x1VRQHaMS?rs=1&pid=ImgDetMain",
    categoria: "jazz"
  }
];

let carrito = new Map();

const contenedorProductos = document.getElementById("productos");
const listaCarrito = document.getElementById("lista-carrito");
const totalCarrito = document.getElementById("total");
const cantidadCarrito = document.getElementById("cantidad-carrito");
const contenedorPayPal = document.getElementById("paypal-button-container");

function filtrarPorCategoria() {
  const seleccion = document.getElementById("categoria").value;
  const productosFiltrados = seleccion === "todos" 
    ? productos 
    : productos.filter(p => p.categoria === seleccion);

  contenedorProductos.innerHTML = "";

  productosFiltrados.forEach(prod => {
    const div = document.createElement("div");
    div.className = "producto";
    div.innerHTML = `
      <img src="${prod.imagen}" alt="${prod.nombre}">
      <h3>${prod.nombre}</h3>
      <p>Precio: $${prod.precio.toFixed(2)}</p>
      <button onclick="agregarAlCarrito(${prod.id})">Agregar al carrito</button>
    `;
    contenedorProductos.appendChild(div);
  });
}

function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  if (!producto) return;

  if (carrito.has(id)) {
    carrito.get(id).cantidad++;
  } else {
    carrito.set(id, { ...producto, cantidad: 1 });
  }

  guardarCarrito();
  actualizarCarrito();
  mostrarNotificacion(`${producto.nombre} agregado al carrito`);
}

function actualizarCarrito() {
  listaCarrito.innerHTML = "";
  let total = 0;
  let cantidadTotal = 0;

  carrito.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.nombre} - $${item.precio.toFixed(2)} x ${item.cantidad}
      <button onclick="eliminarDelCarrito(${item.id})">❌</button>
    `;
    listaCarrito.appendChild(li);
    total += item.precio * item.cantidad;
    cantidadTotal += item.cantidad;
  });

  totalCarrito.textContent = total.toFixed(2);
  cantidadCarrito.textContent = cantidadTotal;
  contenedorPayPal.style.display = carrito.size > 0 ? "block" : "none";
}

function eliminarDelCarrito(id) {
  if (!carrito.has(id)) return;

  let item = carrito.get(id);
  if (item.cantidad > 1) {
    item.cantidad--;
  } else {
    carrito.delete(id);
  }

  guardarCarrito();
  actualizarCarrito();
  mostrarNotificacion("Producto eliminado");
}

function vaciarCarrito() {
  if (carrito.size === 0) return;

  if (confirm("¿Seguro que quieres vaciar el carrito?")) {
    carrito.clear();
    guardarCarrito();
    actualizarCarrito();
    mostrarNotificacion("Carrito vaciado");
  }
}

function finalizarCompra() {
  if (carrito.size === 0) {
    mostrarNotificacion("Tu carrito está vacío");
    return;
  }

  // Mostrar mensaje de confirmación primero
  if (confirm("¿Confirmas que deseas finalizar tu compra?")) {
    mostrarNotificacion("¡Gracias por tu compra! Tu pedido está en camino.");
    
    // Vaciar el carrito después de 2 segundos (para que se vea el mensaje)
    setTimeout(() => {
      vaciarCarrito();
    }, 2000);
  }
}

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(Array.from(carrito.entries())));
}

function cargarCarrito() {
  const data = localStorage.getItem("carrito");
  if (data) {
    carrito = new Map(JSON.parse(data));
    actualizarCarrito();
  }
}

function mostrarNotificacion(mensaje) {
  const notificacion = document.createElement("div");
  notificacion.className = "notificacion";
  notificacion.textContent = mensaje;
  document.body.appendChild(notificacion);
  
  setTimeout(() => {
    notificacion.remove();
  }, 2000);
}

// PayPal Smart Button
if (window.paypal) {
  paypal.Buttons({
    createOrder: function(data, actions) {
      const total = Array.from(carrito.values()).reduce(
        (acc, item) => acc + item.precio * item.cantidad, 0
      );
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: total.toFixed(2)
          }
        }]
      });
    },
    onApprove: function(data, actions) {
      return actions.order.capture().then(function(details) {
        mostrarNotificacion(`¡Gracias ${details.payer.name.given_name}, tu pago fue exitoso!`);
        vaciarCarrito();
      });
    },
    onError: function(err) {
      console.error("Error con PayPal:", err);
      mostrarNotificacion("Hubo un problema con el pago. Intenta de nuevo.");
    }
  }).render("#paypal-button-container");
}

// Inicializar
filtrarPorCategoria();
cargarCarrito();