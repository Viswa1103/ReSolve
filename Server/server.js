const express = require("express")
const db = require("./db")
const cors = require("cors")
const auth = require("./utils/auth")
const { rowToProblem } = require("./utils/rowToProblem")
const { requireAuth } = require("./utils/requireAuth")
require("dotenv").config()
const path = require("path")



const app = express()
app.use(cors())
app.use(express.json())

app.use(express.static(path.join(__dirname,"..","public")))

console.log(__dirname)

app.post("/api/register" , auth.register)

app.post("/api/login" , auth.login)

app.get("/", (req, res) => {
    res.send("Hello It is working")
})
app.get("/api/problems",requireAuth , async (req, res) => {

    try {

        

        const results = await db.query("SELECT * from problems WHERE user_id = $1 order by id ASC", [req.userId])
        const problems = results.rows.map(rowToProblem)
        res.json({
            problems :problems,
            userName : req.userName
        })

    } catch (error) {

        console.log("Error message :", error.message);
        res.status(500).json({ Error: " Could not connect to the endpoint" })

    }
})

app.post("/api/problems",requireAuth , async (req, res) => {

    try {
        const p = req.body;
        const results =await db.query(`INSERT INTO problems (
                        user_id,
                        problem_num,
                        problem_name,
                        pattern,
                        difficulty,
                        status,
                        problem_url,
                        problem_insight,
                        solved_date,
                        review_stage,
                        next_review_date,
                        last_reviewed_date,
                        history
                    )
                    VALUES (
                        $1, $2, $3, $4, $5, $6,
                        $7, $8, $9, $10, $11, $12 , $13
                    )
                    RETURNING *
                `, [req.userId,p.problemNum, p.problemName, p.pattern, p.difficulty, p.status, p.problemUrl, p.problemInsight, p.solvedDate, p.review.stage,
        p.review.nextReviewDate, p.review.lastReviewedDate, JSON.stringify(p.review.history)]
        )
        console.log(results.rows[0])
        res.status(201).json(rowToProblem(results.rows[0]))

    } catch (error) {
        console.log("Error Message: ", error.message)
        res.status(500).json({ Error: "Could not create a problem" })

    }

})

app.put("/api/problems/:id",requireAuth , async (req, res) => {
    try {
        const p = req.body
        const id = req.params.id


        const results =await db.query(`UPDATE problems
    SET
        problem_num = $1,
        problem_name = $2,
        pattern = $3,
        difficulty = $4,
        status = $5,
        problem_url = $6,
        problem_insight = $7,
        solved_date = $8,
        review_stage = $9,
        next_review_date = $10,
        last_reviewed_date = $11,
        history = $12
    WHERE id = $13 AND user_id = $14
    RETURNING *
`, [
            p.problemNum,
            p.problemName,
            p.pattern,
            p.difficulty,
            p.status,
            p.problemUrl,
            p.problemInsight,
            p.solvedDate,
            p.review.stage,
            p.review.nextReviewDate,
            p.review.lastReviewedDate,
            JSON.stringify(p.review.history),
            id,
            req.userId
        ])

        if (results.length === 0) {
            return res.status(404).json({ Error: "Problem  not Found" })
        }

        res.json(rowToProblem(results.rows[0]))
    } catch (error) {
        console.log("Error :" ,error.message)
        res.status(500).json({Error : "Could not update problem"})
    }
})

app.delete("/api/problems/:id" ,requireAuth , async (req,res) =>{
    try {
        const result = await db.query("DELETE FROM problems WHERE id = $1 AND user_id = $2" , [req.params.id , req.userId])

        if(result.rowCount ===0){
            res.status(404).json({Error : "Problem not found"})
        }
        res.json({ok :true})
    } catch (error) {

        console.log("error : " ,error.message)
        res.status(500).json({Error : "Cannot delete the problem"})        
    }
})

const Port = 8000

app.listen(Port, function () {
    console.log("Server Started")


})

