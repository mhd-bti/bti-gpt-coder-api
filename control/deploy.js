const dotenv = require('dotenv');

const fs = require('fs');
const path = require('path');

// dotenvパッケージを読み込み、環境変数を強制的に上書きする
dotenv.config({ override: true });

const targetSourceDir = process.env.TARGET_SOURCE_DIR;

// メイン処理
const run = async (req, res) => {
    // コードを実装に反映する
    const projectName = req.body.projectName;
    const filename = req.body.filename;
    const code = req.body.code;
    const description = req.body.description;

    const filepath = targetSourceDir + "/" + projectName + "/" + filename;
    const dirname = path.dirname(filepath);

    // 出力先ディレクトリを作成
    fs.mkdirSync(dirname, { recursive: true });

    console.log("projectName : ", projectName);
    console.log("filename : ", filename);
    console.log("code : ", code);
    console.log("description : ", description);
    console.log("filepath : ", filepath);
    console.log("dirname : ", dirname);

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
};

module.exports = {
    run
};
