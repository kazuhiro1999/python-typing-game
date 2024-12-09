
// DOM要素
const mainMenuModal = document.getElementById("mainMenuModal");
const startGameBtn = document.getElementById("start-game-btn");
const rankingBtn = document.getElementById("ranking-btn");
const continueButton = document.getElementById("continue-button");
const menuButton = document.getElementById("menu-button");
const exampleText = document.getElementById("example-text");
const userInput = document.getElementById("user-input");
const submitButton = document.getElementById("submit-button");
const result = document.getElementById("result");
const resultModal = document.getElementById("resultModal");
const startModal = document.getElementById("startModal");
const timeTaken = document.getElementById("time-taken");
const missCount = document.getElementById("miss-count");
const mistypeCount = document.getElementById("mistype-count");
const typingSpeed = document.getElementById("typing-speed");
const restartButton = document.getElementById("restart-button");
const musicToggle = document.getElementById("music-toggle");
const volumeSlider = document.getElementById("volume-slider");

// Sound
const keySound = new Audio('assets/key.mp3'); 
const correctSound = new Audio('assets/correct.mp3'); 
const incorrectSound = new Audio('assets/incorrect.mp3'); 
const resultSound = new Audio('assets/result.mp3'); 
const bgMusic = new Audio('assets/bgm.mp3'); 
bgMusic.loop = true;
bgMusic.volume = 0.3;
bgMusic.autoplay = true;
  
// ゲーム状態変数
let pythonSnippets = {};
let currentCategory = null;
let problems = [];
let currentProblemIndex = 0;
let currentProblem = null;
let startTime = null;
let isMusicPlaying = true;
let attemptsOnCurrentProblem = 0;
const MAX_ATTEMPTS = 3;

let correctAnswers = 0;
let mistakes = 0;
let keyPressCount = 0;
let misTypes = 0;

// 外部JSONファイルを読み込む
function loadSnippets() {
  fetch('snippets.json')
    .then(response => response.json())
    .then(data => {
      pythonSnippets = data;
      generateButtons(); // スニペット読み込み後にボタンを生成
    })
    .catch(error => console.error('JSONファイルの読み込みエラー:', error));
}
  
// カテゴリ選択ボタンを動的に生成
function generateButtons() {
  const buttonsContainer = document.getElementById('categoryButtons');
  const categories = Object.keys(pythonSnippets); // easy, medium, hard
  
  categories.forEach(category => {
    const button = document.createElement('button');
    button.className = 'category-btn';
    button.textContent = category;
    button.onclick = () => {
      currentCategory = category;
      startModal.style.display = 'none';
      resetGame();
    };
    buttonsContainer.appendChild(button);
  });
}

startGameBtn.addEventListener("click", () => {
  mainMenuModal.style.display = 'none';
  startModal.style.display = 'flex';
  if (bgMusic.paused){
    bgMusic.play();
  }
});
  
rankingBtn.addEventListener("click", () => {
  alert("ランキング機能は近日追加予定です！");
});

continueButton.addEventListener("click", () => {
  resultModal.classList.add("hidden");
  resetGame();
});
  
// Menu button - return to main menu
menuButton.addEventListener("click", () => {
  resultModal.classList.add("hidden");
  mainMenuModal.style.display = 'flex';
  startModal.style.display = 'none';
});

function getNextProblem() {
  if (currentProblemIndex < problems.length) {
    const problem = problems[currentProblemIndex];
    currentProblemIndex++;
    return problem;
  } else {
    return null; // 全ての問題が終了
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
  
function resetGame() {
  correctAnswers = 0;
  mistakes = 0;
  misTypes = 0;
  keyPressCount = 0;
  startTime = Date.now();
  problems = shuffleArray([...pythonSnippets[currentCategory]]);
  currentProblemIndex = 0;
  currentProblem = getNextProblem();
  exampleText.textContent = currentProblem;
  userInput.value = "";
  result.textContent = "";
  attemptsOnCurrentProblem = 0;
  resultModal.classList.add("hidden");
  userInput.classList.remove("error-shake");
  userInput.focus();
}
  
  function endGame() {
    const elapsedTime = (Date.now() - startTime) / 1000;
    const speed = (keyPressCount / elapsedTime).toFixed(2);
    
    timeTaken.textContent = `経過時間: ${elapsedTime.toFixed(2)}秒`;
    missCount.textContent = `ミス数: ${mistakes}`;
    mistypeCount.textContent = `削除回数: ${misTypes}`;
    typingSpeed.textContent = `タイピング速度: ${speed} キー/秒`;

    resultModal.classList.remove("hidden");
    resultSound.play();
  }
  
  function toggleBackgroundMusic() {
    if (bgMusic.paused) {
      bgMusic.play()
        .then(() => {
          isMusicPlaying = true;
          musicToggle.textContent = "🔊 BGM";
        })
        .catch(error => {
          console.log("音楽再生エラー:", error);
          isMusicPlaying = false;
        });
    } else {
      bgMusic.pause();
      isMusicPlaying = false;
      musicToggle.textContent = "🔇 BGM";
    }
  }

  // 音量スライダーのイベントリスナー
  volumeSlider.addEventListener('input', () => {
    bgMusic.volume = volumeSlider.value;
    
    // 音量が0以上なら再生中の音楽を継続、0なら停止
    if (volumeSlider.value > 0) {
      musicToggle.textContent = "🔊 BGM";
      if (bgMusic.paused && isMusicPlaying){
        bgMusic.play();
      }
    } else if (volumeSlider.value === "0") {
      musicToggle.textContent = "🔇 BGM";
    }
  });

  // 音楽トグルボタンにイベントリスナーを追加
  musicToggle.addEventListener('click', toggleBackgroundMusic);

  function playKeySound() {
    keyPressCount++;
    
    // キー音を再生
    if (keySound) {
      keySound.currentTime = 0; // 音声を最初から再生
      keySound.play().catch(error => {
        console.log("キー音の再生に失敗:", error);
      });
    }
  }
  
  submitButton.addEventListener("click", () => {
    const userText = userInput.value.trim();
    const correctText = exampleText.textContent;
   
    if (userText === correctText) {
        // 正解時の処理
        correctAnswers++;
        
        if (correctSound) {
          correctSound.play().catch(error => {
            console.log("正解音の再生に失敗:", error);
          });
        }
        
        result.textContent = "正解！🎉";
        result.style.color = "green";
        
        // 新しい問題に進む
        if (currentProblemIndex < problems.length) {
          currentProblem = getNextProblem();
          exampleText.textContent = currentProblem;
          userInput.value = "";
          attemptsOnCurrentProblem = 0;
        } else {
          endGame();
        }
      } else {
        // 不正解時の処理
        mistakes++;
        attemptsOnCurrentProblem++;
        
        if (incorrectSound) {
          incorrectSound.play().catch(error => {
            console.log("不正解音の再生に失敗:", error);
          });
        }
        
        // エラーフィードバック
        userInput.classList.add("error-shake");        
        result.textContent = `不正解！残り${MAX_ATTEMPTS - attemptsOnCurrentProblem}回`;
        result.style.color = "red";
        
        // 最大試行回数に達した場合
        if (attemptsOnCurrentProblem >= MAX_ATTEMPTS) {          
          // 新しい問題に進む
          if (currentProblemIndex < problems.length) {
            currentProblem = getNextProblem();
            exampleText.textContent = currentProblem;
            userInput.value = "";
            attemptsOnCurrentProblem = 0;
          } else {
            endGame();
          }
        }
        
        // アニメーションのリセット用
        setTimeout(() => {
          userInput.classList.remove("error-shake");
        }, 300);
      }
  });
  
  userInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
      submitButton.click(); 
    }
  });

  userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Backspace' || event.key === 'Delete') {
      misTypes++; // 削除回数
    }
  });


  window.onload = () => {
    loadSnippets();
    mainMenuModal.style.display = 'flex';
    startModal.style.display = 'none';
    musicToggle.style.display = 'block';
  };
  