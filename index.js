const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());
 
// 🔧 CONFIGURA QUESTI VALORI
const CONFLUENCE_BASE_URL = 'https://ilariotrial.atlassian.net/wiki';
const SPACE_KEY = 'TESST';
const AUTH = Buffer.from('ilario.azzollini@euris.it:ATATT3xFfGF0zKKC6gvW4tBD8Qw_MK3JhV4bEoqFLCaE2ZMtgR7CiBC0glCBPBFT5_IneiJqsqdIuQ-YFu4e7tBvBH-hVTRhCzzYOVL-3TIkJM-a-168uW8NJoFbkgDPn_T1O6XgUy9_hqc3H1b2qBEaPA3N8fXzoYn_G1_1NxCEMfM1jNP3Maw=E7D7F405').toString('base64');
 
const HEADERS = {
  Authorization: `Basic ${AUTH}`,
  'Content-Type': 'application/json'
};
 
app.post('/create-pages', async (req, res) => {
  try {
    const { fields } = req.body.issue;
    const nome = fields.customfield_10039;
    const cognome = fields.customfield_10040;
    const fullName = `${nome} ${cognome}`;
 
    // Crea la pagina madre
    const madre = await axios.post(
      `${CONFLUENCE_BASE_URL}/rest/api/content`,
      {
        type: 'page',
        title: `${fullName} - Documentazione`,
        space: { key: SPACE_KEY },
        body: {
          storage: {
            value: `<p>Pagina madre per ${fullName}</p>`,
            representation: 'storage'
          }
        }
      },
      { headers: HEADERS }
    );
 
    const madreId = madre.data.id;
 
    // Crea 3 pagine figlie
    const figli = ['Documento A', 'Documento B', 'Documento C'];
    for (const titolo of figli) {
      await axios.post(
        `${CONFLUENCE_BASE_URL}/rest/api/content`,
        {
          type: 'page',
          title: `${fullName} - ${titolo}`,
          ancestors: [{ id: madreId }],
          space: { key: SPACE_KEY },
          body: {
            storage: {
              value: `<p>Contenuto per ${titolo}</p>`,
              representation: 'storage'
            }
          }
        },
        { headers: HEADERS }
      );
    }
 
    res.status(200).send('Pagine create!');
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send('Errore durante la creazione delle pagine');
  }
});
 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Webhook attivo su porta ${PORT}`);
});
 
