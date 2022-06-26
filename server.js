import * as fsp from "fs/promises"
// import * as fs from "fs"
// import http from "http"
import express from "express"
import mongoose from "mongoose";

// function readMyFile(fileName) {
//     fsp.readFile(`./${fileName}`,



const app = express()
const Product = mongoose.model("product", { title: String, completed: Boolean, price: Number })
//middleware
app.use(express.json());
app.get("/", (req, res) => {
    res.send("hello world")
});

app.get("/products", (req, res) => {
    fsp.readFile("./products.json", "utf8").then(Data => res.send(Data));
});

app.get("/products/:productId", (req, res) => {
    const { productId } = req.params;
    fsp.readFile("./products.json", "utf8").then(Data => {
        const products = JSON.parse(Data);
        const product = products.find((product) => product.id === +productId);
        if (product) {
            res.send(product)
        } else {
            res.send("false")
        }
    });
});
function getMaxId(arr) {
    const ids = arr.map((obg) => {
        return obg.id;
    })
    const max = Math.max(...ids);
    return max;
}

app.post('/products', (req, res) => {
    fsp.readFile("./products.json", "utf8").then(data => {
        const products = JSON.parse(data);
        const { title, price, description, category, image, rating } = req.body;
        console.log(products);
        products.push({
            id: getMaxId(products) + 1,
            title,
            price,
            description,
            category,
            image,
            rating,
        })
        fsp.writeFile("./products.json", JSON.stringify(products));
        res.send(products);
    })
})
app.patch("/products/:productId", (req, res) => {
    const { productId } = req.params;
    console.log("I'm on PATCH")
    fsp.readFile("./products.json", "utf8").then((data => {
        if (req.body) {
            const products = JSON.parse(data)
            const productIndex = products.findIndex((product) => product.id === +productId)
            console.log(productIndex)
            products[productIndex] = { ...products[productIndex], ...req.body }
            fsp.writeFile("./products.json", JSON.stringify(products)).then(() => {
                res.send(products)
            }).catch((err) => console.log(error))
        }
    }))
        .catch((err) => res.send(err))

})
app.delete("/products/:productId", (req, res) => {
    const { productId } = req.params;
    console.log("I'm on PATCH")
    fsp.readFile("./products.json", "utf8").then((data => {
        if (req.body) {
            const products = JSON.parse(data)
            const productIndex = products.findIndex((product) => product.id === +productId)
            products.splice(productIndex, 1)
            products[productIndex] = { ...products[productIndex], ...req.body }
            fsp.writeFile("./products.json", JSON.stringify(products)).then(() => {
                res.send(products)
            }).catch((err) => console.log(error))
        }
    }))
        .catch((err) => res.send(err))

})
// mongoose.connect("mongoose://localhost:27017/products").then(() => {
app.listen(8000, () => {
    console.log("listening on port 8000");
    // })
});
// Create HTTP server and listen on port 8000 for requests

// http.createServer((request, response) => {
//     console.log("test");

//     readMyFile("myTextEn.txt")
//     // Set the response HTTP header with HTTP status and Content type
//     // response.writeHead(200, { 'Content-Type': 'text/plain' });

//     // Send the response body "Hello World"
//     response.end("Success");
// }).listen(8000);

// // Print URL for accessing server
// console.log('Server running at http://127.0.0.1:8000/');