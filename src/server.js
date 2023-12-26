import express from 'express'
import handlebars from 'express-handlebars'
import __dirname from './utils.js'
import viewRouter from "./routes/views.routes.js";

import { Server } from 'socket.io'

const app = express()
const PORT = 5000
const httpServer = app.listen(PORT, () => console.log(`Servidor iniciado en el puerto ${PORT}`))

const socketServer = new Server(httpServer)

app.engine('hbs', handlebars.engine({
    extname: 'hbs',
    defaultLayout: 'main'
}))

app.set('view engine', 'hbs')
app.set('views', `${__dirname}/views`)
app.use("/", viewRouter);
app.use(express.static(`${__dirname}/public`))


socketServer.on("connection", (socketClient) => {
    console.log("Nuevo cliente conectado");
})