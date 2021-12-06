import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Site from 'App/Models/Site'

export default class SitesController {
  public async index({ response, request }: HttpContextContract) {
    try {
      const input = request.qs()
      const sites = await Site.query().preload('organization').preload('device').where('organization_id', input.organization_id).paginate(input.page,10)

      if(sites.length === 0) throw new Error('Sites not found')

      return response.status(200).json({ code: 200, status: 'success', data: sites })
    } catch (error) {
      return response.status(500).json({ code: 500, status: 'error', message: error.message })
    }
  }

  public async store({ response, request }: HttpContextContract) {
    const validationSchema = schema.create({
      organization: schema.number(),
      name: schema.string(),
      address: schema.string(),
      coordinate: schema.string()
    })

    try {
      const siteDetails = await request.validate({
        schema: validationSchema
      })

      const site = new Site

      site.address = siteDetails.address
      site.coordinate = siteDetails.coordinate
      site.name = siteDetails.name
      site.organization_id = siteDetails.organization

      await site.save()

      return response.status(200).json({ code: 200, status: 'success', data: site })
    } catch (error) {
      if (error.code === 'E_VALIDATION_FAILURE') return response.status(422).json({ code: 422, status: 'Unprocessable Entity', message: error.messages })

      return response.status(500).json({ code: 500, status: 'error', message: error.message })
    }
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      const site = await Site.findOrFail(params.id)
      return response.status(200).json({ code: 200, status: 'success', data: site })
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') error.message = 'Site not found'
      return response.status(500).json({ code: 500, status: 'error', message: error.message })
    }
  }

  public async update({ request, params, response }: HttpContextContract) {
    try {
      const input = request.only(['address', 'coordinate', 'name'])
      const site = await Site.findOrFail(params.id)

      site.merge(input)

      await site.save()

      return response.status(200).json({ code: 200, status: 'success', data: site })

    } catch (error) {
      return response.status(500).json({ code: 500, status: 'error', message: error.message })
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    try {
      const site = await Site.findOrFail(params.id)
      await site?.delete()
      return response.status(200).json({ code: 200, status: 'success' })
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') error.message = 'Site not found'
      return response.status(500).json({ code: 500, status: 'error', message: error.message })
    }
  }

  public async test({ response }: HttpContextContract) {
    try {
      // const site = await Site.findOrFail(1)

      // const user = await users.find(1)

      // await user?.related('site').dissociate()

      return response.status(200).json({ code: 200, status: 'success' })
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') error.message = 'Site not found'
      return response.status(500).json({ code: 500, status: 'error', message: error.message })
    }
  }
}
