document.addEventListener('DOMContentLoaded', () => {
    // DOM要素の取得
    const generateBtn = document.getElementById('generate-btn');
    const questionsContainer = document.getElementById('questions-container');
    const resultSection = document.getElementById('result-section');
    const answersDisplay = document.getElementById('answers-display');
    const copyBtn = document.getElementById('copy-btn');

    // 解答欄を生成するボタンのイベントリスナー
    generateBtn.addEventListener('click', () => {
        // 設定値を取得
        const questionCount = parseInt(document.getElementById('question-count').value, 10);
        const optionType = document.getElementById('option-type').value;
        const optionCount = parseInt(document.getElementById('option-count').value, 10);

        // バリデーション
        if (isNaN(questionCount) || questionCount < 1 || isNaN(optionCount) || optionCount < 2) {
            alert('問題数と選択肢の数を正しく入力してください。');
            return;
        }

        // コンテナを初期化
        questionsContainer.innerHTML = '';
        answersDisplay.textContent = '';
        resultSection.style.display = 'none';

        // 解答欄を生成
        for (let i = 1; i <= questionCount; i++) {
            const questionArticle = document.createElement('article');

            const header = document.createElement('header');
            header.textContent = `問 ${i}`;
            questionArticle.appendChild(header);

            const fieldset = document.createElement('fieldset');
            fieldset.classList.add('grid');

            for (let j = 0; j < optionCount; j++) {
                const optionLabel = createOptionLabel(i, j, optionType);
                fieldset.appendChild(optionLabel);
            }
            questionArticle.appendChild(fieldset);
            questionsContainer.appendChild(questionArticle);
        }

        // 解答が変更されたら結果を更新
        questionsContainer.addEventListener('change', updateAnswers);

        // 結果表示エリアを表示
        resultSection.style.display = 'block';
        updateAnswers(); // 初期表示
    });

    // 選択肢のラベルとラジオボタンを生成する関数
    const createOptionLabel = (questionNum, optionIndex, type) => {
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = `question-${questionNum}`;

        let optionText = '';
        switch (type) {
            case 'number':
                optionText = (optionIndex + 1).toString();
                break;
            case 'alpha':
                optionText = String.fromCharCode(65 + optionIndex); // A, B, C...
                break;
            case 'kana':
                const katakana = ['ア', 'イ', 'ウ', 'エ', 'オ', 'カ', 'キ', 'ク', 'ケ', 'コ'];
                optionText = katakana[optionIndex] || `?`;
                break;
        }
        input.value = optionText;

        label.appendChild(input);
        label.appendChild(document.createTextNode(optionText));
        return label;
    };

    // 現在の解答をまとめて表示する関数
    const updateAnswers = () => {
        const questionCount = questionsContainer.children.length;
        let answersText = '';
        for (let i = 1; i <= questionCount; i++) {
            const checked = questionsContainer.querySelector(`input[name="question-${i}"]:checked`);
            const answer = checked ? checked.value : '（未選択）';
            answersText += `問 ${String(i).padStart(2, ' ')}: ${answer}\n`;
        }
        answersDisplay.textContent = answersText;
    };

    // コピーボタンのイベントリスナー
    copyBtn.addEventListener('click', () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(answersDisplay.textContent)
                .then(() => {
                    const originalText = copyBtn.textContent;
                    copyBtn.textContent = 'コピーしました！';
                    setTimeout(() => {
                        copyBtn.textContent = originalText;
                    }, 1500);
                })
                .catch(err => {
                    alert('クリップボードへのコピーに失敗しました。');
                    console.error('Copy failed:', err);
                });
        } else {
            alert('お使いのブラウザはクリップボードAPIに対応していません。');
        }
    });
});
