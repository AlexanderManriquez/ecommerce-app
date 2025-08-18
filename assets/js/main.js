let allProducts = [];
let showingAll = false;
const productsInCart = [];
const cartModal = document.getElementById('cart-modal');
const cartList = document.getElementById('cart-list');
const cartTotal =  document.getElementById('cart-total');
const cartQuantity = document.getElementById('cart-quantity');

class Producto {
    constructor(id, nombre, precio, categoria, descripcion, imagen) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.categoria = categoria;
        this.descripcion = descripcion;
        this.imagen = imagen;
    }
}
//Función asíncrona que nos permita cargar los productos desde la API
async function fetchProducts() {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();
        console.log(data);

        allProducts = data.map(product => new Producto (
            product.id,
            product.title,
            product.price,
            product.category,
            product.description,
            product.image
        ));

        showRandomProducts(5);
    } catch (error) {
        console.error("Error al cargar productos:", error);
        document.getElementById('products-container').innerHTML =
            "<p>No se pudieron cargar los productos. Intenta más tarde.</p>";
    }
}
//Función que genera las cards para cada producto
const showProducts = (products) => {
    const container = document.getElementById('products-container');
    container.innerHTML = '';

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'card';

        card.innerHTML = `
            <img src="${product.imagen}" alt="${product.nombre}" class="card-img"
            <div>
                <h3 class="card-title">${product.nombre}</h3>
                <p class="card-text">$ ${product.precio}</p>
                <p class="card-description">${product.descripcion}</p>
                <button class="btn add-btn" data-id="${product.id}">Agregar al carrito</button>
            </div>    
            `;

        container.appendChild(card);    
    });

    connectCardBtns();
}
//Función que nos permite mostrar productos aleatorios al cargar la página
const showRandomProducts = (n) => {
    const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
    const randomProducts = shuffled.slice(0, n);
    showProducts(randomProducts);
    showingAll = false;

    const btn = document.getElementById('more-btn');
    btn.textContent = 'Ver más productos';
}
//Función para mostrar/ocultar productos
const toggleProducts = () => {
    const btn = document.getElementById('more-btn');

    if (showingAll) {
        showRandomProducts(5);
        btn.textContent = 'Ver más productos';
    } else {
        showProducts(allProducts);
        btn.textContent = 'Ver menos productos';
        showingAll = true;
    }
}
//Función que permite conectar los botones de agregar al carrito
const connectCardBtns = () => {
    const addBtns = document.querySelectorAll('.add-btn');
    addBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            addToCart(id);
        });
    });
}
//Funciones para abrir/cerrar el modal
const openCartModal = () => {
    cartModal.style.display = 'block';
}

const closeCartModal = () => {
    cartModal.style.display = 'none';
}
//Función para añadir productos al carrito
const addToCart = (id) => {
    const product = allProducts.find(p => p.id === id);
    if (!product) return;

    const existingItem = productsInCart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.cantidad++;
    } else {
        productsInCart.push({ ...product, cantidad: 1 });
    }
    updateCart();
}
//Función que actualiza el carrito
const updateCart = () => {
    cartList.innerHTML = '';

    let total = 0;
    let quantity = 0;

    productsInCart.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        quantity += item.cantidad;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.nombre}</td>
            <td>
                <button class="quantity-minus btn" data-id="${item.id}">-</button>
                <span>${item.cantidad}</span>
                <button class="quantity-plus btn" data-id="${item.id}">+</button>
            </td>
            <td>$ ${item.precio.toFixed(2)}</td>
            <td>$ ${subtotal.toFixed(2)}</td>
        `;
        cartList.appendChild(row);
    });

    cartTotal.textContent = `$ ${total.toFixed(2)}`;
    cartQuantity.textContent = quantity;

    cartList.querySelectorAll('.quantity-minus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            changeQuantity(Number(e.currentTarget.dataset.id), -1)
        });
    });

    cartList.querySelectorAll('.quantity-plus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            changeQuantity(Number(e.currentTarget.dataset.id), +1)
        });
    });
}
//Función para limpiar el carrito
const clearCart = () => {
    productsInCart.length = 0;
    updateCart();
}
//Función que permite disminuir/aumentar la cantidad de productos del carrito utilizando botones
const changeQuantity = (id, delta) => {
    const item = productsInCart.find(item => item.id === id);
    if(!item) return;

    item.cantidad += delta;
    if(item.cantidad <= 0) {
        const i = productsInCart.findIndex(p => p.id === id);
        productsInCart.splice(i, 1);
    }

    updateCart();
}
//Evento que muestra los productos cuando carga el DOM
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();

    const showingAllBtn = document.getElementById('more-btn');
    showingAllBtn.addEventListener('click', toggleProducts);
})

