import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import users from 'App/Models/users'

export default class Rbac {
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>, rule: string[]) {
    const roles = rule

    if (roles.length === 0) await next()

    try {
      const user = await users.findByOrFail('email', auth.user?.email)

      await user.load('userRole')

      const roleName = user.userRole.role

      if (!roles.includes(roleName)) throw new Error(`Only user with role: ${roles} can access the route`)
      await next()

    } catch (error) {
      return response.status(500).json({ code: 500, status: 'error', message: error.message })
    }
  }
}
