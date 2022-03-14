const { response } = require("express");
const { application } = require("express");
const express = require("express");
const { v4: uuidv4 } = require("uuid")

const app = express();

app.use(express.json());

const customers = [];

function verifyIfExistsAccountByCPF(req, resp, next) {
  const { cpf } = req.params;
  const customer = customers.find((customer) => customer.cpf === cpf);

  if (!customer) {
    return resp.status(400).json({
      error: "Customer Not Found"
    });
  }

  req.customer = customer;

  return next();
}

app.post("/account", (req, res) => {
  const { cpf, name } = req.body;

  const customerAlreadyExists = customers.some(
    (customer) => customer.cpf === cpf
  );

  if (customerAlreadyExists) {
    return res.status(400).json({
      error: "Customer Already Exists"
    });
  }

  customers.push({
    id: uuidv4(),
    name,
    cpf,
    statement: []
  });

  return res.status(201).send();
});

app.get("/statement/:cpf", verifyIfExistsAccountByCPF, (req, resp) => {
  const { customer } = req;

  return resp.status(200).json({
    statement: customer.statement
  });
});

app.post("/deposit/:cpf",verifyIfExistsAccountByCPF, (req, resp) => {
  const { description, amount } = req.body;

  const { customer } = req;

  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: "credit"
  };

  customer.statement.push(statementOperation);

  return resp.status(201).json({
    message: "Transação realizada",
    statement: customer.statement
  })

});

app.listen(3333);