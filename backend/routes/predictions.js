const express = require('express');
const authenticateToken = require('../middleware/authMiddleware');
const { generatePrediction } = require('../services/claudeService');
const { sendPredictionReport } = require('../services/emailService');

const router = express.Router();

// POST /api/predictions — protected, generates AI prediction
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { cases, deaths, region, cfr, sendEmail } = req.body;

    if (!cases || !deaths || !region || cfr === undefined) {
      return res.status(400).json({
        message: 'All fields are required: cases, deaths, region, cfr.'
      });
    }

    if (isNaN(cases) || isNaN(deaths) || isNaN(cfr)) {
      return res.status(400).json({ message: 'Cases, deaths, and CFR must be numbers.' });
    }

    const prediction = await generatePrediction({
      cases: Number(cases),
      deaths: Number(deaths),
      region: String(region),
      cfr: Number(cfr)
    });

    if (sendEmail) {
      sendPredictionReport(req.user.email, req.user.name, {
        cases, deaths, region, cfr
      }, prediction).catch(err =>
        console.error('Prediction email failed:', err.message)
      );
    }

    res.json({ success: true, prediction });
  } catch (err) {
    console.error('Prediction error:', err);
    if (err instanceof SyntaxError) {
      return res.status(500).json({ message: 'AI response parsing error. Please retry.' });
    }
    res.status(500).json({ message: 'Failed to generate prediction. Please try again.' });
  }
});

module.exports = router;
