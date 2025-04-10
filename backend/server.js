const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const bodyParser = require('body-parser');

const logPasswordRoute = require('./routes/logPassword');
const exportReportRoute = require('./routes/exportReport');
const authRoute = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use(limiter);

app.use('/log-password', logPasswordRoute);
app.use('/export-report', exportReportRoute);
app.use('/auth', authRoute);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
