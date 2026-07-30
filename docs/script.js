// let problemNum = document.getElementById("leetcode-number")
// let problemName = document.getElementById("leetcode-name")
// let Pattern = document.getElementById("pattern")
// let problemUrl = document.getElementById("problem-url")
// let problemInsight = document.getElementById("problem-insight")

let problems = []
loadData()
let currentDate = new Date();
let deletedId = null
let editedId = null
// ------------------------------ Local Storage Function ----------------------------------------

function saveData() {
    localStorage.setItem("problems", JSON.stringify(problems))
}

function loadData() {
    let savedProblem = localStorage.getItem("problems")
    if (savedProblem != null) {
        problems = JSON.parse(savedProblem)
    }
}



let menuBtn = document.querySelector(".menu-btn")
let closebtn = document.querySelector(".close-btn")
let sidebar = document.querySelector(".sidebar")

if (menuBtn) {
    menuBtn.addEventListener("click", function () {
        console.log("clicked")
        sidebar.classList.add("show")
    })

    closebtn.addEventListener("click", function () {
        sidebar.classList.remove("show")

    })
}


// -------------------------Problem Count in DashBoard ----------------------------


function problemLoggedToday() {
    return problems.filter(function (problem) {
        return problem.solvedDate === getTodayDate()
    }).length
}

function problemReviewedToday() {

    return problems.filter(function (problem) {
        return problem.review.history.some(function (review) {
            return review.date === getTodayDate();
        })
    }).length
}

// console.log(problemReviewedToday())

function renderDatesDashboard() {
    let probelmCount = document.getElementById("problem-count");

    if (probelmCount) {

        probelmCount.textContent = problems.length

        let loggedCount = document.getElementById("loggedCount")
        loggedCount.textContent = problemLoggedToday() + problemReviewedToday()
    }

}

function renderStreak() {
    let reviewDates = new Set()

    for (let problem of problems) {
        for (let review of problem.review.history) {
            reviewDates.add(review.date)
        }
        reviewDates.add(problem.solvedDate)

    }

    let streak = 0;

    let currentDate = new Date()
    while (true) {

        let dateString = currentDate.toISOString().slice(0, 10)
        if (reviewDates.has(dateString)) {
            streak++;

            currentDate.setDate(currentDate.getDate() - 1);
        }
        else {
            break;
        }
    }
    // console.log(streak)

    let headerStreak = document.getElementById("header-streak")
    headerStreak.textContent = `🔥 ${streak} Days Streak`

    let streakCount = document.getElementById("streak-count")
    if (streakCount)
        streakCount.textContent = streak
}


// -------------------------------------------Today Date and next Review Date Function ------------------------------------

function getTodayDate() {
    return new Date().toISOString().slice(0, 10)
}

function nextReviewDate(stage, previousDate) {
    let intervals = [1, 3, 7, 14, 30, 60, 90]
    let todayDate = new Date(previousDate)

    todayDate.setDate(todayDate.getDate() + intervals[stage])

    return todayDate.toISOString().slice(0, 10)
}

// --------------------------------------------Function for the Btn in the Log a problem form ----------------------------

let selectedDifficulty = "Medium"
let easyBtn = document.getElementById("easy-btn")
let mediumBtn = document.getElementById("medium-btn")
let hardBtn = document.getElementById("hard-btn")


let selectedStatus = "Solved Clean"
let solvedCleanBtn = document.getElementById("solved-clean")
let neededHintBtn = document.getElementById("needed-hint")
let readSolutionBtn = document.getElementById("read-solution")

function clearStatus() {
    solvedCleanBtn.classList.remove("btn-on")
    neededHintBtn.classList.remove("btn-on")
    readSolutionBtn.classList.remove("btn-on")
}

if (solvedCleanBtn) {

    solvedCleanBtn.addEventListener("click", function () {
        selectedStatus = "Solved Clean"
        clearStatus()
        solvedCleanBtn.classList.add("btn-on");

    })

    neededHintBtn.addEventListener("click", function () {
        selectedStatus = "Needed a hint"
        clearStatus()
        neededHintBtn.classList.add("btn-on");
    })
    readSolutionBtn.addEventListener("click", function () {
        selectedStatus = "Read Solution"
        clearStatus()
        readSolutionBtn.classList.add("btn-on");
    })



    function clearDifficulty() {
        easyBtn.classList.remove("dif-btn-on")
        mediumBtn.classList.remove("dif-btn-on")
        hardBtn.classList.remove("dif-btn-on")
    }

    easyBtn.addEventListener("click", function () {
        selectedDifficulty = "Easy"
        clearDifficulty()
        easyBtn.classList.add("dif-btn-on")
    })
    mediumBtn.addEventListener("click", function () {
        selectedDifficulty = "Medium"
        clearDifficulty()
        mediumBtn.classList.add("dif-btn-on")
    })
    hardBtn.addEventListener("click", function () {
        selectedDifficulty = "Hard"
        clearDifficulty()
        hardBtn.classList.add("dif-btn-on")
    })
}


// -------------------------------------------------------- Log a problem Form ----------------------------------------

let addProblemBtn = document.getElementById("form-submit")

if (addProblemBtn) {


    addProblemBtn.addEventListener("click", function (e) {


        let problemNum = Number(document.getElementById("leetcode-number").value)
        let problemName = document.getElementById("problem-name").value
        let pattern = document.getElementById("pattern").value
        let problemUrl = document.getElementById("problem-url").value || `https://leetcode.com/problems/${problemName.toLowerCase().replaceAll(" ", "-")}/description/`
        let problemInsight = document.getElementById("problem-insight").value

        problems.push({
            id: problems.length + 1,
            problemNum: problemNum,
            problemName: problemName,
            pattern: pattern,
            difficulty: selectedDifficulty,
            status: selectedStatus,
            problemUrl: problemUrl,
            problemInsight: problemInsight,
            solvedDate: getTodayDate(),
            review: {
                stage: 0,
                nextReviewDate: nextReviewDate(0, getTodayDate()),
                lastReviewedDate: null,
                history: []
            }
        })


        saveData()

    })

}

// ------------------------------------------------------- Render Problems --------------------------------------------------------



// let problemTableBody = document.getElementById("problem-table-body")
let modalContent = document.querySelector(".delete-modal-content")
let header = document.querySelector("header")
let mainContent = document.querySelector("main")
let editModalContent = document.querySelector(".edit-modal-content")

function renderProblems(problemList) {


    let problemTableBody = document.getElementById("problem-table-body")

    if (problemTableBody) {


        problemTableBody.innerHTML = ""

        for (let i = 0; i < problemList.length; i++) {
            let problem = problemList[i]

            problemTableBody.innerHTML += `<tr>
            <td>#${problem.problemNum}</td>
            <td><a href="${problem.problemUrl}" target="_blank" >${problem.problemName}</a></td>
            <td ><span class="pattern">${problem.pattern}</span></td>
            <td class="difficulty-${(problem.difficulty).toLowerCase()}">${problem.difficulty}</td>
            <td class="next-revieew">${problem.review.nextReviewDate}</td>
            <td>
            <button class="edit-btn" id="edit-problem-btn" data-id ="${problem.id}">⚙️</button>
            <button class="delete-btn" data-id ="${problem.id}">❌</button></td>
            </tr>`
        }
    }

    let deleteBtns = document.querySelectorAll(".delete-btn")
    // console.log(deleteBtns)

    if (deleteBtns) {

        for (let btn of deleteBtns) {
            btn.addEventListener("click", function () {

                // console.log("clicked")
                let id = Number(this.dataset.id)

                deletedId = id
                modalContent.classList.remove("hidden")
                header.classList.add("blur")
                mainContent.classList.add("blur")
            })

        }
    }

    let editBtns = document.querySelectorAll(".edit-btn")
    // console.log(editBtns)

    if (editBtns) {

        for (let btn of editBtns) {
            btn.addEventListener("click", function () {

                // console.log("clicked")
                let id = Number(this.dataset.id)

                editedId = id
                editModalContent.classList.remove("hidden")
                preFillForm()
                header.classList.add("blur")
                mainContent.classList.add("blur")
            })

        }

    }

}

function preFillForm() {

    let problem = problems.find(function (problem) {
        return problem.id === editedId
    })

    document.getElementById("edit-problem-easy-btn").classList.remove("dif-btn-on");
    document.getElementById("edit-problem-medium-btn").classList.remove("dif-btn-on");
    document.getElementById("edit-problem-hard-btn").classList.remove("dif-btn-on");

    if (problem.difficulty === "Easy") {
        document.getElementById("edit-problem-easy-btn").classList.add("dif-btn-on");
    }
    else if (problem.difficulty === "Medium") {
        document.getElementById("edit-problem-medium-btn").classList.add("dif-btn-on");
    }
    else if (problem.difficulty === "Hard") {
        document.getElementById("edit-problem-hard-btn").classList.add("dif-btn-on");
    }

    document.getElementById("edit-leetcode-number").value = problem.problemNum
    document.getElementById("edit-problem-name").value = problem.problemName
    document.getElementById("edit-problem-pattern").value = problem.pattern
    document.getElementById("edit-problem-insight").value = problem.problemInsight

}

let editedDifficulty = "Medium"
let editproblemEasyBtn = document.getElementById("edit-problem-easy-btn")
let editproblemMediumBtn = document.getElementById("edit-problem-medium-btn")
let editproblemHardBtn = document.getElementById("edit-problem-hard-btn")



function clearDifficulty() {
    editproblemEasyBtn.classList.remove("dif-btn-on")
    editproblemMediumBtn.classList.remove("dif-btn-on")
    editproblemHardBtn.classList.remove("dif-btn-on")
}

if (editproblemEasyBtn) {


    editproblemEasyBtn.addEventListener("click", function () {
        editedDifficulty = "Easy"
        clearDifficulty()
        editproblemEasyBtn.classList.add("dif-btn-on")
    })
    editproblemMediumBtn.addEventListener("click", function () {
        editedDifficulty = "Medium"
        clearDifficulty()
        editproblemMediumBtn.classList.add("dif-btn-on")
    })
    editproblemHardBtn.addEventListener("click", function () {
        editedDifficulty = "Hard"
        clearDifficulty()
        editproblemHardBtn.classList.add("dif-btn-on")
    })
}


let editProblemFormCancelBtn = document.getElementById("edit-problem-form-cancel-btn")
let editProblemFormSubmitBtn = document.getElementById("edit-problem-form-submit")

if (editProblemFormSubmitBtn) {

    editProblemFormCancelBtn.addEventListener("click", function () {
        header.classList.remove("blur")
        mainContent.classList.remove("blur")
        editModalContent.classList.add("hidden")
        editedId = null

    })

    editProblemFormSubmitBtn.addEventListener("click", function () {
        let editLeetcodeNum = Number(document.getElementById("edit-leetcode-number").value)
        let editLeetcodeName = document.getElementById("edit-problem-name").value
        let editProblemPattern = document.getElementById("edit-problem-pattern").value
        let editProblemInsight = document.getElementById("edit-problem-insight").value

        let problem = problems.find(function (problem) {
            return problem.id === editedId
        })

        if (!problem) {
            return
        }

        problem.problemNum = Number(document.getElementById("edit-leetcode-number").value)
        problem.problemName = document.getElementById("edit-problem-name").value
        problem.pattern = document.getElementById("edit-problem-pattern").value
        problem.problemInsight = document.getElementById("edit-problem-insight").value
        problem.difficulty = editedDifficulty

        editedId = null

        saveData()
        renderProblems()
    })

}



// ----------------------------------------------------------- Delete Option Confirmation buttons -----------------------------------------

let cancelBtn = document.getElementById("cancel-btn")
let confirmBtn = document.getElementById("confirm-btn")

if (confirmBtn) {
    confirmBtn.addEventListener("click", function () {
        let index = problems.findIndex(function (problem) {
            return problem.id === deletedId
        })
        if (index != -1) {
            problems.splice(index, 1)
        }
        header.classList.remove("blur")
        mainContent.classList.remove("blur")
        modalContent.classList.add("hidden")
        deletedId = null
        saveData()
        renderProblems(problems)
    })

    cancelBtn.addEventListener("click", function () {
        header.classList.remove("blur")
        mainContent.classList.remove("blur")
        modalContent.classList.add("hidden")
        deletedId = null

    })

}


renderProblems(problems)

// ---------------------------------------------------Search Option in the Problems Page ------------------------------------------

function applyFilter() {
    let searchText = document.getElementById("search").value.toLowerCase()
    let searchPattern = document.getElementById("patterns").value
    let searchDifficulties = document.getElementById("difficulties").value

    let filteredProblems = problems.filter(function (problem) {

        let matchesSearch = problem.problemName.toLowerCase().includes(searchText) || problem.problemNum.toString().includes(searchText)

        let matchesPattern = searchPattern === "" || searchPattern === problem.pattern
        let matchesDifficulty = searchDifficulties === "" || searchDifficulties === problem.difficulty


        return matchesSearch && matchesPattern && matchesDifficulty

    })

    renderProblems(filteredProblems)

}

let search = document.getElementById("search")

if (search) {
    search.addEventListener("input", applyFilter)
    document.getElementById("patterns").addEventListener("change", applyFilter)
    document.getElementById("difficulties").addEventListener("change", applyFilter)

}



// --------------------------------------------------DashBoard Review Queue -------------------------------------------------------
// problems[0].review.nextReviewDate = "2026-07-01";
// problems[0].review.stage = 0;
// problems[0].review.history = [];
saveData()
function renderReviewQueue() {

    let reviewList = document.querySelector(".review-list")
    console.log(reviewList)
    let reviewCount = document.getElementById("review-count")


    if (reviewList) {


        let reviewProblems = problems.filter(function (problem) {
            return problem.review.nextReviewDate <= getTodayDate()
        })

        // console.log(reviewProblems)

        reviewList.innerHTML = ""



        for (let problem of reviewProblems) {
            // console.log(problem)
            reviewList.innerHTML += `<div class="review-item">
            <div class="review-text">
            <div class="review-text-first">
            <span>#${problem.problemNum}</span>
            <span><b><a href="${problem.problemUrl}" target="blank">${problem.problemName}</a></b></span>
            <span>${problem.pattern}</span>
            </div>
            <p>Last Seen ${problem.review.lastReviewedDate || problem.solvedDate} | reviewed ${problem.review.history.length}x</p>
            <div class="review-note-container">
            <p>${problem.problemInsight}</p>
            </div>
            </div>
            
            <div class="review-btn-div">
            <button class="red-btn" data-id=${problem.id} data-result="Forgot">Forgot</button>
            <button class="darkyellow-btn" data-id=${problem.id} data-result="Hard">Hard</button>
            <button class="teal-btn" data-id=${problem.id} data-result="Medium">Medium</button>
            <button class="easy-btn" data-id=${problem.id} data-result="Easy">Easy</button>
            </div> `

        }

        addReviewButtonListner()
        reviewCount.innerHTML = ""
        reviewCount.innerHTML = reviewProblems.length
        let reviewProblemCount = document.getElementById("review-problem-count")
        reviewProblemCount.textContent = reviewProblems.length

        // renderReviewQueue()

    }
}

function addReviewButtonListner() {

    let reviewButtons = document.querySelectorAll(".review-btn-div button")
    for (let btn of reviewButtons) {

        btn.addEventListener("click", function () {
            let id = Number(this.dataset.id)
            let result = this.dataset.result

            updateReview(id, result)
            renderDatesDashboard()
            renderStreak()
        })
    }
}

function updateReview(id, result) {
    let problem = problems.find(function (problem) {
        return problem.id === id
    })

    // console.log(problem.review.stage)

    if (!problem) {
        return
    }

    if (result === "Easy") {
        if (problem.review.stage < 6) {
            problem.review.stage++
        }
    }
    else if (result === "Medium") {
        if (problem.review.stage < 6) {
            problem.review.stage++
        }

    }
    else if (result === "Hard") {
        if (problem.review.stage > 0) {
            problem.review.stage--
        }
    }
    else {
        problem.review.stage = 0
    }

    // console.log(problem.review.stage)

    problem.review.nextReviewDate = nextReviewDate(problem.review.stage, problem.review.nextReviewDate)
    problem.review.lastReviewedDate = getTodayDate()
    // console.log(problem.review.lastReviewedDate)
    // console.log(problem.review.nextReviewDate)
    // console.log(problem.review.history)
    problem.review.history.push({
        date: getTodayDate(),
        result: result
    })
    // console.log(problem)
    saveData()
    renderReviewQueue()

}

// console.log(problems)

// ----------------------------------------------Insights for the Patterns ---------------------------

function renderPatternStats() {

    let patternList = document.querySelector(".patterns-list")

    if (patternList) {

        let patternCount = {}

        for (let problem of problems) {
            if (patternCount[problem.pattern]) {
                patternCount[problem.pattern]++
            }
            else {
                patternCount[problem.pattern] = 1
            }
        }

        patternList.innerHTML = ""

        for (pattern in patternCount) {

            patternList.innerHTML += `<div class="pattern-item">
                        <span>${pattern}</span>
                        <span class="bar"></span>
                        <span>${patternCount[pattern]}</span>
                    </div>`
        }
    }
}
// ----------------------------------------------Insights for the Difficulty ---------------------------


function renderDifficultyStats() {

    let difficultyList = document.querySelector(".difficulty-list")

    if (difficultyList) {

        let difficultyCount = {}

        for (let problem of problems) {
            if (difficultyCount[problem.difficulty]) {
                difficultyCount[problem.difficulty]++
            }
            else {
                difficultyCount[problem.difficulty] = 1
            }
        }

        difficultyList.innerHTML = ""

        for (difficulty in difficultyCount) {

            difficultyList.innerHTML += `<div class="pattern-item">
                        <span>${difficulty}</span>
                        <span class="bar"></span>
                        <span>${difficultyCount[difficulty]}</span>
                    </div>`
        }
    }
}

// -------------------------------------------------------------------------------------------------------

renderReviewQueue()
renderDatesDashboard()
// console.log(problems)
renderStreak()
renderPatternStats()
renderDifficultyStats()

