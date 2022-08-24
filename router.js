const express = require("express");
const router = express.Router();
const app = express();

router.get("/", () => {
  return "Home";
});

module.exports = router;
