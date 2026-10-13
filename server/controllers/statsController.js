export function createStatsController(attemptService) {
  return {
    async getStats(req, res, next) {
      try {
        const stats = await attemptService.getStats()
        res.status(200).json(stats)
      } catch (err) {
        next(err)
      }
    }
  }
}
