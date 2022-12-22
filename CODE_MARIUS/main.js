// === CONST's
const API_KEY = 'AIzaSyCfuQLHd0Aha7KuNvHK0p6V6R_0kKmsRX4';
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
const SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

let questionsAR = []
let currentQuestion = []
// ==============================
// ============ Questions functions
// ==============================

function onSelectAnswer(id) {
    // TODO
}

function evaluateAnswer() {
    // TODO
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
        
        answersAR.forEach(answer => {
            let child = "<div id='answer-option'>" + answer + "</div>"
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