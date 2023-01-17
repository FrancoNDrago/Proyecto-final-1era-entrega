const express = require("express");
const cartsRouter = express.Router();
const {CartsManager} = require("../CartsManager");
const cartsManager = new CartsManager();

cartsRouter.post("/", (req,res) => {
	if (!req.body) {
		res.status(400).send("No se encuentran los productos del carrito");
	}

	let guardado = cartsManager.addCart(req.body);

	if (guardado.status) {
		res.send("Carrito guardado!");
	}else{
		res.status(400).send(guardado.message);
	}
});

cartsRouter.post("/:cid/product/:pid", (req, res) => {
	if (!req.params.cid) {
		res.status(400).send("No se encuentra el CartID");
	}
	if (isNaN(req.params.cid)) {
		res.status(400).send("El ID de Cart debe ser numerico!");
	}
	if (!req.params.pid) {
		res.status(400).send("No se encuentra el ProductID");
	}
	if (isNaN(req.params.pid)) {
		res.status(400).send("El ID del Producto deber ser numerico!");
	}

	let resultado = cartsManager.addProductToCart(req.params.cid, req.params.pid, 1);

	if (resultado.status) {
		res.send("Producto agregado!");
	} else {
		res.status(400).send(resultado.message);
	}
});

cartsRouter.get("/", (req, res) => {
	let resultado = cartsManager.getCarts();

	if (resultado.status) {
		res.send(resultado.carts);
	}else{
		res.status(400).send(resultado.message);
	}
});

cartsRouter.get("/:id", (req, res) => {
	if (!req.params.id) {
		return {status: false, message: "No se encuentra el ID"}
	}

	let resultado = cartsManager.getCart(req.params.id);

	if (resultado.status) {
		res.send(resultado.cart.products);
	} else {
		res.status(404).send(resultado.message);
	}
});

module.exports.cartsRouter = cartsRouter;
