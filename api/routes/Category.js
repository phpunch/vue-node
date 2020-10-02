const mongoose = require("mongoose");
const Category = mongoose.model("category");

module.exports = app => {
  // Get all Categories
  app.get("/api/category", async (req, res) => {
    const category = await Category.find();
    res.send({ status: "success", data: category });
  });

  // Store Category
  app.post("/api/category", async (req, res) => {
    const category = await new Category();
    category.name = req.body.name;
    category.sort = req.body.sort;
    category.save();
    res.send({ status: "success", messages: "create success !!" });
  });

  // Get Specific Category by ID
  app.get("/api/category/:id", async (req, res) => {
    const category = await Category.findById(req.params.id);
    res.send({ status: "success", data: category });
  });

  // Update Category
  app.post("/api/category/:id", async (req, res) => {
    const category = await Category.findById(req.params.id);
    category.name = req.body.name;
    category.sort = req.body.sort;
    category.save();
    res.send({ status: "success", messages: "update success !!" });
  });

  // Delete Category
  app.delete("/api/category/:id", async (req, res) => {
    const category = await Category.findById(req.params.id);
    category.delete();
    res.send({ status: "success", messages: "delete success !!" });
  });
};
