const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'secure123') {
        res.status(200).json({ message: 'Authenticated' });
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
});

module.exports = router;
