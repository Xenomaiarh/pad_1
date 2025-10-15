const { PrismaClient } = require("@prisma/client");
const prisma = require("../utills/db");

async function uploadMainImage(req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "Nema otpremljenih fajlova" });
    }

    const uploadedFile = req.files.uploadedFile;

    uploadedFile.mv('../public/' + uploadedFile.name, (err) => {
      if (err) {
        return res.status(500).send(err);
      }
  
      res.status(200).json({ message: "Fajl je uspešno otpremljen" });
    });
  }

  module.exports = {
    uploadMainImage
};