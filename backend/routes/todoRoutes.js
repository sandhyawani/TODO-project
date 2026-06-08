const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");

router.post("/add", async (req, res) => {
  const { title, description } = req.body;

  const todo = new Todo({
    title,
    description
  });

  await todo.save();

  res.send("Todo Added");
});

router.get("/", async (req, res) => {
  const todos = await Todo.find();

  res.json(todos);
});
router.delete("/:id", async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);

  res.send("Todo Deleted");
});
router.put("/:id", async (req, res) => {
  const { title, description, status } = req.body;

  await Todo.findByIdAndUpdate(req.params.id, {
    title,
    description,
    status
  });

  res.send("Todo Updated");
});

module.exports = router;