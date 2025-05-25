// 英文单词库 - 海量词汇
const words = [
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "I", "it", "for", "not", "on", "with", "he", "as", "you", 
    "do", "at", "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", 
    "all", "would", "there", "their", "what", "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when",
    "make", "can", "like", "time", "no", "just", "him", "know", "take", "people", "into", "year", "your", "good", "some", 
    "could", "them", "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think", "also", "back",
    "after", "use", "two", "how", "our", "work", "first", "well", "way", "even", "new", "want", "because", "any", "these",
    "give", "day", "most", "us", "is", "are", "was", "were", "has", "had", "been", "being", "have", "having", "do", "does",
    "did", "doing", "a", "an", "the", "and", "but", "if", "or", "because", "as", "until", "while", "of", "at", "by", "for",
    "with", "about", "against", "between", "into", "through", "during", "before", "after", "above", "below", "to", "from",
    "up", "down", "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when",
    "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not",
    "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", "just", "don", "should", "now", "code",
    "program", "computer", "keyboard", "mouse", "screen", "monitor", "type", "speed", "practice", "learning", "skill",
    "development", "web", "internet", "browser", "application", "software", "hardware", "system", "network", "data",
    "database", "algorithm", "function", "variable", "loop", "condition", "object", "class", "method", "property",
    "interface", "event", "handler", "callback", "promise", "async", "await", "response", "request", "server", "client"
];

// 常用短语 - 增加多样性
const phrases = [
    "in the beginning", "at the end", "on the other hand", "as a matter of fact", "in my opinion", 
    "for the most part", "to tell the truth", "as far as I know", "in any case", "to some extent",
    "by the way", "in this way", "on the contrary", "in general", "for example", "such as", 
    "as well as", "in order to", "due to the fact that", "as soon as possible"
];

// 标点符号
const punctuations = [',', '.', '!', '?', ';', ':'];

// 数字
const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

// DOM元素
const textDisplay = document.getElementById('text-display');
const textInput = document.getElementById('text-input');
const generateBtn = document.getElementById('generate');
const restartBtn = document.getElementById('restart');
const lengthInput = document.getElementById('length');
const lengthValue = document.getElementById('length-value');
const punctuationCheckbox = document.getElementById('punctuation');
const numbersCheckbox = document.getElementById('numbers');
const lowercaseCheckbox = document.getElementById('lowercase');
const resultsDiv = document.getElementById('results');
const wpmSpan = document.getElementById('wpm');
const cpsSpan = document.getElementById('cps');
const accuracySpan = document.getElementById('accuracy');
const backspacesSpan = document.getElementById('backspaces');
const timerSpan = document.getElementById('timer');
const themeBtn = document.getElementById('theme-btn');

// 变量
let currentText = '';
let startTime = null;
let endTime = null;
let backspacesCount = 0;
let correctChars = 0;
let totalChars = 0;
let timerInterval = null;
let isTestCompleted = false;
let currentTheme = 'light';

// 初始化
init();

function init() {
    // 事件监听
    generateBtn.addEventListener('click', generateText);
    restartBtn.addEventListener('click', restartTest);
    textInput.addEventListener('input', handleInput);
    textInput.addEventListener('keydown', handleKeyDown);
    lengthInput.addEventListener('input', updateLengthValue);
    themeBtn.addEventListener('click', toggleTheme);
    
    // 加载保存的主题
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        currentTheme = savedTheme;
        updateTheme();
    }
    
    // 生成初始文本
    generateText();
    
    // 聚焦输入框
    textInput.focus();
}

// 生成随机文本 - 改进版：海量随机句子
function generateText() {
    // 重置状态
    resetTest();
    
    const length = parseInt(lengthInput.value);
    const includePunctuation = punctuationCheckbox.checked;
    const includeNumbers = numbersCheckbox.checked;
    const makeLowercase = lowercaseCheckbox.checked;
    
    // 生成随机句子
    let generatedText = '';
    
    while (generatedText.length < length) {
        // 随机选择生成单词、短语或数字
        const choice = Math.random();
        
        if (includeNumbers && choice < 0.1) {
            // 10%概率插入数字
            const randomNumber = Math.floor(Math.random() * 1000).toString();
            generatedText += randomNumber + ' ';
        } else if (choice < 0.3 && phrases.length > 0) {
            // 30%概率使用短语
            const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
            generatedText += randomPhrase + ' ';
        } else {
            // 60%概率使用单词
            const randomWord = words[Math.floor(Math.random() * words.length)];
            generatedText += randomWord + ' ';
        }
        
        // 随机添加标点
        if (includePunctuation && Math.random() < 0.2 && generatedText.length < length - 5) {
            const randomPunct = punctuations[Math.floor(Math.random() * punctuations.length)];
            generatedText = generatedText.trim() + randomPunct + ' ';
        }
    }
    
    // 处理大小写
    if (makeLowercase) {
        generatedText = generatedText.toLowerCase();
    } else {
        // 首字母大写
        generatedText = generatedText.split('. ').map(sentence => {
            return sentence.charAt(0).toUpperCase() + sentence.slice(1);
        }).join('. ');
        
        generatedText = generatedText.trim();
    }
    
    // 截取所需长度
    currentText = generatedText.trim().substring(0, length);
    displayText();
}

// 显示文本
function displayText() {
    textDisplay.innerHTML = '';
    currentText.split('').forEach(char => {
        const span = document.createElement('span');
        span.textContent = char;
        textDisplay.appendChild(span);
    });
}

// 处理输入
function handleInput(e) {
    if (isTestCompleted) return;
    
    const inputText = e.target.value;
    const inputLength = inputText.length;
    
    // 开始计时
    if (inputLength === 1 && !startTime) {
        startTime = new Date();
        startTimer();
    }
    
    // 检查是否完成
    if (inputLength === currentText.length) {
        endTest();
        return;
    }
    
    // 更新显示
    updateTextDisplay(inputText);
}

// 处理按键
function handleKeyDown(e) {
    if (e.key === 'Backspace') {
        backspacesCount++;
    }
    
    // 测试完成后按Enter键重新开始
    if (isTestCompleted && e.key === 'Enter') {
        generateText();
        textInput.focus();
    }
}

// 更新文本显示（颜色标记）
function updateTextDisplay(inputText) {
    const spans = textDisplay.querySelectorAll('span');
    correctChars = 0; // 重置正确字符计数
    
    for (let i = 0; i < spans.length; i++) {
        if (i < inputText.length) {
            if (inputText[i] === currentText[i]) {
                spans[i].className = 'correct';
                correctChars++;
            } else {
                spans[i].className = 'incorrect';
            }
        } else if (i === inputText.length) {
            spans[i].className = 'current';
        } else {
            spans[i].className = '';
        }
    }
    
    totalChars = inputText.length;
}

// 开始计时器
function startTimer() {
    timerInterval = setInterval(() => {
        const currentTime = new Date();
        const elapsed = (currentTime - startTime) / 1000;
        timerSpan.textContent = elapsed.toFixed(1) + 's';
    }, 100);
}

// 结束测试
function endTest() {
    clearInterval(timerInterval);
    endTime = new Date();
    isTestCompleted = true;
    calculateResults();
    showResults();
    textInput.blur();
}

// 计算结果显示
function calculateResults() {
    const timeInSeconds = (endTime - startTime) / 1000;
    const words = currentText.split(' ').length;
    const wpm = Math.round((words / timeInSeconds) * 60);
    const cps = (totalChars / timeInSeconds).toFixed(1);
    const accuracy = Math.round((correctChars / totalChars) * 100);
    
    wpmSpan.textContent = wpm;
    cpsSpan.textContent = cps;
    accuracySpan.textContent = accuracy;
    backspacesSpan.textContent = backspacesCount;
}

// 显示结果
function showResults() {
    resultsDiv.style.display = 'block';
}

// 重置测试
function resetTest() {
    textInput.value = '';
    startTime = null;
    endTime = null;
    backspacesCount = 0;
    correctChars = 0;
    totalChars = 0;
    isTestCompleted = false;
    resultsDiv.style.display = 'none';
    clearInterval(timerInterval);
    timerSpan.textContent = '0.0s';
}

// 重新开始测试
function restartTest() {
    resetTest();
    displayText();
    textInput.focus();
}

// 更新长度显示
function updateLengthValue() {
    lengthValue.textContent = lengthInput.value;
}

// 切换主题
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    updateTheme();
    localStorage.setItem('theme', currentTheme);
}

// 更新主题
function updateTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeBtn.textContent = currentTheme === 'light' ? '🌙 暗色模式' : '☀️ 亮色模式';
}