import Application from '@ioc:Adonis/Core/Application'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Profile from 'App/Models/Profile'
import Users from 'App/Models/Users'
import crypto from 'crypto'

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

  public async update({ request, response, auth }: HttpContextContract) {

    try {
      const profile = await Profile.findBy('user_id', auth.user?.id)
      if (!profile) return

      const profile_image = request.file('profile_image', {
        extnames: ['jpg','png'],
        size: '2mb'
      })
      const theme = request.input('theme')

      if (profile_image) {
        if (!profile_image.isValid) return response.status(400).json({ code: 400, status: 'error', message: profile_image.errors })

        await profile_image.move(Application.tmpPath('uploads'), {
          name: `${profile.id}-${crypto.randomBytes(8).toString('hex')}.png`,
          overwrite: true
        })
        profile.avatar_url = profile_image.filePath
      }

      if (theme) {
        profile.theme = request.input('theme')
      }

      await profile?.save()

      return response.status(200).json({ code: 200, status: 'success', data: profile })
    } catch (error) {
      return response.status(500).json({ code: 500, status: 'error', message: error.message })
    }
  }

  public async destroy({ }: HttpContextContract) {
  }
}
