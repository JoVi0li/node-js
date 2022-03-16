
const express = require("express");
const { v4: uuidv4 } = require("uuid")

const app = express();

app.use(express.json());

const customers = [];


///Middlewares

function verifyIfExistsAccountByCPF(req, resp, next) {
  const { cpf } = req.params;
  const customer = customers.find((customer) => customer.cpf === cpf);

  if (!customer) {
    return resp.status(400).json({
      messsage: "Usuário não encontrado"
    });
  }

  req.customer = customer;

  return next();
}

function getBalance(statement) {
  const balance = statement.reduce((acc, operation) => {
    if (operation.type === "credit") {
      return acc + operation.amount;
    } else {
      return acc - operation.amount
    }

  }, 0);

  return balance;
}


///Endpoints

app.post("/account", (req, res) => {
  const { cpf, name } = req.body;

  const customerAlreadyExists = customers.some(
    (customer) => customer.cpf === cpf
  );

  if (customerAlreadyExists) {
    return res.status(400).json({
      error: "Usuário já existe."
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

app.post("/deposit/:cpf", verifyIfExistsAccountByCPF, (req, resp) => {
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
    message: "Transação realizada.",
    statement: customer.statement
  })

});

app.post("/withdraw/:cpf", verifyIfExistsAccountByCPF, (req, resp) => {
  const { amount } = req.body;

  const { customer } = req;

  const balance = getBalance(customer.statement);

  if (balance < amount) {
    return resp.status(400).json({
      error: "Saldo insuficiente."
    });
  }

  const statementOperation = {
    amount,
    created_at: new Date(),
    type: "debit"
  };

  customer.statement.push(statementOperation);

  return resp.status(201).json({
    message: "Saque realizado com sucesso.",
    statement: customer.statement
  });
});

app.get("/statement/:cpf/date", verifyIfExistsAccountByCPF, (req, resp) => {
  const { customer } = req;
  const { date } = req.query;

  const dateFormat = new Date(date + " 00:00");

  const statement = customer.statement.filter(
    (statement) =>
      statement.created_at.toDateString() ===
      new Date(dateFormat).toDateString()
  );

  return resp.status(200).json({ statement });
});

app.put("/account/:cpf", verifyIfExistsAccountByCPF, (req, resp) => {
  const { name } = req.body;
  const { customer } = req;

  customer.name = name;

  return resp.status(201).json({
    message: "Usuário atualizado com sucesso.",
    customer
  });
});

app.get("/account/:cpf", verifyIfExistsAccountByCPF, (req, resp) => {
  const customer = customers.find(c => c.cpf === req.params.cpf);

  return resp.status(200).json({
    message: "Usuário encontrado.",
    customer
  });
});

app.delete("/account/:cpf", verifyIfExistsAccountByCPF, (req, resp) => {
  const { customer } = req;

  customers.splice(customer, 1);

  return resp.status(200).json({
    message: "Usuário excluido com sucesso.",
    customers
  });
});

app.get("/balance/:cpf", verifyIfExistsAccountByCPF, (req, resp) => {
  const { customer } = req;

  const balance = getBalance(customer.statement);

  return resp.status(200).json({
    message: "Saldo recuperado com sucesso",
    balance
  });
});

app.listen(3333);