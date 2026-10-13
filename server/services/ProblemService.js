export class ProblemService {
  constructor(problemRepository) {
    this.problemRepository = problemRepository
  }

  async getAllProblems() {
    return this.problemRepository.findAll()
  }

  async getProblemById(id) {
    const problem = this.problemRepository.findById(id)
    if (!problem) {
      const err = new Error(`Problem with ID '${id}' not found`)
      err.status = 404
      throw err
    }
    return problem
  }
}
