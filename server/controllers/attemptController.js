export function createAttemptController(attemptService) {
  return {
    async getAllAttempts(req, res, next) {
      try {
        const attempts = await attemptService.getAllAttempts()
        res.status(200).json(attempts)
      } catch (err) {
        next(err)
      }
    },

    async getAttemptById(req, res, next) {
      try {
        const { id } = req.params
        const attempt = await attemptService.getAttemptById(id)
        res.status(200).json(attempt)
      } catch (err) {
        next(err)
      }
    },

    async createAttempt(req, res, next) {
      try {
        const { problemId, solution, explanation } = req.body
        const attempt = await attemptService.createAttempt({ problemId, solution, explanation })
        res.status(201).json(attempt.toJSON())
      } catch (err) {
        next(err)
      }
    },

    async retryAttempt(req, res, next) {
      try {
        const { id } = req.params
        const newAttempt = await attemptService.retryAttempt(id)
        res.status(201).json(newAttempt.toJSON())
      } catch (err) {
        next(err)
      }
    }
  }
}
