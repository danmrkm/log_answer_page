document.addEventListener('DOMContentLoaded', () => {
    // DOM要素の取得
    const generateBtn = document.getElementById('generate-btn');
    const questionsContainer = document.getElementById('questions-container');

    const answerKeyDetails = document.getElementById('answer-key-details');
    const answerKeyContainer = document.getElementById('answer-key-container');

    const resultSection = document.getElementById('result-section');
    const scoreDisplay = document.getElementById('score-display');
    const answersDisplay = document.getElementById('answers-display');
    const copyBtn = document.getElementById('copy-btn');

    // 解答欄を生成するボタンのイベントリスナー
    generateBtn.addEventListener('click', () => {
        const questionCount = parseInt(document.getElementById('question-count').value, 10);
        const optionType = document.getElementById('option-type').value;
        const optionCount = parseInt(document.getElementById('option-count').value, 10);

        if (isNaN(questionCount) || questionCount < 1 || isNaN(optionCount) || optionCount < 2) {
            alert('問題数と選択肢の数を正しく入力してください。');
            return;
        }

        // 各コンテナを初期化
        questionsContainer.innerHTML = '';
        answerKeyContainer.innerHTML = '';
        answersDisplay.textContent = '';
        scoreDisplay.textContent = '0';

        // 解答欄と正解入力欄を生成
        for (let i = 1; i <= questionCount; i++) {
            // ユーザーの解答欄
            const questionArticle = document.createElement('article');
            const qHeader = document.createElement('header');
            qHeader.textContent = `問 ${i}`;
            questionArticle.appendChild(qHeader);
            const qFieldset = document.createElement('fieldset');
            qFieldset.classList.add('grid');

            // 正解の入力欄
            const answerKeyArticle = document.createElement('article');
            const aHeader = document.createElement('header');
            aHeader.textContent = `問 ${i}`;
            answerKeyArticle.appendChild(aHeader);
            const aFieldset = document.createElement('fieldset');
            aFieldset.classList.add('grid');

            for (let j = 0; j < optionCount; j++) {
                const optionText = getOptionText(j, optionType);
                // ユーザー解答欄の選択肢を追加
                qFieldset.appendChild(createOptionLabel(i, j, optionText, 'user-answer'));
                // 正解入力欄の選択肢を追加
                aFieldset.appendChild(createOptionLabel(i, j, optionText, 'correct-answer'));
            }
            questionArticle.appendChild(qFieldset);
            questionsContainer.appendChild(questionArticle);

            answerKeyArticle.appendChild(aFieldset);
            answerKeyContainer.appendChild(answerKeyArticle);
        }

        // イベントリスナーを一度クリアしてから再設定
        questionsContainer.removeEventListener('change', updateAnswersAndScore);
        answerKeyContainer.removeEventListener('change', updateAnswersAndScore);

        questionsContainer.addEventListener('change', updateAnswersAndScore);
        answerKeyContainer.addEventListener('change', updateAnswersAndScore);

        // 各エリアを表示
        answerKeyDetails.style.display = 'block';
        resultSection.style.display = 'block';
        updateAnswersAndScore(); // 初期表示
    });

    // 選択肢のテキストを生成する関数
    const getOptionText = (optionIndex, type) => {
        switch (type) {
            case 'number':
                return (optionIndex + 1).toString();
            case 'alpha':
                return String.fromCharCode(65 + optionIndex); // A, B, C...
            case 'kana':
                const katakana = ['ア', 'イ', 'ウ', 'エ', 'オ', 'カ', 'キ', 'ク', 'ケ', 'コ'];
                return katakana[optionIndex] || `?`;
            default:
                return '';
        }
    };

    // 選択肢のラベルとラジオボタンを生成する汎用関数
    const createOptionLabel = (questionNum, optionIndex, optionText, groupName) => {
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = `${groupName}-${questionNum}`;
        input.value = optionText;
        // IDが重複しないようにユニークなIDを生成
        input.id = `${groupName}-q${questionNum}-o${optionIndex}`;
        label.htmlFor = input.id;

        label.appendChild(input);
        label.appendChild(document.createTextNode(optionText));
        return label;
    };

    // 解答を更新し、採点を行う関数
    const updateAnswersAndScore = () => {
        const questionCount = questionsContainer.children.length;
        if (questionCount === 0) return;

        let answersText = '';
        let correctCount = 0;

        for (let i = 1; i <= questionCount; i++) {
            // ユーザーの解答を取得
            const userAnswerEl = questionsContainer.querySelector(`input[name="user-answer-${i}"]:checked`);
            const userAnswer = userAnswerEl ? userAnswerEl.value : '（未選択）';

            // 正解を取得
            const correctAnswerEl = answerKeyContainer.querySelector(`input[name="correct-answer-${i}"]:checked`);
            const correctAnswer = correctAnswerEl ? correctAnswerEl.value : '';

            let resultMark = '';
            if (userAnswer !== '（未選択）' && correctAnswer !== '') {
                if (userAnswer === correctAnswer) {
                    resultMark = '(正解)';
                    correctCount++;
                } else {
                    resultMark = `(不正解, 正解: ${correctAnswer})`;
                }
            }

            answersText += `問 ${String(i).padStart(2, ' ')}: ${userAnswer} ${resultMark}\n`;
        }

        // 点数を計算
        const score = Math.round((correctCount / questionCount) * 100);

        // 表示を更新
        scoreDisplay.textContent = score;
        answersDisplay.textContent = answersText;
    };

    // コピーボタンのイベントリスナー
    copyBtn.addEventListener('click', () => {
        const scoreText = `点数: ${scoreDisplay.textContent} / 100\n\n`;
        const fullResultText = scoreText + answersDisplay.textContent;

        if (navigator.clipboard) {
            navigator.clipboard.writeText(fullResultText)
                .then(() => {
                    const originalText = copyBtn.textContent;
                    copyBtn.textContent = 'コピーしました！';
                    setTimeout(() => { copyBtn.textContent = originalText; }, 1500);
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
