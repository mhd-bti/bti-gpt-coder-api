const dotenv = require('dotenv');
const replace = require("replace-in-file");
const fs = require('fs');

// dotenvパッケージを読み込み、環境変数を強制的に上書きする
dotenv.config({ override: true });

const demoAppSrc = process.env.DEMO_APP_SRC;

// メイン処理
const run = async (req, res) => {
    console.log("hello");
    const projectName = req.body.projectName;
    const componentName = projectName.charAt(0).toUpperCase() + projectName.slice(1);

    console.log("projectName : ", projectName);

    // import文を追加する
    const options = {
        files: demoAppSrc, // 置換を実行したいファイルのパスを設定
        from: [
            / \/\/ ### IMPORT AFTER HERE ###/,
            / \/\/ ### COMPONENT AFTER HERE ###/
        ], // 置換対象の文字を正規表現で設定
        to: [
            `\nimport ${componentName} from './${projectName}/App'; \/\/ ### IMPORT AFTER HERE ###`,
            `,\n    { projectCode: "${projectName}", projectName: "${projectName}", component: <${componentName} /> } \/\/ ### COMPONENT AFTER HERE ###`
        ], // 置換後の文字を設定
    };

    replace(options, (error, changedFiles) => {
        if (error) return console.error("Error occurred:", error);
        for (let i = 0; i < changedFiles.length; i++) {
            console.log("Modified files:", changedFiles[i].file); // 変更したファイル名をログに出力
        }

        test();
    });
}

module.exports = {
    run
};


// 会話履歴を読み込む
const test = () => {
    try {
        const demoApp = fs.readFileSync(demoAppSrc, 'utf-8');
        console.log("historyRaw : ", demoApp);
    } catch (error) {
        console.error('Error reading history file:', error);
        return []; // Return an empty array if there's an error
    }
};