
//Variables: Nombre de cliente, Lista de Productos, Total de la compra, Descuento | Constantes: Monto para aplicar descuento, Maximo de productos permitidos
//Validaciones de carrito vacío, precio o cantidad invalida
//Funciones: Agregar producto, Eliminar producto, Calcular total, Aplicar descuento, Mostrar resumen de compra
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
                <button class="btn add-btn" data-id=${product.id}>Agregar al carrito</button>
            </div>    
            `;

        container.appendChild(card);    
    });
}

const showRandomProducts = (n) => {
    const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
    const randomProducts = shuffled.slice(0, n);
    showProducts(randomProducts);
    showingAll = false;

    const btn = document.getElementById('more-btn');
    btn.textContent = 'Ver más productos';
}

const toggleProducts = () => {
    const btn = document.getElementById('more-btn');

    if (showingAll) {
        showRandomProducts(5);
        btn.textContent = 'Ver más productos';
    } else {
        showProducts(allProducts);
        btn.textContent = 'Ver menos productos';
        showingAll = true;x
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();

    const showingAllBtn = document.getElementById('more-btn');
    showingAllBtn.addEventListener('click', toggleProducts);
})

