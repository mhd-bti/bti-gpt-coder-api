// dotenvパッケージを読み込み、環境変数を強制的に上書きする
const dotenv = require('dotenv');
dotenv.config({ override: true });

const fs = require('fs');
const path = require('path');

const historyDir = process.env.HISTORY_DIR;

// 会話履歴を読み込む
const readHistory = (id, projectName) => {
    if (!id) {
        return [];
    }

    const filepath = historyFilePath(id, projectName);

    console.log("filepath : ", filepath);

    try {
        const historyRaw = fs.readFileSync(filepath, 'utf-8');
        console.log("historyRaw : ", historyRaw);
        return JSON.parse(historyRaw);
    } catch (error) {
        console.error('Error reading history file:', error);
        return []; // Return an empty array if there's an error
    }
};

// 会話履歴を保存する
// [ToDo] 保存失敗した際の処理を追加する
const storeHistory = (result, projectName) => {
    const newHistory = result.messages;
    newHistory.push(result.choice.message);

    console.log("projectName : ", projectName);

    const filepath = historyFilePath(result.id, projectName);

    console.log("projectName : ", projectName);
    const dirname = path.dirname(filepath);

    // 出力先ディレクトリを作成
    fs.mkdirSync(dirname, { recursive: true });

    console.log("projectName : ", projectName);
    console.log("id : ", result.id);
    console.log("history : ", newHistory);

    try {
        // 非同期的にファイルを書き込む
        fs.writeFile(filepath, JSON.stringify(newHistory), (err) => {
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

const historyFilePath = (id, projectName) => {
    return historyDir + '/' + projectName + '/' + id + '.json';
};

module.exports = {
    readHistory,
    storeHistory
};
