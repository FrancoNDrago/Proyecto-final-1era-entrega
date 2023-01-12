const express = require("express");
const app = express();
const productsRouter = express.Router();
const {ProductManager} = require("../ProductManager");
const productManager = new ProductManager();

productsRouter.get("/", (req, res) => {
	let productos = productManager.getProducts();

	if (!productos.length) {
		res.send([]);
	}

	if (req.query.limit && !isNaN(req.query.limit)) {
		productos = productos.slice(0, req.query.limit);
	}

	res.send(productos);
});

productsRouter.get("/:id", (req, res) => {
	if (isNaN(req.params.id)) {
		res.status(400).send("El ID del producto debe ser numerico");
	}

	let productos = productManager.getProducts();

	if (!productos.length) {
		res.status(404).send(`El producto ${req.params.id} no existe`);
	}

	let productoBuscado = productos.find(producto => producto.id == req.params.id);

	if (!productoBuscado) {
		res.status(404).send(`El producto ${req.params.id} no existe`);
	}

	res.send(productoBuscado);
});

productsRouter.post("/", (req, res) => {
	let producto = req.body.producto;
	let response = productManager.addProduct(producto);

	if (response.status) {
		res.send("Producto añadido");
	}else{
		res.status("400").send(`Error: ${response.message}`);
	}
});

productsRouter.put("/:id", (req, res) => {
	if (!req.params.id) {
		res.status(400).send("No se recibió un ID del producto para actualizarlo!");
	}

	if(!req.body) {
		res.status(400).send("No se recibió el body");
	}

	if(isNaN(req.params.id)) {
		res.status(400).send("El ID del Producto deber ser numerico!")
	}

	let actualizacion = productManager.updateProduct(req.params.id, req.body);

	if(actualizacion.status) {
		res.send("Producto actualizado!");
	}else{
		res.status(404).send(actualizacion.message);
	}
});

productsRouter.delete("/:id", (req, res) => {
	if (!req.params.id) {
		res.status(400).send("No se recibió un ID del producto para actualizarlo!");
	}

	if(isNaN(req.params.id)) {
		res.status(400).send("El ID del producto debe ser numerico!");		
	}

	let eliminacion = productManager.deleteProduct(req.params.id);

	if (eliminacion.status) {
		res.send("Producto eliminado!");
	}else{
		res.status(404).send(eliminacion.message);
	}
});

module.exports.productsRouter = productsRouter;