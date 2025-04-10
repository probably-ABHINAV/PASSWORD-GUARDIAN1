const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.post('/', (req, res) => {
    const { password, analysis } = req.body;
    const logEntry = { password, analysis, time: new Date().toISOString() };
    const filePath = path.join(__dirname, '../data/logs.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        const logs = err ? [] : JSON.parse(data);
        logs.push(logEntry);
        fs.writeFile(filePath, JSON.stringify(logs, null, 2), () => {
            res.status(200).json({ message: 'Password logged successfully' });
        });
    });
});

module.exports = router;
