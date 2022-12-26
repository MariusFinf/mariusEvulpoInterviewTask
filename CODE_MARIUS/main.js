// === CONST's
const API_KEY = 'AIzaSyCfuQLHd0Aha7KuNvHK0p6V6R_0kKmsRX4';
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
const SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";
const questionOptions = document.getElementById('question-options');
const SCORE = document.getElementById('score');
const QUESTION_OPTIONS = document.getElementById('question-options');


const RIGHT_TITLE = "¡Correct!";
const RIGHT_SUBTITLE = "(｡◕‿◕｡)";

const WRONG_TITLE = "¡Incorrect!";
const WRONG_SUBTITLE = "(ᵟຶ︵ ᵟຶ)";

const EVALUATE_BUTTON_NEXT = 'Next question';
const EVALUATE_BUTTON_TEXT = 'Evaluate :D';
let questionsAR = [];
let currentQuestion = [];
let currentAnswer = null;
let currentQuestionIndex = null;

// ==============================
// ============ Questions events
// ==============================

questionOptions.addEventListener('click', function(item) {

    // Enable evaluate button after select an option if disabled
    if(document.getElementById('evaluate-button').disabled == true) {
        document.getElementById('evaluate-button').disabled = false
    }
    
    updateSelectedOption(item.target);
    currentAnswer = item.target.innerText;
})

// ==============================
// ============ Questions function
// ==============================


function resetQuiz() {
    let resultContainer = document.getElementById('result-container')
    let resultPoints = document.getElementById('result-points')

    resultContainer.style.display = 'none'
    document.getElementById('result-title').textContent = '';
    document.getElementById('result-subtitle').textContent = '';
    resultPoints.style.display = 'none';
    resultContainer.style.backgroundColor = 'none';
    currentAnswer = '';

    // Remove answer buttons
    QUESTION_OPTIONS.innerHTML = '';

    // Remove current question from array of questions to avoid repeating the same question
    questionsAR.splice(questionsAR.find(question => {
        question[0] == currentQuestion[0] && question[1] == currentQuestion[1]
    }), 1)
    getRandomQuestion();
}

function evaluteAnswer() {

    let evaluateButton = document.getElementById('evaluate-button')

    if(evaluateButton.innerText === EVALUATE_BUTTON_NEXT) {
        resetQuiz();
        return true;
    }

    // Get answer string from current question array and compare it to selected option
    let correctAnswer = (currentQuestion[3].split(';'))[currentQuestion[4]];
    if(currentAnswer === correctAnswer) {
        SCORE.innerText = parseInt(SCORE.innerText) + parseInt(currentQuestion[5])
        displayResult(true)
    } else {
        displayResult(false)
    }    
}

function updateSelectedOption(selectedItem) {

    // Get all options, verify if they have the answer-selected class and remove it
    let optionItems = document.getElementsByClassName('option');

    // Use Array.from() to avoid getting errors "variable.foreach is not a function"
    Array.from(optionItems).forEach(item => {
        item.classList.contains('answer-selected') ? item.classList.remove('answer-selected') : '';
    });

    // Add selected class to the latest item clicked
    selectedItem.classList.add('answer-selected')
}

function getRandomQuestion() {

    let questionTitle = document.getElementById('question-title')
    let evaluateButton = document.getElementById('evaluate-button')

    // No more questions remaining
    if(questionsAR.length <= 0) {
        questionTitle.textContent = 'No more questions available, good job!'
        evaluateButton.disabled = true;
    } else {
        currentQuestionIndex = Math.floor(Math.random() * questionsAR.length);
       
        // Retrieve a random question from the array and update the question/answers
        currentQuestion = questionsAR[currentQuestionIndex];

        // Index 2 is the current index for the question
        questionTitle.textContent = currentQuestion[2]

        // get the answers into an array and update the interface with the answers
        let answersAR = currentQuestion[3].split(';')

        // Add buttons for each possible answer
        answersAR.forEach(answer => {
            let child = `<div class='option' id='answer-option'>${answer}</div>`
            QUESTION_OPTIONS.innerHTML += child;
        });

        evaluateButton.innerText = EVALUATE_BUTTON_TEXT;
    }
}

function displayResult(state) {
    let resultContainer = document.getElementById('result-container')
    let resultPoints = document.getElementById('result-points')
    let evaluateButton = document.getElementById('evaluate-button')

    resultContainer.style.display = 'block'
    if(state) {
        document.getElementById('result-title').textContent = RIGHT_TITLE;
        document.getElementById('result-subtitle').textContent = RIGHT_SUBTITLE;
        document.getElementById('result-points').textContent = `+ ${currentQuestion[5]} points!`
        resultPoints.style.display = 'block'
        resultContainer.style.backgroundColor = '#14d10e'
    } else {
        document.getElementById('result-title').textContent = WRONG_TITLE;
        document.getElementById('result-subtitle').textContent = WRONG_SUBTITLE;
        resultContainer.style.backgroundColor = '#FF0000'
    }
    
    evaluateButton.disabled = true;
    setTimeout(() => {
        evaluateButton.textContent = EVALUATE_BUTTON_NEXT;
        evaluateButton.disabled = false;
    }, 1000);
}

function disableOptions() {

    // Get all options, verify if they have the answer-selected class and remove it
    let optionItems = document.getElementsByClassName('option');

    // Use Array.from() to avoid getting errors "variable.foreach is not a function"
    Array.from(optionItems).forEach(item => {
       item.classList.add('answer-disabled');
    });
}

// ========================
// ============ Google API
// ========================

function gapiLoaded() {
	gapi.load("client", initializeGapiClient);
}

function initializeGapiClient() {
	gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: DISCOVERY_DOCS
    }).then(function () {
        getExerciseData();
    }, function(error) {
        console.log(JSON.stringify(error, null, 2));
    });
}

function getExerciseData() {
	gapi.client.sheets.spreadsheets.values.get({
	  spreadsheetId: '1hzA42BEzt2lPvOAePP6RLLRZKggbg0RWuxSaEwd5xLc',
	  range: 'Learning!A1:F10',
	}).then(function(response) {
        questionsAR = response.result.values;

        // Remove headers from questions array
        questionsAR.splice(0, 1)
		getRandomQuestion();
	}, function(response) {
		console.log('Error: ' + response.result.error.message);
	});
}