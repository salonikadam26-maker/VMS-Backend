const express = require("express");
const {
  getVisitors,
  getVisitorById,
  createVisitor,
  updateVisitor,
  deleteVisitor,
  checkOutVisitor,
} = require("../controllers/visitorController");

const router = express.Router();

router.get("/", getVisitors);
router.get("/:id", getVisitorById);
router.post("/", createVisitor);
router.put("/:id", updateVisitor);
router.delete("/:id", deleteVisitor);
router.post("/:id", checkOutVisitor);

module.exports = router;
