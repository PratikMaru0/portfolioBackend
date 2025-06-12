import express from "express";

const router = express.Router();

router.get("/experience", (req, res) => {
  res.send("Experience");
});
router.post("/experience", (req, res) => {
  res.send("Experience");
});
router.patch("/experience", (req, res) => {
  res.send("Experience");
});
router.delete("/experience", (req, res) => {
  res.send("Experience");
});

export default router;
