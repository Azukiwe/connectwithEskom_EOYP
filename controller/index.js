const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const route = express.Router();
const {User, Product } = require('../model');
const user = new User();
const product = new Product();
route.get("^/$|/GetConnected_Eskom", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '../views/index.html'));
});
//Users Routes
route.post("/login",bodyParser.json(), (req, res) => {
    user.login(req, res);
});
route.get("/user", (req, res) => {
    user.FetchUser(req, res);
});
route.put("/user/:id", bodyParser.json(), (req, res) => {
    user.updateUser(req, res);
});
route.post("/register", bodyParser.json(), (req, res) => {
    user.createUser(req, res);
});
route.delete("user/:id", (req, res) =>{
    user.deleteUser(req, res);
});
//Products Routes
route.get("/products", (req, res) => {
    product.GetProducts(req, res);
});
route.get("/product/:id", (req, res) => {
    product.GetProduct(req, res);
});
route.post("/product",bodyParser.json(), (req, res) => {
    product.addProduct(req, res);
});
route.put("/product/:id", bodyParser.json(), (req, res) =>{
    product.updateProduct(req, res);
});
route.delete("/product/:id", (req, res) =>{
    product.deleteProduct(req, res);
});

module.exports = route;