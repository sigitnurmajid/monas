import Mail from '@ioc:Adonis/Addons/Mail';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import TokenUserPassword from 'App/Models/TokenUserPassword';
import users from 'App/Models/Users'
import crypto from 'crypto'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class ForgotPasswordsController {
  public async index({ }: HttpContextContract) {
  }

  public async create({ }: HttpContextContract) {
  }

  public async store({ request, response }: HttpContextContract) {
    const email = request.input('email')


    try {
      await users.findByOrFail('email', email)

      const token = crypto.randomBytes(2).toString('hex')

      const tokenUser = new TokenUserPassword

      tokenUser.token = token
      tokenUser.email = email
      tokenUser.is_used = false
      tokenUser.created_at = new Date()

      const expired = new Date()
      expired.setMinutes(tokenUser.created_at.getMinutes() + 5)
      tokenUser.expired_at = expired

      await tokenUser.save()

      await Mail.send((message) => {
        message
          .from('service.intellisense@gmail.com')
          .to(email)
          .subject('Forgot Password Token')
          .text(token)
      })

      return response.status(200).json({ code: 200, status: 'success' })

    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') error.message = 'email not found'
      return response.status(500).json({ code: 500, status: 'error', message: error.message })
    }


  }

  public async show({ params, response }: HttpContextContract) {

    try {
      const token = await TokenUserPassword.findByOrFail('token', params.token)

      if (token.is_used === true) throw new Error('token has been used')

      if (token.expired_at < new Date) throw new Error('token has been expired')

      if (token.email !== params.email) throw new Error('email invalid')

      return response.status(200).json({ code: 200, status: 'success' })
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') error.message = 'token not found'
      return response.status(500).json({ code: 500, status: 'error', message: error.message })
    }
  }

  public async edit({ request, response }: HttpContextContract) {
    const validationSchema = schema.create({
      password: schema.string({ trim: true }, [
        rules.confirmed(),
      ]),
      token: schema.string({ trim: true }),
      email: schema.string({ trim: true }, [
        rules.email()
      ])
    })

    const userDetails = await request.validate({
      schema: validationSchema
    })
    const user = await users.findByOrFail('email', userDetails.email)
    const token = await TokenUserPassword.findByOrFail('token', userDetails.token)

    user.password = userDetails.password
    token.is_used = true

    try {
      await token.save()
      await user.save()
      return response.status(200).json({ code: 200, status: 'success' })

    } catch (error) {
      return response.status(500).json({ code: 500, status: 'error', message: error.message })
    }
  }

  public async update({ }: HttpContextContract) {

  }

  public async destroy({ }: HttpContextContract) {
  }
}
