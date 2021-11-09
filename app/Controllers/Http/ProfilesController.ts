import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Profile from 'App/Models/Profile'
import Users from 'App/Models/Users'

export default class ProfilesController {
  public async index({ auth, response }: HttpContextContract) {
    try {
      const user = await Users.find(auth.user?.id)

      await user?.load('profile')

      return response.status(200).json({ code: 200, status: 'success', data: user })
    } catch (error) {
      return response.status(500).json({ code: 500, status: 'error', message: error.message })
    }
  }

  public async create({ }: HttpContextContract) {
  }

  public async store({ }: HttpContextContract) {
  }

  public async show({ }: HttpContextContract) {
  }

  public async edit({ }: HttpContextContract) {
  }

  public async update({request, response, auth}: HttpContextContract) {
    const input = request.only(['avatar_url','theme'])

    try {
      const profile = await Profile.findBy('user_id', auth.user?.id)
      profile?.merge(input)
      await profile?.save()

      return response.status(200).json({ code: 200, status: 'success', data: profile })
    } catch (error) {
      return response.status(500).json({ code: 500, status: 'error', message: error.message })
    }
  }

  public async destroy({ }: HttpContextContract) {
  }
}
