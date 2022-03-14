const express = require('express');

const app = express();

app.use(express.json());

// GET - Buscar uma info no servidor
app.get("/courses", (request, response) => {
  return response.json([
    "Curso 1",
    "Curso 2",
    "Curso 3"
  ]);
});

// POST - Inserir uma info no servidor
app.post("/courses", (request, response) => {
  return response.json([
    "Curso 1",
    "Curso 2",
    "Curso 3",
    "Curso 4"
  ]);
});

// PUT - Alterar uma info no servidor
app.put("/courses/:id", (request, response) => {
  return response.json([
    "Curso 6",
    "Curso 2",
    "Curso 3",
    "Curso 4"
  ]);
});

// PATCH - Alterar uma info específica no servidor
app.patch("/courses/:id", (request, response) => {
  return response.json([
    "Curso 6",
    "Curso 7",
    "Curso 3",
    "Curso 4"
  ]);
});

// DELETE - Remover uma info no servidor
app.delete("/courses/:id", (request, response) => {
  return response.json([
    "Curso 6",
    "Curso 2",
    "Curso 4"
  ]);
});

app.listen(3333);