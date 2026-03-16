let exercises = [];
let currentExercise = 0;
let correctCount = 0;
let wrongCount = 0;

// Перемешивание массива
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Запуск темы
function start(topic) {

    fetch("exercises/" + topic + ".json")
    .then(response => {
        if (!response.ok) throw new Error("Файл темы не найден: " + topic);
        return response.json();
    })
    .then(data => {

        if (Array.isArray(data)) data = data[0];

        exercises = data.exercises.slice();

        shuffle(exercises);

        currentExercise = 0;
        correctCount = 0;
        wrongCount = 0;

        document.getElementById("good").textContent = correctCount;
        document.getElementById("bad").textContent = wrongCount;

        document.getElementById("nextBtn").style.display = "inline-block";

        showExercise();

    })
    .catch(error => {
        console.error(error);
        alert("Ошибка загрузки темы. Возможно повреждён JSON файл: " + topic);
    });
}

// Показ упражнения
function showExercise() {

    const questionDiv = document.getElementById("question");
    const answersDiv = document.getElementById("answers");

    if (currentExercise >= exercises.length) {

        questionDiv.textContent = "Тема завершена. Отличная работа!";
        answersDiv.innerHTML = "";

        document.getElementById("nextBtn").style.display = "none";

        return;
    }

    const ex = exercises[currentExercise];

    // поддержка sentence или question
    questionDiv.textContent = ex.sentence || ex.question;

    answersDiv.innerHTML = "";

    let options = ex.options.slice();

    shuffle(options);

    options.forEach(option => {

        const btn = document.createElement("button");

        btn.textContent = option;
        btn.classList.add("answer");

        btn.onclick = () => checkAnswer(option, btn);

        answersDiv.appendChild(btn);

    });
}

// Проверка ответа
function checkAnswer(answer, clickedBtn) {

    const ex = exercises[currentExercise];
    const correct = ex.answer;

    const buttons = document.getElementById("answers").children;

    for (let btn of buttons) {

        btn.disabled = true;

        if (btn.textContent === correct) {
            btn.classList.add("correct");
        }
        else if (btn === clickedBtn && answer !== correct) {
            btn.classList.add("wrong");
        }
    }

    if (answer === correct) {
        correctCount++;
    } else {
        wrongCount++;
    }

    document.getElementById("good").textContent = correctCount;
    document.getElementById("bad").textContent = wrongCount;
}

// Кнопка "Следующий"
function generate() {

    if (currentExercise < exercises.length) {

        currentExercise++;
        showExercise();
    }
}
