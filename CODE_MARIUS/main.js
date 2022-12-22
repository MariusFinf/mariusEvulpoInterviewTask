// === CONST's
const API_KEY = 'AIzaSyCfuQLHd0Aha7KuNvHK0p6V6R_0kKmsRX4';
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
const SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";
const questionOptions = document.getElementById('question-options');

let questionsAR = [];
let currentQuestion = [];
let currentAnswer = "";

// ==============================
// ============ Questions events
// ==============================

questionOptions.addEventListener('click', function(item) {

    // Enable evaluate button after select an option
    document.getElementById('evaluate-button').disabled = false;
    
    updateSelectedOption(item.target);

    currentAnswer = item.target.innerText;
})

// ==============================
// ============ Questions function
// ==============================

function evaluteAnswer() {
    
    // Get answer string from current question array and compare it to selected option
    let correctAnswer = (currentQuestion[3].split(';'))[currentQuestion[4]];
    if(currentAnswer === correctAnswer) {
        // TODO
        // add scoring 
        // ui implementation
        console.log('yay');
    } else {
        console.log('nay');

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

    if(questionsAR.length <= 0) {
        // No questions available
        questionTitle.textContent = 'Questions not available'
    } else {
        // Disable evaluate button until an answer is selected
        document.getElementById('evaluate-button').disabled = true

        // Retrieve a random question from the array starting from position 1 and update the question/answers
        currentQuestion = questionsAR[Math.floor(Math.random(1) * questionsAR.length)];

        // Index 2 is the current index for the question
        questionTitle.textContent = currentQuestion[2]

        // get the answers into an array and update the interface with the answers
        let answersAR = currentQuestion[3].split(';')
        const QUESTION_OPTIONSar = document.getElementById('question-options')

        // Add buttons for each possible answer
        answersAR.forEach(answer => {
            let child = `<div value='${answer}' class='option' id='answer-option'>${answer}</div>`
            QUESTION_OPTIONSar.innerHTML += child;
        });
    }
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
		getRandomQuestion();
	}, function(response) {
		console.log('Error: ' + response.result.error.message);
	});
}