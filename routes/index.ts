import express from "express";
const router = express.Router();

router.get("/", function (req, res) {
  res.send("Welcome to Ervis Service!");
});

export default router;
