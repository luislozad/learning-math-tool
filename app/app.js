class MathQuest {
    number = 0;
    min = 0;
    max = 0;

    constructor(min, max) {
        this.min = min;
        this.max = max;
    }

    generate() {
        const { min, max } = this;
        this.number = Math.random() * (max - min + 1) + min;

        return this.getNumber();
    }

    getNumber() {
        return Math.floor(this.number);
    }
}

const App = (function() {
    const quest = new MathQuest(2, 9);

    function generateNewQuest(quest) {
        return [quest.generate(), quest.generate()];
    }
    
    function setQuestion(num1, num2, id) {
        const question = document.querySelector(id);

        if (question) {
            question.innerText = `${num1} x ${num2}`;
        } else {
            throw new Error('No se pudo encontrar el elemento selector ' + id);
        }
    }

    function setAnswer(answer, id) {
        const answerSelector = document.querySelector(id);

        if (answerSelector) {
            answerSelector.innerText = answer;
        } else {
            throw new Error('No se pudo encontrar el elemento selector ' + id);
        }
    }

    function checkAnswer(stateAnswer, userAnswer) {
        const [ num1, num2 ] = stateAnswer;
        return (num1 * num2) === userAnswer;
    }

    function handleAnswer(answer) {
        const answer_incorrect = document.querySelector('#answer_incorrect');
        const answer_correct = document.querySelector('#answer_correct');
        const answer_msg = document.querySelector('.calc__message');

        if (answer_msg) {
            answer_msg.classList.remove('hide_element');

            if (answer) {
                if (answer_correct && answer_incorrect) {
                    answer_correct.classList.remove('hide_element');
                    answer_incorrect.classList.add('hide_element');
                } else {
                    throw new Error('No se pudo encontrar el elemento selector ' + '#answer_correct' + ' y ' + '#answer_incorrect');
                }

                answer_msg.classList.remove('theme_answer_incorrect');
                answer_msg.classList.add('theme_answer_correct');
            } else if (typeof(answer) === 'boolean' && answer === false) {
                if (answer_correct && answer_incorrect) {
                    answer_correct.classList.add('hide_element');
                    answer_incorrect.classList.remove('hide_element');
                } else {
                    throw new Error('No se pudo encontrar el elemento selector ' + '#answer_correct' + ' y ' + '#answer_incorrect');
                }
                
                answer_msg.classList.add('theme_answer_incorrect');
                answer_msg.classList.remove('theme_answer_correct');
            } else {
                throw new Error('Se espera un argumento boleano');
            }
        } else {
            throw new Error('No se pudo encontrar el elemento selector ' + '.calc__message');
        }
    }

    function newStateQuestion(stateAnswer) {
        const [ num1, num2 ] = generateNewQuest(quest);

        if (Array.isArray(stateAnswer)) {
            if (stateAnswer.length <= 0) {
                stateAnswer.push(num1, num2);
            } else {
                stateAnswer.length = 0;
                stateAnswer.push(num1, num2);                
            }
        } else {
            throw new Error('Para poder manejar el estado de las nuevas preguntas, se requiere que se pase como argumento un tipo array');
        }
    }

    function cleanInputAnswer() {
        const answer = document.querySelector('#answer');

        if (answer) {
            answer.value = '';
            answer.focus();
        } else {
            throw new Error('No se pudo encontrar el elemento selector ' + '#answer');
        }
    }

    function onEventAnswer(stateAnswer) {
        const on_answer = document.querySelector('.calc__submit button');
        const input_answer = document.querySelector('#answer');
        
        const handle = (_e) => {
            if (input_answer) {
                updateQuestionSolution(stateAnswer);

                const check = checkAnswer(stateAnswer, input_answer.value * 1);

                handleAnswer(check);
                // Crea una nueva pregunta
                newStateQuestion(stateAnswer);
                updateQuestion(stateAnswer);
                cleanInputAnswer();
            } else {
                throw new Error('No se pudo encontrar el elemento selector ' + '#answer');
            }
        };

        if (on_answer) {
            on_answer.addEventListener('click', handle);
        } else {
            throw new Error('No se pudo encontrar el elemento selector ' + '.calc__submit button');
        }
    }

    function onEventInputAnswer(stateAnswer) {
        const input = document.querySelector('#answer');

        const handle = ({ key }) => {
            if (key === 'Enter') {
                updateQuestionSolution(stateAnswer);
    
                const check = checkAnswer(stateAnswer, input.value * 1);
    
                handleAnswer(check);
                // Crea una nueva pregunta
                newStateQuestion(stateAnswer);
                updateQuestion(stateAnswer);
                cleanInputAnswer();
            }
        };

        if (input) {
            input.addEventListener('keypress', handle);
        } else {
            throw new Error('No se pudo encontrar el elemento selector ' + '#answer');
        }
    }

    function updateQuestion(state) {
        const [ num1, num2 ] = state;
    
        setQuestion(num1, num2, '#question');
    }

    function updateQuestionSolution(state) {
        const [ num1, num2 ] = state;

        setQuestion(num1, num2, '#question_solution');

        setAnswer(num1 * num2, '#true_answer');
    }

    function start() {
        const state = [];

        newStateQuestion(state);

        updateQuestion(state);

        updateQuestionSolution(state);

        onEventAnswer(state);

        onEventInputAnswer(state);
    }

    start();

})();