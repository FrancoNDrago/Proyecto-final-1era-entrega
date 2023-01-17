const DEFAULT_PATH = "./database/products.json";
const {FileManager} = require("./FileManager");
const fm = new FileManager();

class ProductManager {
    _path = null;
    productos = [];

    constructor(path = DEFAULT_PATH){
        this._setPath(path);
    }

    _setPath(path){
        this._path = path;
    }

    addProduct(producto){
        if (!producto) return false;

        let esProductoCompleto  = this._validarCamposObligatorios(producto);

        if (!esProductoCompleto.status) {
            return esProductoCompleto;
        }

        if (this.existeProducto(producto)) throw `Este producto ya existe (${producto.title})`;

        producto.id = this._get_last_id() + 1;

        this.productos.push(producto);

        return {status: fm.guardarArchivo(this._path, this.productos)};
    }   

    addProducts(productos){
		productos.forEach(producto => this.addProduct(producto));
		return {status: true}
    }

    existeProducto(producto){
        if (!this.productos.lenght) {
            this.productos = fm.leerArchivo(this._path);
        }

        return (this.productos.find(actual => producto.code == actual.code) !== undefined)
    }

	existeIdProducto(idProducto){
		if (!this.productos.length) {
			this.productos = fm.leerArchivo(this._path);
		}
		return (this.productos.find(actual => actual.id == idProducto) !== undefined);
	}

	getProducts(){
		this.productos = fm.leerArchivo(this._path);
		return this.productos;
	}

    getProductsById(id){
        let producto = this.productos.find(actual => id == actual.id);	
		
		if (producto !== undefined) return producto;

		return {status: false, message: 'El producto el ID ' + id + ' no existe'}; 
    }

    setProducts(productos){
		this.productos = productos;
	}

	updateProduct(idProducto, data){
		this.productos = fm.leerArchivo(this._path);

		delete data.id;

		if (!this.existeIdProducto(idProducto)) {
			return {status: false, message: "Producto no encontrado"};
		}

		for (let indice in this.productos) {
			if (this.productos[indice].id == idProducto) {
				let productoActualizado = {...this.productos[indice], ...data};
				this.productos[indice] = productoActualizado;
				break;
			}
		}

		return {status: fm.guardarArchivo(this._path, this.productos)};
	}

	deleteProduct(idProducto){
		this.productos = fm.leerArchivo(this._path);
		
		if (!this.existeIdProducto(idProducto)) {
			return {status: false, message: "Producto no encontrado"};
		}
		
		this.productos = this.productos.filter(producto => producto.id != idProducto);
		return {status: fm.guardarArchivo(this._path, this.productos)};
	}

	_validarCamposObligatorios(producto) {
		const camposObligatorios = ["title", "description", "code", "price", "status", "stock", "category"];
		for (let i = 0; i < camposObligatorios.length; i++) {
			if (producto[camposObligatorios[i]] == undefined) {
				return  {status: false, message: `Falta el campo obligatorio ${camposObligatorios[i]}`};
			}
		}

		return {status: true};
	}

	_get_last_id() {
		let ultimoId = 0;

		if (!this.productos.length) return -1;

		return this.productos[this.productos.length - 1].id;
	}
}

module.exports.ProductManager = ProductManager;
