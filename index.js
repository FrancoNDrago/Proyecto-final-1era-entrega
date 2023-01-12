const express = require("express");
const app = express();

const PORT = 8080;

const {productsRouter} = require("./routers/productsRouter");
const {cartsRouter} = require("./routers/cartsRouter");

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.get("*", (req, res) => {
	res.send("Producto no encontrado");
})

app.listen(PORT, () => console.log(`Escuchando en ${PORT}`));