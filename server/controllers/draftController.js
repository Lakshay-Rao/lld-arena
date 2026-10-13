export function createDraftController(draftRepository) {
  return {
    async getDraft(req, res, next) {
      try {
        const { problemId } = req.params
        const draft = draftRepository.findByProblemId(problemId)
        res.status(200).json(draft || null)
      } catch (err) {
        next(err)
      }
    },

    async saveDraft(req, res, next) {
      try {
        const { problemId } = req.params
        const { solution, code, explanation } = req.body
        const content = solution || code || ''
        const saved = draftRepository.save(problemId, content, explanation || '')
        res.status(200).json(saved)
      } catch (err) {
        next(err)
      }
    }
  }
}
