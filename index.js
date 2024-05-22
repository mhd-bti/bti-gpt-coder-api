const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const generatecode = require('./control/generatecode.js');
const deploy = require('./control/deploy.js');
const adddemo = require('./control/adddemo.js');

const app = express();
const port = 5000;

app.use(bodyParser.json({ limit: '100mb' }));
app.use(cors());

// コードを生成する
app.post('/api/generate-code', async (req, res) => {
  await generatecode.run(req, res);
});

// コードを実装に反映する
app.post('/api/post-code', async (req, res) => {
  await deploy.run(req, res);
});

// コードをデモに追加する
app.post('/api/add-demo', async (req, res) => {
  await adddemo.run(req, res);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
