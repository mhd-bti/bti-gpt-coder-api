const OpenAI = require('openai');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const crypto = require('crypto');
// const { channel } = require('diagnostics_channel');
// const { log } = require('console');

// dotenvパッケージを読み込み、環境変数を強制的に上書きする
dotenv.config({ override: true });

const app = express();
const port = 5000;

// OpenAI APIの設定
const openaiModel = process.env.OPENAI_API_MODEL;
const openaiOrganization = process.env.OPENAI_ORGANIZATION;

const openai = new OpenAI(organization = openaiOrganization);

app.use(bodyParser.json());
app.use(cors());

// システムプロンプトを生成する
const generateSystemPrompt = () => {
  return `
あなたは、[React]に精通したプロのITエンジニアです。
以下の入力内容を元に完全なソースコードを生成してください。
なお、生成するソースコードは、最上位の親コンポーネントであるApp（ファイル名：App.jsx）および、必要な子コンポーネントを全て生成してください。

# 出力フォーマット
必ず、以下の完全なJSON形式で出力してください。
結果が0件の場合は、空の配列を出力してください。
結果が1件以上の場合は、必ず配列で出力してください。
JSON形式以外では絶対に出力しないでください。
結果には、filename、code、descriptionを必ず含めてください。
値がない場合には、空文字""を返してください。

{
  "result": [
    {
      "filename": "ファイル名",
      "code": "コードの内容",
      "description": "コードの簡単な説明"
    }
  ]
}

再度の確認ですが、出力はJSON形式でないといけません。
すなわち、"{"で始まり、"}"で終わる必要があります。
`;
};

// ユーザープロンプトを生成する
const generateUserPrompt = (userInput) => {
  return `
  # 入力内容
  ${userInput}  
`;
};

// テスト用ID生成
function generateRandomString(length) {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
}

// リクエストをOpenAI APIに送信する関数
const sendRequestToOpenAI = async (userInput, history, retries = 3, delay = 1000) => {
  try {
    // GPTに渡すプロンプトを生成
    const messages = history;

    // 履歴がない場合は、システムプロンプトを追加する
    if (!history.length) {
      const systemPrompt = generateSystemPrompt();
      console.log(`systemPrompt : ${systemPrompt}`);

      messages.push({ role: "system", content: systemPrompt });
    }

    // 今回のユーザー入力を追加する
    const userPrompt = generateUserPrompt(userInput);
    console.log(`userPrompt : ${userPrompt}`);
    messages.push({ role: "user", content: userPrompt });

    let completion = {};
    if (true) {
      const data = {
        messages: messages,
        model: openaiModel,
      };

      console.log("request data : ", data);

      // OpenAI APIにリクエストを送信する
      completion = await openai.chat.completions.create(data);
    } else {
      const randomString = generateRandomString(10);
      console.log(randomString);

      completion.id = "chatcmpl-" + randomString;
      completion.choices = [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: 'json\n\n' +
              '{\n' +
              '  "result": [\n' +
              '    {\n' +
              '      "filename": "App.jsx",\n' +
              `      "code": "import React, { useState } from 'react';\\n\\nconst App = () => {\\n  const [address, setAddress] = useState('');\\n  const [name, setName] = useState('');\\n  const [age, setAge] = useState(0);\\n  const [confirmation, setConfirmation] = useState(false);\\n  const [submitted, setSubmitted] = useState(false);\\n\\n  const handleAddressChange = (e) => {\\n    setAddress(e.target.value);\\n  };\\n\\n  const handleNameChange = (e) => {\\n    setName(e.target.value);\\n  };\\n\\n  const handleAgeChange = (e) => {\\n    setAge(e.target.value);\\n  };\\n\\n  const handleConfirmation = () => {\\n    setConfirmation(true);\\n  };\\n\\n  const handleSubmit = () => {\\n    setSubmitted(true);\\n  };\\n\\n  return (\\n    <div>\\n      {!confirmation && !submitted && (\\n        <div>\\n          <label>Address:</label>\\n          <input type='text' value={address} onChange={handleAddressChange} />\\n          <br />\\n          <label>Name:</label>\\n          <input type='text' value={name} onChange={handleNameChange} />\\n          <br />\\n          <label>Age:</label>\\n          <input type='number' value={age} onChange={handleAgeChange} />\\n          <br />\\n          <button onClick={handleConfirmation}>Confirm</button>\\n        </div>\\n      )}\\n      {confirmation && !submitted && (\\n        <div>\\n          <p>Confirm Address: {address}</p>\\n          <p>Confirm Name: {name}</p>\\n          <p>Confirm Age: {age}</p>\\n          <button onClick={handleSubmit}>Submit</button>\\n        </div>\\n      )}\\n      {submitted && (\\n        <div>\\n          <h2>Thank you for submitting!</h2>\\n          <p>Address: {address}</p>\\n          <p>Name: {name}</p>\\n          <p>Age: {age}</p>\\n        </div>\\n      )}\\n    </div>\\n  );\\n};\\n\\nexport default App;",\n` +
              '      "description": "Reactコンポーネントとstateを使用して、住所、氏名、年齢のフォームを作成し、確認と送信の2つの画面を表示するアプリケーション"\n' +
              '    },\n' +
              '    {\n' +
              '      "filename": "App.jsx",\n' +
              `      "code": "import React, { useState } from 'react';\\n\\nconst App = () => {\\n  const [address, setAddress] = useState('');\\n  const [name, setName] = useState('');\\n  const [age, setAge] = useState(0);\\n  const [confirmation, setConfirmation] = useState(false);\\n  const [submitted, setSubmitted] = useState(false);\\n\\n  const handleAddressChange = (e) => {\\n    setAddress(e.target.value);\\n  };\\n\\n  const handleNameChange = (e) => {\\n    setName(e.target.value);\\n  };\\n\\n  const handleAgeChange = (e) => {\\n    setAge(e.target.value);\\n  };\\n\\n  const handleConfirmation = () => {\\n    setConfirmation(true);\\n  };\\n\\n  const handleSubmit = () => {\\n    setSubmitted(true);\\n  };\\n\\n  return (\\n    <div>\\n      {!confirmation && !submitted && (\\n        <div>\\n          <label>Address:</label>\\n          <input type='text' value={address} onChange={handleAddressChange} />\\n          <br />\\n          <label>Name:</label>\\n          <input type='text' value={name} onChange={handleNameChange} />\\n          <br />\\n          <label>Age:</label>\\n          <input type='number' value={age} onChange={handleAgeChange} />\\n          <br />\\n          <button onClick={handleConfirmation}>Confirm</button>\\n        </div>\\n      )}\\n      {confirmation && !submitted && (\\n        <div>\\n          <p>Confirm Address: {address}</p>\\n          <p>Confirm Name: {name}</p>\\n          <p>Confirm Age: {age}</p>\\n          <button onClick={handleSubmit}>Submit</button>\\n        </div>\\n      )}\\n      {submitted && (\\n        <div>\\n          <h2>Thank you for submitting!</h2>\\n          <p>Address: {address}</p>\\n          <p>Name: {name}</p>\\n          <p>Age: {age}</p>\\n        </div>\\n      )}\\n    </div>\\n  );\\n};\\n\\nexport default App;",\n` +
              '      "description": "Reactコンポーネントとstateを使用して、住所、氏名、年齢のフォームを作成し、確認と送信の2つの画面を表示するアプリケーション"\n' +
              '    }\n' +
              '  ]\n' +
              '}\n\n' +
              'このような結果です。'
          },
          logprobs: null,
          finish_reason: 'stop'
        }
      ]
    }

    console.log("completion : ", completion);
    console.log("completion.choices : ", completion.choices);

    // 応答内容を取得
    const codesString = completion.choices[0].message.content;
    console.log("codesString : ", codesString);

    // プロンプトと結果を合わせ出力フォーマットに変換
    const jsonObject = {
      id: completion.id,
      messages: messages,
      choice: {
        message: {
          role: completion.choices[0].message.role,
          content: codesString
        }
      }
    };
    console.log("jsonObject : ", jsonObject);

    return jsonObject;
  } catch (error) {
    if (error.response && error.response.status === 429 && retries > 0) {
      console.log('Too Many Requests, retrying...');
      await new Promise(res => setTimeout(res, delay));
      return sendRequestToOpenAI(prompt, retries - 1, delay * 2); // バックオフ戦略
    } else {
      throw error;
    }
  }
};

// 会話履歴を読み込む
const readHistory = (id) => {
  if (!id) {
    return [];
  }

  try {
    const historyRaw = fs.readFileSync(historyFilePath(id), 'utf-8');
    console.log("historyRaw : ", historyRaw);
    return JSON.parse(historyRaw);
  } catch (error) {
    console.error('Error reading history file:', error);
    return []; // Return an empty array if there's an error
  }
};

// 会話履歴を保存する
// [ToDo] 保存失敗した際の処理を追加する
const storeHistory = (result, history) => {
  const newHistory = result.messages;
  newHistory.push(result.choice.message);

  console.log("id : ", result.id);
  console.log("history : ", newHistory);

  try {
    // 非同期的にファイルを書き込む
    fs.writeFile(historyFilePath(result.id), JSON.stringify(newHistory), (err) => {
      if (err) {
        console.error('Error writing file:', err);
      } else {
        console.log('File has been written');
      }
    });

  } catch (error) {
    console.error('Error storing history:', error);
    res.status(500).json({ error: 'Error storing history' });
  }
};

const historyFilePath = (id) => {
  return `history/${id}.json`;
};

// コードを生成する
app.post('/api/generate-code', async (req, res) => {
  const userInput = req.body.userInput;
  const prevId = req.body.prevId;

  console.log("prevId : ", prevId);
  console.log("userInput : ", userInput);

  // 会話履歴を読み込む
  const history = readHistory(prevId);

  try {
    // 会話履歴と併せてOpenAI APIにリクエストを送信する
    const result = await sendRequestToOpenAI(userInput, history);

    // 会話履歴を保存する（履歴に保存する内容はGPTからの応答そのままのため、JSON形式ではない可能性がある）
    storeHistory(result, history);

    // JSON形式に変換（GPTの応答がJSON形式でない場合は、可能な限りJSON形式に変換する）
    const codesString = result.choice.message.content.replace(/^[^\{]*\{/, '{').replace(/\}[^\}]*$/, '}');

    const returnJson = {
      id: result.id,
      codes: JSON.parse(codesString).result
    };

    console.log("returnJson : ", returnJson);

    res.json({ output: returnJson });
  } catch (error) {
    console.error('Error interacting with OpenAI API:', error);
    res.status(500).json({ error: 'Error generating code' });
  }
});

// コードを実装に反映する
app.post('/api/post-code', async (req, res) => {
  const filename = req.body.filename;
  const code = req.body.code;
  const description = req.body.description;

  const filepath = "/home/take/sandbox/react/bti-gpt-code/src/" + filename;

  console.log("filename : ", filename);
  console.log("code : ", code);
  console.log("description : ", description);
  console.log("target file path : ", filepath);

  try {
    // 非同期的にファイルを書き込む
    fs.writeFile(filepath, code, (err) => {
      if (err) {
        console.error('Error writing file:', err);
        res.json({ "result": "failure" });
      } else {
        console.log('File has been written');
        res.json({ "result": "success" });
      }
    });

  } catch (error) {
    console.error('Error storing code:', error);
    res.status(500).json({ error: 'Error posting code' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
