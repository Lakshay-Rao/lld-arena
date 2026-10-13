export class Problem {
  constructor(data = {}) {
    const requirements = data.requirements ?? []
    const tags = data.tags ?? []
    const thingsToThinkAbout = data.thingsToThinkAbout ?? data.things_to_think_about ?? []
    const considerations = data.considerations ?? []
    const starterTemplate = data.starterTemplate ?? data.starter_template ?? ''
    const starterExplanation = data.starterExplanation ?? data.starter_explanation ?? ''

    this.id = data.id
    this.title = data.title
    this.description = data.description
    this.difficulty = data.difficulty
    this.category = data.category
    this.requirements = typeof requirements === 'string' ? JSON.parse(requirements) : requirements
    this.tags = typeof tags === 'string' ? JSON.parse(tags) : tags
    this.thingsToThinkAbout = typeof thingsToThinkAbout === 'string' ? JSON.parse(thingsToThinkAbout) : thingsToThinkAbout
    this.considerations = typeof considerations === 'string' ? JSON.parse(considerations) : considerations
    this.starterTemplate = starterTemplate
    this.starterExplanation = starterExplanation
  }

  validate() {
    if (!this.id) throw new Error('Problem ID is required')
    if (!this.title) throw new Error('Problem title is required')
    if (!this.description) throw new Error('Problem description is required')
    return true
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      shortDescription: this.description,
      difficulty: this.difficulty,
      category: this.category,
      requirements: this.requirements,
      tags: this.tags,
      thingsToThinkAbout: this.thingsToThinkAbout,
      considerations: this.considerations,
      starterTemplate: this.starterTemplate,
      starterExplanation: this.starterExplanation
    }
  }
}
