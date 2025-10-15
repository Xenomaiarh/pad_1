const express = require("express");
const router = express.Router();
const {
  getAllMerchants,
  getMerchantById,
  createMerchant,
  updateMerchant,
  deleteMerchant,
} = require("../controllers/merchant");

router.get("/", getAllMerchants);

router.get("/:id", getMerchantById);

router.post("/", createMerchant);

router.put("/:id", updateMerchant);

router.delete("/:id", deleteMerchant);

module.exports = router;