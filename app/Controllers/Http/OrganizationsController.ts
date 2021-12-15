import Application from '@ioc:Adonis/Core/Application'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Organization from 'App/Models/Organization'
import crypto from 'crypto'
import Drive from '@ioc:Adonis/Core/Drive'

export default class OrganizationsController {
  public async index({ response, request }: HttpContextContract) {
    try {
      const input = request.qs()
      const organizations = await Organization.query().withCount('sites').withCount('users').orderBy('id','asc').paginate(input.page,10)

      if (organizations.length === 0) throw new Error('Sites not found')
      return response.status(200).json({ code: 200, status: 'success', data: organizations })
    } catch (error) {
      return response.status(500).json({ code: 500, status: 'error', message: error.message })
    }
  }

  public async create({ }: HttpContextContract) { }

  public async store({ response, request }: HttpContextContract) {
    const validationSchema = schema.create({
      name: schema.string(),
      email: schema.string({ trim: true }, [
        rules.email(),
        rules.unique({ table: 'users', column: 'email' }),
      ]),
      address: schema.string(),
      profile_image: schema.file({
        size: '2mb',
        extnames: ['jpg', 'png'],
      }),
    })

    try {
      const organizationDetails = await request.validate({
        schema: validationSchema
      })

      const organization = new Organization

      const fileName = `${crypto.randomBytes(8).toString('hex')}.png`
      await organizationDetails.profile_image.move(Application.tmpPath('uploads'), {
        name: fileName,
        overwrite: true
      })

      const url = await Drive.getUrl(`${fileName}`)

      organization.avatar_url = url
      organization.name = organizationDetails.name
      organization.email = organizationDetails.email
      organization.address = organizationDetails.address

      await organization.save()

      return response.status(200).json({ code: 200, status: 'success', data: organization })
    } catch (error) {
      if (error.code === 'E_VALIDATION_FAILURE') return response.status(422).json({ code: 422, status: 'Unprocessable Entity', message: error.messages })

      return response.status(500).json({ code: 500, status: 'error', message: error.message })
    }
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      const organization = await Organization.findOrFail(params.id)
      await organization.load('sites')
      await organization.load('device')

      return response.status(200).json({ code: 200, status: 'success', data: organization })

    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') error.message = 'Organization not found'
      return response.status(500).json({ code: 500, status: 'error', message: error.message })
    }
  }

  public async edit({ }: HttpContextContract) { }

  public async update({ request, params, response }: HttpContextContract) {
    try {
      const input = request.only(['name', 'email', 'address'])
      const organization = await Organization.findOrFail(params.id)

      const profile_image = request.file('profile_image', {
        extnames: ['jpg', 'png'],
        size: '2mb'
      })

      if (profile_image) {
        if (!profile_image.isValid) return response.status(400).json({ code: 400, status: 'error', message: profile_image.errors })

        const fileName = `${crypto.randomBytes(8).toString('hex')}.png`
        await profile_image.move(Application.tmpPath('uploads'), {
          name: fileName,
          overwrite: true
        })

        const url = await Drive.getUrl(`${fileName}`)

        input['avatar_url'] = url
      }

      organization.merge(input)

      await organization.save()

      return response.status(200).json({ code: 200, status: 'success', data: organization })

    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') error.message = 'Organization not found'
      return response.status(500).json({ code: 500, status: 'error', message: error.message })
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    try {
      const organization = await Organization.findOrFail(params.id)

      await organization?.delete()
      return response.status(200).json({ code: 200, status: 'success' })
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') error.message = 'Organization not found'
      return response.status(500).json({ code: 500, status: 'error', message: error.message })
    }
  }
}
