const APIUrl = 'https://opentdb.com/api.php?amount=10&type=multiple';

const container = document.querySelector('.container');
const startQuiz = document.querySelector('.start-quiz');
const startBtn = document.querySelector('#start-btn');
const askQuestion = document.querySelector('.question');
const answerContainer = document.querySelectorAll('.answers');
const options = document.querySelector('.quiz-options');
const checkBtn = document.querySelector('#check-btn');
const playAgainBtn = document.querySelector('#play-again');
const result = document.querySelector('#result');
const correctScore = document.querySelector('#correct-score');
const totalQuestion = document.querySelector('#total-question');
const progressBarFull = document.querySelector('#progressbar-full');

let askedCount = 0;
let correctAnswer = '',
  setCorrectScore = (askedCount = 0),
  setTotalQuestion = 10;

function eventListeners() {
  startBtn.addEventListener('click', () => {
    startGame();
  });
  checkBtn.addEventListener('click', checkAnswer);
  playAgainBtn.addEventListener('click', restartQuiz);
}
document.addEventListener('DOMContentLoaded', () => {
  loadQuestion();
  eventListeners();
  totalQuestion.textContent = setTotalQuestion;
  correctScore.textContent = setCorrectScore;
});

// startgame
const startGame = () => {
  startQuiz.style.display = 'none';
  container.style.display = 'flex';
};
async function loadQuestion() {
  const APIUrl = 'https://opentdb.com/api.php?amount=10&type=multiple';
  const result = await fetch(`${APIUrl}`);
  const data = await result.json();
  result.innerHTML = ' ';
  showQuestion(data.results[0]);
}
// ask question en options
function showQuestion(data) {
  correctAnswer = data.correct_answer;
  let incorrectAnswer = data.incorrect_answers;
  let optionsList = incorrectAnswer;
  optionsList.splice(
    Math.floor(Math.random() * (incorrectAnswer.length + 1)),
    0,
    correctAnswer
  );
  askQuestion.innerHTML = `Category: <br>${data.category} <br><br> <span>${data.question}</span>`;
  options.innerHTML = `${optionsList
    .map(
      (option, index) => `
  <li>${index + 1}.<span>${option}</span></li>
  `
    )
    .join('')}`;
  selectOption();
}
function selectOption() {
  options.querySelectorAll('li').forEach((option) => {
    option.addEventListener('click', () => {
      if (options.querySelector('.selected')) {
        const activeOption = options.querySelector('.selected');
        activeOption.classList.remove('selected');
      }
      option.classList.add('selected');
    });
  });
  console.log(correctAnswer);
}
// check answer
function checkAnswer() {
  checkBtn.disabled = false;
  if (options.querySelector('.selected')) {
    let selectedAnswer = options.querySelector('.selected span').textContent;
    console.log(selectedAnswer);
    if (selectedAnswer.trim() === HTMLDecode(correctAnswer)) {
      setCorrectScore++;
      result.innerHTML = `<p> Correct Answer </p>`;
    } else {
      result.innerHTML = `<p> incorrect Answer </p><p><small> <b> Correct answer:</b> ${correctAnswer}</small></p>`;
    }
    checkCount();
  } else {
    result.innerHTML = `<p> Please select an option!</p>`;
    checkBtn.disabled = false;
  }
}
function HTMLDecode(textString) {
  let doc = new DOMParser().parseFromString(textString, 'text/html');
  return doc.documentElement.textContent;
}
function checkCount() {
  askedCount++;
  setCount();
  progressBarFull.style.width = `${(askedCount / setTotalQuestion) * 100}%`;

  if (askedCount == setTotalQuestion) {
    setTimeout(function () {
      console.log('');
    }, 5000);

    result.innerHTML += `<p> Your score is ${setCorrectScore}.</p>`;
    playAgainBtn.style.display = 'block';
    checkBtn.style.display = 'none';
  } else {
    setTimeout(() => {
      loadQuestion();
    }, 500);
  }
}
function setCount() {
  totalQuestion.textContent = setTotalQuestion;
  correctScore.textContent = setCorrectScore;
}

function restartQuiz() {
  setCorrectScore = askedCount = 0;
  playAgainBtn.style.display = 'none';
  checkBtn.style.display = 'block';
  checkBtn.disabled = false;
  setCount();
  loadQuestion();
}
