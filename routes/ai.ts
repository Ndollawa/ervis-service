import express from "express";
const router = express.Router();
import { reviewContract } from "../services/ai";

router.post("/review", async (req, res) => {
  const { contract, agreement_type, applicable_law, sector, party } = req.body;

  if (contract && agreement_type && applicable_law && sector && party) {
    try {
      const result = await reviewContract({
        contract,
        agreement_type,
        applicable_law,
        sector,
        party,
      });
      return res.status(200).send(result);
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    }
  } else {
    return res.status(400).send("An en error occurred");
  }
});

export default router;
