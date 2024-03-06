const express = require('express');
const router = express.Router();

// 
// 경로: "http://localhost:3000/api/get/reqularRecipe"
router.get("/", auth, (req, res) => {
    
});

module.exports = router;