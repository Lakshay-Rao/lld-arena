export function createEvaluationController(evaluationService) {
  return {
    async evaluateAttempt(req, res, next) {
      try {
        const { id } = req.params
        const result = await evaluationService.evaluateAttempt(id)
        res.status(200).json(result)
      } catch (err) {
        next(err)
      }
    }
  }
}
