const DEFAULT_PATH = "./carts.json";
const { FileManager } = require("./FileManager");
const fm = new FileManager();
const { ProductManager } = require("./ProductManager");
const productManager = new ProductManager();

class CartsManager{
	
	_path = null;
	carts = [];

	constructor(path = DEFAULT_PATH){
		this._path = path;
	}

	addCart(productos){
		if (!Array.isArray(productos)) {
			return {status: false, message: "El formato de los productos tiene que ser un array!"};
		}

		if (!productos.length) {
			return {status: false, message: "Listado de productos vacio"};
		}

		let nuevoCarrito = {
			id: this._get_last_id() + 1,
			products: productos
		};
		
		this.carts.push(nuevoCarrito);
		
		return {status: fm.guardarArchivo(this._path, this.carts)};
	}

	addProductToCart(cartId, productId, quantity)
	{
		this.carts = fm.leerArchivo(this._path);

		if (!this.existeCart(cartId)) return {status: false, message: `No existe el carrito con ID: ${cartId}`};
		
		if (!productManager.existeIdProducto(productId)) return {status: false, message: `No existe el product con ID: ${productId}`};

		if (quantity <= 0) return {status: false, message: "La cantidad de unidades a agregar debe ser mayor a cero"};

		let producto = productManager.getProductById(productId);

		if (producto.stock < quantity) return {status: false, message: `El producto ${productId} - ${producto.title} solo tiene disponibes ${producto.stock} unidades y usted desea agregar ${quantity}`};

        
		for (let cart of this.carts) {
			if (cart.id != cartId) continue;

			let existeProductoEnCarrito = false;

			for (let producto of cart.products) {
				
				if (producto.id != productId) continue;

				producto.quantity++;
				existeProductoEnCarrito = true;
				break;
			}

			if (!existeProductoEnCarrito) {
				cart.products.push({id: parseInt(productId), quantity: quantity});
			}
			
			fm.guardarArchivo(this._path, this.carts);
			return {status: true};
		};

		return {status: false, message: "Error al agregar los productos al carrito"};
	}

	existeCart(cartId)
	{
		return (this.carts.find( cart => cart.id == cartId) !== undefined);
	}

	getCarts() {
		this.carts = fm.leerArchivo(this._path);
		
		if (this.carts !== false) {
			return {status: true, carts: this.carts};
		} else {
			return {status: false, message: "No se pudo leer el archivo de carritos"};
		}

	}

	getCart(idCart) {
		this.carts = fm.leerArchivo(this._path);
		
		if (this.carts !== false) {
			let cart = this.carts.find( carrito => carrito.id == idCart);
			if (cart) {
				return {status: true, cart: cart};
			} else {
				return {status: false, message: `No se encontró el carrito con el ID: ${idCart}`};
			}
		} else {
			return {status: false, message: "No se pudo leer el archivo de carritos"};
		}

	}

	_get_last_id() {
		let ultimoId = 0;

		if (!this.carts.length) return -1;

		return this.carts[this.carts.length - 1].id;
	}
}

module.exports.CartsManager = CartsManager;
