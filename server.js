const express = require("express");
const db = require("./data/dbConfig.js");

const server = express();
server.use(express.json());

// HELPERS
function getAllAccounts() {
  return db("accounts");
}

function getAccountById(id) {
  return db("accounts").where({ id });
}

function createNewAccount({ name, budget }) {
  return db("accounts").insert({ name, budget });
}

function updateAccountById(id, { name, budget }) {
  return db("accounts")
    .where({ id })
    .update({ name, budget });
}

function deleteAccountById(id) {
  return db("accounts")
    .where({ id })
    .del();
}

// ENDPOINTS
server.get("/accounts", async (req, res, next) => {
  try {
    const accounts = await getAllAccounts();
    res.status(200).json(accounts);
  } catch (error) {
    res.status(500).json({
      message: "Could not retrieve accounts."
    });
  }
});

server.get("/accounts/:id", async (req, res) => {
  try {
    const account = await getAccountById(req.params.id);
    res.status(200).json(account);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Could not retrieve account with ID ${req.params.id}` });
  }
});

server.post("/accounts", async (req, res) => {
  try {
    const newAccountId = await createNewAccount(req.body);
    const newAccount = await getAccountById(newAccountId[0]);
    res.status(201).json(newAccount);
  } catch (error) {
    res.status(500).json({ message: "Could not add account." });
  }
});

server.put("/accounts/:id", async (req, res) => {
  try {
    const { name, budget } = req.body;
    if (!req.body.name || !req.body.budget) {
      json
        .status(500)
        .json({ message: "NAME and BUDGET inputs are required!" });
    } else {
      const target = await updateAccountById(req.params.id, {
        name,
        budget
      });
      const updatedAccount = await getAccountById(req.params.id);
      res.status(200).json(target);
    }
  } catch (error) {
    res.status(500).json({
      message: `Could not update account with ID ${req.params.id}.`
    });
  }
});

server.delete("/accounts/:id", async (req, res) => {
  try {
    const target = await deleteAccountById(req.params.id);
    res
      .status(200)
      .json({ message: `Account ${req.params.id} has been deleted` });
  } catch (error) {
    res.status(500).json({
      message: `Could not delete account ${req.params.id}.`
    });
  }
});

module.exports = server;
