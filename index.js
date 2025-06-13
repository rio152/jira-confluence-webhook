const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());
 
// ✅ CONFIGURA QUI I TUOI DATI REALI
const CONFLUENCE_BASE_URL = 'https://ilariotrial.atlassian.net/wiki'; // <--- Modifica
const SPACE_KEY = 'TESST'; // <--- Modifica con il tuo Space Key
//const AUTH = Buffer.from('ilario.azzollini@euris.it:ATATT3xFfGF0z-IZ7-8SxSFcdbC6SCe0vMMHm-zJaPMdrXGuVUv2iDfl2Pfc6TF_7rdsga4ZGDfW6HmqlOzbsxjzmE-wOkFbkqd87JxA4vV7u1Tw5-sAzKiIAvKKf6G1hZt13D_FF1N01LWPKVszVR9C82vzHVSz86dJqXEk0asPWQhcuDbzCbs').toString('base64'); // <--- Modifica
 
const HEADERS = {
  //Authorization: `Basic ${AUTH}`,
'Authorization': `Basic ${Buffer.from(
      'ilario.azzollini@euris.it:ATATT3xFfGF0MyffizXT1p0EXAo78HDyt-_jvlnIu53oj2vhXTH-m5M-6-hBBOAKtU2cTD6xfUjCSe65q6AME5t_-B_gKO3NueoSK9njBxVZ8Ub0xEcqA9rmuo4EfYmlp_mKoeeafdzJ8jyBp1lg67_OA6qEy2AQesw_AIu5XLpF66kL1NxV4Nc=7A3E7B4E'
    ).toString('base64')}`,
    'Accept': 'application/json',
  'Content-Type': 'application/json'
};
 
// ✅ Questo è l'endpoint che Jira chiamerà
app.post('/create-figlia', async (req, res) => {
  try {
    console.log('✅ Webhook ricevuto');
    const { issue } = req.body;
    const fields = issue.fields;
 
    const pageId = parseInt(fields.customfield_10040); // <--- Campo custom con ID della madre
    const titoloFiglia = fields.customfield_10039 || 'Nuova Pagina';
    const templateId = 1900545;
 
const templateResponse = await axios.get(
  `${CONFLUENCE_BASE_URL}/rest/api/content/${templateId}?expand=body.storage`,
  { headers: HEADERS }
);
 
const templateContent = templateResponse.data.body.storage.value;
 
await axios.post(
      `${CONFLUENCE_BASE_URL}/rest/api/content`,
      {
        type: 'page',
        title: `${titoloFiglia} - Introductory Interview`,
        space: { key: SPACE_KEY },
        ancestors: [{ id: pageId }],
        body: {
          storage: {
            value: templateContent,
            representation: 'storage'
          }
        }
      },
      { headers: HEADERS }
    );

    await axios.post(
      `${CONFLUENCE_BASE_URL}/rest/api/content`,
      {
        type: 'page',
        title: `${titoloFiglia} - Technical Interview`,
        space: { key: SPACE_KEY },
        ancestors: [{ id: pageId }],
        body: {
          storage: {
            value: templateContent,
            representation: 'storage'
          }
        }
      },
      { headers: HEADERS }
    );

    await axios.post(
      `${CONFLUENCE_BASE_URL}/rest/api/content`,
      {
        type: 'page',
        title: `${titoloFiglia} - Extra Interview`,
        space: { key: SPACE_KEY },
        ancestors: [{ id: pageId }],
        body: {
          storage: {
            value: templateContent,
            representation: 'storage'
          }
        }
      },
      { headers: HEADERS }
    );
 
console.log(`✅ Pagina figlia creata con ID: ${response.data.id}`);
    res.status(200).send('Pagina figlia creata con successo!');
  } catch (err) {
    console.error('❌ Errore:', err.response?.data || err.message);
    res.status(500).send('Errore nella creazione della pagina figlia.');
  }
});
 
// 🔁 Il server deve ascoltare sulla porta giusta per Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server attivo su porta ${PORT}`);
});
