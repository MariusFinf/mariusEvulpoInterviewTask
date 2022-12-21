// === CONST's provided
const API_KEY = 'AIzaSyCfuQLHd0Aha7KuNvHK0p6V6R_0kKmsRX4';
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
const SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

function onSelectAnswer(id) {
    // TODO
}

function evaluateAnswer() {
    // TODO
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
		console.log(response);
		console.log(response.result.values);
	}, function(response) {
		console.log('Error: ' + response.result.error.message);
	});
}