function rowToProblem(row){
    return {
        id: row.id,
        problemNum: row.problem_num,
        problemName: row.problem_name,
        pattern: row.pattern,
        difficulty: row.difficulty,
        status: row.status,
        problemUrl: row.problem_url,
        problemInsight: row.problem_insight,
        solvedDate: row.solved_date,
        review: {
            stage: row.review_stage,
            nextReviewDate: row.next_review_date,
            lastReviewedDate: row.last_reviewed_date,
            history: row.history
        }
    }
}
module.exports = {rowToProblem}