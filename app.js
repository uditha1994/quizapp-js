//Base Question Class
class Question {
    constructor(id, text, point = 1) {
        this._id = id;
        this._text = text
        this._point = point;
    }

    get id() {
        return this._id;
    }

    set id(id) {
        this._id = id;
    }

    set text(text) {
        this._text = text
    }

    get text() {
        return this._text;
    }
    

    get points() {
        return this._point;
    }

    checkAnswer(answer) {
        throw new Error("Method must be implemented");
    }

    displayOptions(container) {
        throw new Error("Method must be implemented");
    }
}

//Muliple choice question class - child
class MultipleChoiceQuestion extends Question {
    constructor(id, text, options, correctAnswer, points = 1) {
        super(id, text, points);
        this._options = options;
        this._correctAnswer = correctAnswer;
    }

    get options() {
        return this._options;
    }

    checkAnswer(answer) {
        return answer === this._correctAnswer;
    }

    displayOptions(container) {
        container.innerHTML = '';
        const prefixes = ['A', 'B', 'C', 'D'];

        this._options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.dataset.value = prefixes[index];
            optionElement.innerHTML = `
                <div class="option-prefix">${prefixes[index]}</div>
                <div class="option-text">${option}</div>
            `;

            optionElement.addEventListener('click', () => {
                document.querySelectorAll('.option').forEach
                    (opt => opt.classList.remove('selected'));
                optionElement.classList.add('selected');
            });
            container.appendChild(optionElement);
        });
    }
}

//True/False Question Class
class TrueFalseQuestion extends Question {
    constructor(id, text, correctAnswer, points = 1) {
        super(id, text, points);
        this._correctAnswer = correctAnswer;
    }

    checkAnswer(answer) {
        return answer === this._correctAnswer;
    }

    displayOptions(container) {
        container.innerHTML = '';

        const trueOption = document.createElement('div');
        trueOption.className = 'option';
        trueOption.dataset.value = 'true';
        trueOption.innerHTML = `
            <div class="option-prefix">T</div>
            <div class="option-text">True</div>
        `;

        const falseOption = document.createElement('div');
        falseOption.className = 'option';
        trueOption.dataset.value = 'false';
        falseOption.innerHTML = `
            <div class="option-prefix">F</div>
            <div class="option-text">False</div>
        `;

        [trueOption, falseOption].forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.option').forEach
                    (opt => opt.classList.remove('selected'));
                option.classList.add('selected');
            });
        });

        container.appendChild(trueOption);
        container.appendChild(falseOption);
    }
}


//Quiz Class - Manage the quiz questions and flow
class Quiz {
    constructor(questions, timePerQuestion = 30) {
        this._questions = questions;
        this._currentQuestionIndex = 0;
        this._score = 0;
        this.timePerQuestion = timePerQuestion;
        this._timeRemaining = timePerQuestion
        this._timerInterval = null;
        this._userAnswers = new Array(questions.length).fill(null);
        this._startTime = null;
        this._endTime = null;
    }

    get currentQuestion() {
        return this._questions[this._currentQuestionIndex];
    }

    get questions() {
        return this._questions;
    }

    get currentQuestionIndex() {
        return this._currentQuestionIndex;
    }

    get score() {
        return this._score;
    }

    get totalPoints() {
        return this.questions.reduce
            ((total, question) => total + question.points, 0);
    }

    get timeRemaining() {
        return this._timeRemaining;
    }

    start() {
        this._startTime = new Date();
        this.startTimer();
    }

    end() {
        this._endTime = new Date();
        clearInterval(this._timerInterval);
    }

    startTimer() {
        clearInterval(this._timerInterval);
        this._timeRemaining = this.timePerQuestion;

        this._timerInterval = setInterval(() => {
            this._timeRemaining--;

            if (this._timeRemaining <= 0) {
                clearInterval(this._timerInterval);
                this.nextQuestion();
            }
        }, 1000);
    }

    submitAnswer(answer) {
        this._userAnswers[this._currentQuestionIndex] = answer;

        if (this.currentQuestion.checkAnswer(answer)) {
            this._score += this.currentQuestion.points;
            return true;
        }

        return false;
    }

    nextQuestion() {
        clearInterval(this._timerInterval);

        if (this._currentQuestionIndex < this._questions.length - 1) {
            this._currentQuestionIndex++;
            this.startTimer();
            return true;
        }

        return false;
    }

    previousQuestion() {
        clearInterval(this._timerInterval);

        if (this._currentQuestionIndex > 0) {
            this._currentQuestionIndex--;
            this.startTimer();
            return true;
        }

        return false;
    }

    get userAnswers(){
        return this._userAnswers;
    }

    get timeSpent(){
        if(!this._startTime) return 0;

        const end = this._endTime || new Date();
        return Math.floor((end - this._startTime)/1000);
    }

    formatTimeSpent(){
        const totlSeconds = this.timeSpent;
        const minutes = Math.floor(totlSeconds/60);
        const seconds = totlSeconds % 60;
        return `${minutes.toString().padStart(2,'0')}:
        ${seconds.toString().padStart(2,'0')}`;
    }
}