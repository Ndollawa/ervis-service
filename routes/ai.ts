import express from "express";
const router = express.Router();
import { testAIService } from "../services/ai";

router.post("/review", async (req, res) => {
    const { agreement_type, applicable_law, sector, party  } = req.body;

    console.log(req.body);

    try {
        if(agreement_type && applicable_law && sector && party){
            const result = await testAIService({agreement_type, applicable_law, sector, party});
            return res.status(200).json({ ...result });
        } else {
            return res.status(400).send('missing field')
        }
    } catch (err) {
        return res.status(400).send(err);
    }
});

export default router;