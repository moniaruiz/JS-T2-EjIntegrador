/*
A continuacion podemos encontrar el código de un supermercado que vende productos.
El código contiene
    - una clase Producto que representa un producto que vende el super
    - una clase Carrito que representa el carrito de compras de un cliente
    - una clase ProductoEnCarrito que representa un producto que se agrego al carrito
    - una función findProductBySku que simula una base de datos y busca un producto por su sku
El código tiene errores y varias cosas para mejorar / agregar
​
Ejercicios
1) Arreglar errores existentes en el código
    a) Al ejecutar agregarProducto 2 veces con los mismos valores debería agregar 1 solo producto con la suma de las cantidades.    
    b) Al ejecutar agregarProducto debería actualizar la lista de categorías solamente si la categoría no estaba en la lista.
    c) Si intento agregar un producto que no existe debería mostrar un mensaje de error.
​
2) Agregar la función eliminarProducto a la clase Carrito
    a) La función eliminarProducto recibe un sku y una cantidad (debe devolver una promesa)
    b) Si la cantidad es menor a la cantidad de ese producto en el carrito, se debe restar esa cantidad al producto
    c) Si la cantidad es mayor o igual a la cantidad de ese producto en el carrito, se debe eliminar el producto del carrito
    d) Si el producto no existe en el carrito, se debe mostrar un mensaje de error
    e) La función debe retornar una promesa
​
3) Utilizar la función eliminarProducto utilizando .then() y .catch()
​*/


// Cada producto q vende el super se crea con esta clase:
class Producto {
    sku;
    nombre;
    categoria;
    precio;
    stock;

    constructor(sku, nombre, precio, categoria,  stock){
        this.sku = sku;
        this.nombre = nombre;
        this.categoria = categoria;
        this.precio = precio;

        // Si no se define stock inicial, sera 10:
        if(stock){
            this.stock = stock;
        }else{
            this.stock = 10;
        }
    }
}

// Productos q vende el super:
const queso = new Producto('KS944RUR', 'Queso', 10, 'lacteos',4);
const gaseosa = new Producto('FN312PPE', 'Gaseosa', 5, 'bebidas');
const cerveza = new Producto('PV332MJ', 'Cerveza', 20, 'bebidas');
const arroz = new Producto('XX92LKI', 'Arroz', 7, 'alimentos', 20);
const fideos = new Producto('UI999TY', 'Fideos', 5, 'alimentos');
const lavandina = new Producto('RT324GD', 'Lavandina', 9, 'limpieza');
const shampoo = new Producto('OL883YE', 'Shampoo', 3, 'higiene', 50);
const jabon = new Producto('WE328NJ', 'Jabon', 4, 'higiene', 3);

// Listado de productos, simula una BD:
const productosDelSuper = [queso, gaseosa, cerveza, arroz, fideos, lavandina, shampoo, jabon];

// Se crea un carrito vacio por cada cliente:
class Carrito {
    productos;
    categorias;
    precioTotal;

    constructor() {
        this.precioTotal = 0;
        this.productos = [];
        this.categorias = [];

    }

    // Función que agrega @{cantidad} de productos con @{sku} al carrito:

    async agregarProducto(sku, cantidad) {
        console.log(`Agregando: ${cantidad} ${sku}`);

      try{

        //Busco el producto en la pseudo BD:
        const producto = await findProductBySku(sku);
        console.log("Producto encontrado en la BD: ",producto);

        //Verifico si el producto existe en el carrito:
        const indexProdExiste = this.productos.findIndex(p => p.sku === producto.sku);

        if(indexProdExiste >= 0){

            //Agrego la cantidad del producto a la existente:
            this.productos[indexProdExiste].cantidad += cantidad;
            //Actualizo el precio total del carrito:
            this.precioTotal += producto.precio * cantidad;

        }else{

            //Creo un nuevo producto:
            const nuevoProducto = new ProductoEnCarrito(sku, producto.nombre, cantidad);
            this.productos.push(nuevoProducto);
            this.precioTotal = this.precioTotal + (producto.precio * cantidad);
            
            //Si no existe la categoria del nuevo producto, la agrego:
            if(!this.categorias.includes(producto.categoria)){

                this.categorias.push(producto.categoria);
            }
         }

       }
       catch(error){ 

        console.log(`El producto no existe! `)
       }
    }

    // Función que elimina @{cantidad} de productos con @{sku} al carrito:

    async eliminarProducto(sku, cantidad){
        console.log(`Eliminando: ${cantidad} ${sku}`);

        const producto = await findProductBySku(sku);
        return new Promise((resolve, reject) => {

            //Validacion de la cantidad ingresada:
            if(cantidad < 1) reject ("Por favor, ingrese un numero mayor a 0");

            //Verifico si el producto existe en el carrito:
            const indexProdEnCarrito = this.productos.findIndex(p => p.sku === producto.sku);

            if(indexProdEnCarrito >= 0){
                const productoEnCarrito = this.productos[indexProdEnCarrito];
                
                //Si la cantidad ingresada es menor a la existente en el carrito, la resto:
                if(cantidad < productoEnCarrito.cantidad){
                    this.productos[indexProdEnCarrito].cantidad -= cantidad;
                    this.precioTotal -= producto.precio * cantidad;

                    resolve(`Se elimino con exito ${cantidad} unidad/es del producto: ${productoEnCarrito.nombre} SKU: ${sku}`);

                }else{

                    //Si la cantidad ingresada es mayor o igual a la existente en el carrito, elimino el producto:
                    this.productos.splice(indexProdEnCarrito, 1);
                    this.precioTotal -= producto.precio * productoEnCarrito.cantidad;

                    resolve(`Se elimino con exito el producto: ${productoEnCarrito.nombre} SKU: ${sku}`);


                }

            }else{
                
                reject(`No existe el producto SKU: ${sku} en el carrito.`);
                
            }

        });
    }

} 


// Cada producto q se agrega al carrito, se crea con esta clase:

class ProductoEnCarrito {
    sku;
    nombre;
    cantidad;

    constructor(sku, nombre, cantidad){
        this.sku = sku;
        this.nombre = nombre;
        this.cantidad = cantidad;
    }
}

// Funcion q busca un producto por SKU en la pseudo BD:

function findProductBySku(sku) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const foundProduct = productosDelSuper.find(product => product.sku === sku);
            if(foundProduct){
                resolve(foundProduct);
            }else{
                reject(`Product ${sku} not found`);

            }
        }, 1700);
    });
}

// Funcion para testear el programa:

async function test(){

    const carrito = new Carrito();
    console.log("-------------------------------------------");
    await carrito.agregarProducto('WE328NJ', 2);
    await carrito.agregarProducto('WE328NJ', 2);
    await carrito.agregarProducto('E328N', 1);
    console.log("");
    await carrito.agregarProducto('KS944RUR',3);
    await carrito.agregarProducto('XX92LKI', 4);

    console.log("--------------------------------------------------------------------");
    console.log(carrito);
    console.log("--------------------------------------------------------------------");

    
    await carrito.eliminarProducto('XX92LKI',1)
    .then(res => console.log(res))
    .catch(error => console.log(error))

    console.log("---------------------------------------------------------------------");
    console.log(carrito);
    console.log("---------------------------------------------------------------------");
    
}

test();
    