// Html element variables
var scores = document.querySelector("#scores");
var timer = document.querySelector("#timer");
var container = document.querySelector("#container");
var title = document.querySelector("#title");
var content = document.querySelector("#content");
var start = document.querySelector("#start");
var answer = document.querySelector("#answer");

// Question structure
class Question {
    constructor(question, options, answer) {
        this.question = question;
        this.options = options;
        this.answer = answer;
    }
}

var questionList = [];

// Question lists into questionList array
var options1 = ["1. boolean", "2. object", "3. number", "4. string"];
var question1 = new Question("Which data types can local storage accept?", options1, "4. string");
questionList.push(question1);

var options2 = ["1. string", "2. number", "3. boolean", "4. all of the above"];
var question2 = new Question("Which data types can a function return?", options2, "4. all of the above");
questionList.push(question2);

var options3 = ["1. local variables", "2. css selectors", "3. functions", "4. names"];
var question3 = new Question("Which parameters can be passed into the query selector function?", options3, "2. css selectors");
questionList.push(question3);

var options4 = ["1. body", "2. canvas", "3. concept", "4. aside"];
var question4 = new Question("Which of the following is not a HTML tag?", options4, "3. concept");
questionList.push(question4);

var options5 = ["1. add()", "2. push()", "3. concat()", "4. none of the above"];
var question5 = new Question("Which of the following functions can add an element to the end of an array? ", options5, "2. push()");
questionList.push(question5);

var options6 = ["1. quotes", "2. curly braces", "3. parenthesis", "4. square braces"];
var question6 = new Question("Which syntax correctly wraps strings?", options6, "1. quotes");
questionList.push(question6);

// Question loop function variables
var optionList = [];
var currentQues = 0;
var score = 0;
var timeLeft = 61;
var isQuizOngoing = false;
var leaderboard = [];
var initials = "";
var isClearingAnswer = false;
var clearingAnswerCode = 0;
var isCorrect = false;

// Init function activates 'view top scores' and 'start quiz' buttons
function init() {
    start.addEventListener("click", questionLoop);
    scores.addEventListener("click", showScores);
}

// Hides pre-quiz elements and creates answer buttons
function questionLoop () {
    runTimer();
    isQuizOngoing = true;
    start.setAttribute("style", "display: none");
    content.setAttribute("style", "display: none");
    var numOfOptions = questionList[0].options.length;
    for(var i = 0; i < numOfOptions; i++) {
        var option = document.createElement("button");
        container.appendChild(option);
        optionList.push(option);
        option.setAttribute("id", `button${i + 1}`);
    }
    nextQuestion();
}

// Countdown timer - quiz ends at 0 time
function runTimer () {
    var clock = setInterval(function() {
        timeLeft--;
        timer.textContent = `Time: ${timeLeft} seconds`;
        if(timeLeft === 0) {
            clearInterval(clock);
            if(title.textContent !== "All Done.") {
                endOfQuiz();
            }
        }
    }, 1000)
}


// Function for next question or end of quiz
function nextQuestion(event) {
    writeAnswer(event);
    if(currentQues < questionList.length) {
        changeQuestion();
    } else {
        endOfQuiz();
    }
}


// Check for first question, if not, checks the answer from the previous question is correct
// If incorrect, time deducted and flashes blue
// If time left less than 10, timer becomes 0
function writeAnswer(event) {
    if(event !== undefined) {
        if(event.currentTarget.textContent === questionList[currentQues - 1].answer) {
            isCorrect = true;
            answer.textContent = "Correct";
            answer.setAttribute("style", "color: green");
            score += 10;
        } else {
            isCorrect = false;
            answer.textContent = "Incorrect";
            answer.setAttribute("style", "color: red");
            if(timeLeft > 10) {
                timeLeft -= 10;
            } else {
                timeLeft = 1;
            }
            timer.setAttribute("style", "color: blue");
            setTimeout(function () {
                timer.setAttribute("style", "color: white");
            },1000);
        }
        clearAnswer();
    }
}

// Clears footer after three seconds - if timeout has been set, previous timeout is cleared and function calls itself
function clearAnswer() {
    if(isClearingAnswer) {
        isClearingAnswer = false;
        clearTimeout(clearingAnswerCode);
        clearAnswer();
    } else {
        isClearingAnswer = true;
        clearingAnswerCode = setTimeout(function() {
            answer.textContent = "";
            isClearingAnswer = false;
        }, 3000);
    }
}

// Changes the question and answer options for next question
function changeQuestion() {
    title.textContent = questionList[currentQues].question;
    for(let i = 0; i < questionList[currentQues].options.length; i++) {
        optionList[i].textContent = questionList[currentQues].options[i];        
        optionList[i].addEventListener("click", nextQuestion);
    }
    currentQues++;
}

// Changes title to 'All Done.', clears options and displays score
// Sets score to 0 and creates input field
function endOfQuiz() {
    title.textContent = "All Done.";
    timeLeft = 1;
    clearOptions();
    clearAnswer();
    content.setAttribute("style", "display: visible");
    content.textContent = `Your final score is ${score}`;
    inputFields();
}

//Removes answer options and empties the current array
function clearOptions() {
    for(var i = 0; i < optionList.length; i++) {
        optionList[i].remove();
    }
    optionList = [];
}

// Creates form for entering initials - listens for submit event upon clicking button
function inputFields() {
    var initialsForm = document.createElement("form");
    container.appendChild(initialsForm);
    initialsForm.setAttribute("id", "form");
    var label = document.createElement("label");
    initialsForm.appendChild(label);
    label.textContent = "Enter initials: "
    var input = document.createElement("input")
    initialsForm.appendChild(input);
    input.setAttribute("id", "initials");
    var submit = document.createElement("button");
    initialsForm.appendChild(submit);
    submit.setAttribute("id", "submit");
    submit.textContent = "Submit";

    title.setAttribute("style", "align-self: start")
    content.setAttribute("style", "align-self: start; font-size: 150%");

    
    input.addEventListener("keydown", stopReload);
    submit.addEventListener("click", addScore);
    
}

// Prevents entry field from reloading page
function stopReload(event) {
    if(event.key === "Enter") {
        event.preventDefault();
    }
}

// Prevents submit from reloading page, checking valid initial format
// End of quiz is + form removed + score saves
function addScore(event) {
    if(event !== undefined) {
        event.preventDefault();
    }
    var id = document.getElementById("initials");
    if(id.value.length > 3 || id.value.length === 0) {
        invalidInput();
        return;
    }
    isQuizOngoing = false;
    document.getElementById("form").remove();
    saveScore(id);
}

// Checking local storage for previous entries, if so, adds them into array + upeates local storage
function saveScore(id) {
    if(localStorage.getItem("leaderboard") !== null) {
        leaderboard = JSON.parse(localStorage.getItem("leaderboard"));
    }
    leaderboard.push(`${score} ${id.value}`);
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    showScores();    
}

// If an incorrect input, message is displayed - submit button listens for click
function invalidInput() {
    answer.textContent = "Initials must be entered using three characters or less.";
    answer.setAttribute("style", "color: white");
    clearAnswer();
    var submit = document.getElementById("submit");
    submit.addEventListener("click", addScore);
}

// Preventing checking of scores during quiz - otherwise displays message
// Changes title, displays scores, creation of navigation buttons
function showScores() {
    if(!isQuizOngoing) {
        title.textContent = "High Scores";
        // Hides 'start quiz' if 'view top scores' is clicked at start
        start.setAttribute("style", "display: none");
        writeScores();
        createEndButtons();
    } else if(title.textContent === "All done.") {
        answer.textContent = "Please enter your initials first.";
        answer.setAttribute("style", "color: white");
        clearAnswer();
    } else {
        answer.textContent = "Cannot view scores until the quiz is over.";
        answer.setAttribute("style", "color: white");
        clearAnswer();
    }
}

// CLears all text and formats for top scores
// Checks local storage for previous scores, if so, populates into array, sorted to show top score.
function writeScores() {
    content.textContent = "";
    content.setAttribute("style", "white-space: pre-wrap; font-size: 150%");
    if(localStorage.getItem("leaderboard") !== null) {
        leaderboard = JSON.parse(localStorage.getItem("leaderboard"));
    }
    leaderboard.sort();
    leaderboard.reverse();
    var limit = 11;
    if(limit > leaderboard.length) {
        limit = leaderboard.length;
    }
    for(var i = 0; i < limit; i++) {
        content.textContent += leaderboard[i] + '\n';
    }
}

// Creation of buttons
function createEndButtons() {
    if(!document.getElementById("restart")) {
        var restartVar = document.createElement("button");
        container.appendChild(restartVar);
        restartVar.textContent = "Go Back";
        restartVar.setAttribute("id", "restart");
        
        var clearScoresVar = document.createElement("button");
        container.appendChild(clearScoresVar);
        clearScoresVar.textContent = "Clear High Scores";
        clearScoresVar.setAttribute("id", "clearScores");
        
        restartVar.addEventListener("click", restart);
        clearScoresVar.addEventListener("click", clearScores)
    }
}

// Removes the current buttons on the screen, setting title and content to original state
// Shows start button again, resets variables, runs 'init' function
function restart() {
    title.setAttribute("style", "align-self: center");
    content.setAttribute("style", "align-self: center; font-size: 110%");
    document.getElementById("restart").remove();
    document.getElementById("clearScores").remove();
    title.textContent = "Jack's Coding Quiz!";
    content.textContent = "Welcome to The Coding Quiz! Test your coding knowledge and answer all questions within the time limit. Please note, incorrect answers will deduct ten seconds off the remaining time!";
    start.setAttribute("style", "display: visible");
    currentQues = 0;
    score = 0;
    timeLeft = 60;
    init();
}

// Clears local storage, top score array and current content box
function clearScores() {
    localStorage.clear();
    content.textContent = "";
    leaderboard = [];
}

init();