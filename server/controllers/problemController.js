export function createProblemController(problemService) {
  return {
    async getAllProblems(req, res, next) {
      try {
        const problems = await problemService.getAllProblems()
        res.status(200).json(problems.map((p) => p.toJSON()))
      } catch (err) {
        next(err)
      }
    },

    async getProblemById(req, res, next) {
      try {
        const { id } = req.params
        const problem = await problemService.getProblemById(id)
        res.status(200).json(problem.toJSON())
      } catch (err) {
        next(err)
      }
    }
  }
}
