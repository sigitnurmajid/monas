import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Users from 'App/Models/Users'
import Database from '@ioc:Adonis/Lucid/Database'

export default class AuthController {
  public async register ({ request , auth, response}: HttpContextContract) {
    const validationSchema = schema.create({
      email: schema.string({ trim: true }, [
        rules.email(),
        rules.unique({ table: 'users', column: 'email' }),
      ]),
      password: schema.string({ trim: true }, [
        rules.confirmed(),
      ]),
    })

    const userDetails = await request.validate({
      schema: validationSchema,
    })

    const user = new Users
    user.email = userDetails.email
    user.password = userDetails.password
    await user.save()

    await auth.login(user)
    response.redirect('/dashboard')
  }

  public async login ({ request, auth }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    try {
      const token = await auth.attempt(email, password)
      const id = await Database.from('users').where('email', email).select('id')
      return {
        userId: id[0].id,
        token: token.token,
        type: token.type
      }
    } catch (error) {
      if (error.code === 'E_INVALID_AUTH_UID') {
        return 'unable to find user using email address'
      }
    
      if (error.code === 'E_INVALID_AUTH_PASSWORD') {
        return 'password mis-match'
      }
    }

  }

  public async get ({auth}: HttpContextContract) {
    try {
      await auth.authenticate()
      return 'ok'
    } catch (error) {
      return 'error'
    }
  }

  public async logout ({request}: HttpContextContract){
    const userId = request.input('userId')
    return Database.from('api_tokens').where('user_id',userId).delete()
  }

  public async telegram(){
  }
}
