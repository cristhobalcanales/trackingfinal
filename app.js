const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const fs = require("fs");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const filePath = path.join(__dirname, "ubicacion.json");

app.use(express.static(path.join(__dirname, "public")));

// Endpoint para obtener la ubicación actual
app.get("/ubicacion", (req, res) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error al leer el archivo de ubicación");
      return;
    }
    res.json(JSON.parse(data));
  });
});

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  socket.on("ubicacion", (data) => {
    const ubicacion = {
      id: 1,
      latitud: data.latitud,
      longitud: data.longitud,
      timestamp: new Date().toISOString(),
    };

    fs.writeFileSync(filePath, JSON.stringify(ubicacion, null, 2), "utf8");
    console.log(`Ubicación guardada: ${JSON.stringify(ubicacion)}`);
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
