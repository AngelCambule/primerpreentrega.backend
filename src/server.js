import express from 'express'
import handlebars from 'express-handlebars'
import __dirname from './__dirname.js'
import viewRouter from "./routes/views.routes.js";
import productRouter from './routes/ProductRouter.js'
import cartRouter from './routes/CartRouter.js'
import mongoose from 'mongoose';
import { password, PORT, db_name } from './env.js'
import { cartModel } from "./models/models.js"
import Handlebars from "handlebars"
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access"

import { Server } from 'socket.io'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const httpServer = app.listen(PORT, () => console.log(`Servidor iniciado en el puerto ${PORT}`))

const socketServer = new Server(httpServer)

app.set('view engine', 'hbs')
app.set('views', `${__dirname}/views`)

app.use("/", viewRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use(express.static(`${__dirname}/public`))

app.engine('hbs', handlebars.engine({
    extname: 'hbs',
    defaultLayout: 'main',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}))

mongoose.connect(`mongodb+srv://jkzcs:${password}@cluster0.xnombsi.mongodb.net/${db_name}?retryWrites=true&w=majority`)
.then(() => {
    console.log('DB Connect');
})
.catch((err) => {
    console.log(err);
})

socketServer.on("connection", (socketClient) => {

})