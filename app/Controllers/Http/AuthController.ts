import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Profile from 'App/Models/Profile'
import Users from 'App/Models/users'
import Hash from '@ioc:Adonis/Core/Hash'
import users from 'App/Models/users'

export default class AuthController {
  public async register({ request, response }: HttpContextContract) {
    const validationSchema = schema.create({
      full_name: schema.string(),
      email: schema.string({ trim: true }, [
        rules.email(),
        rules.unique({ table: 'users', column: 'email' }),
      ]),
      password: schema.string({ trim: true }, [
        rules.confirmed(),
      ]),
    })

    const userDetails = await request.validate({
      schema: validationSchema
    })

    const user = new Users
    const profile = new Profile

    user.email = userDetails.email
    user.password = userDetails.password
    profile.full_name = userDetails.full_name

    try {
      await user.save() && await user.related('profile').save(profile)
      return response.status(200).json({ code: 200, status: 'success' })
    } catch (error) {
      return response.status(500).json({ code: 500, status: 'error', message: error.message })
    }
  }

  public async login({ request, auth, response }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    try {
      const token = await auth.use('api').attempt(email, password, {
        expiresIn: '7days'
      })

      const user = await users.findByOrFail('email', email)
      await user.load('profile')

      return response.status(200).json({ code: 200, status: 'success', data: token, theme : user.profile.theme })

    } catch (error) {
      if (error.code === 'E_INVALID_AUTH_UID') {
        error.code = 400
        error.message = 'Email address not found'
      }

      if (error.code === 'E_INVALID_AUTH_PASSWORD') {
        error.code = 400
        error.message ='Password mis-match'
      }
      return response.status(error.code).json({ code: error.code, status: 'error', message: error.message })

    }
  }

  public async logout({ auth, response }: HttpContextContract) {
    try {
      await auth.logout()
      return response.status(200).json({ code: 200, status: 'success' })
    } catch (error) {
      return response.status(500).json({ code: 500, status: 'error', message: error.message })
    }
  }

  public async changePassword({ auth, request, response }: HttpContextContract) {

    const validationSchema = schema.create({
      current_password: schema.string({ trim: true }),
      password: schema.string({ trim: true }, [
        rules.confirmed(),
      ]),
    })

    const userDetails = await request.validate({
      schema: validationSchema
    })
    const user = await Users.find(auth.user?.id)

    try {

      if (!user) throw new Error('user not found')


      if (await Hash.verify(user?.password, userDetails.current_password)) {
        user.merge({ password: userDetails.password })

        await user?.save()
        return response.status(200).json({ code: 200, status: 'success' })

      } else {
        throw new Error('password mis-match')
      }
    } catch (error) {
      return response.status(500).json({ code: 500, status: 'error', message: error.message })
    }

  }
}
