const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const dummyPDF = 'This would be a PDF download response.';
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="report.pdf"');
    res.send(dummyPDF);
});

module.exports = router;
