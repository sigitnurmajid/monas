import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import StatusMasterDatum from 'App/Models/StatusMasterDatum'

export default class StatusMasterDataController {
  public async index({ response }: HttpContextContract) {
    const status = await StatusMasterDatum.query()
      .catch(() => {
        return response.status(400).send({ error: true, message: 'Error while querying' })
      })
    return status
  }

  public async create({ }: HttpContextContract) {

  }

  public async store({ request, response }: HttpContextContract) {
    const status = new StatusMasterDatum

    status.status = request.input('status')

    await status.save()
      .catch((e) => {
        return response.status(400).send({ error: true, message: `Failed while saving to database with error : ${e.message}` })
      })
    
      return status
  } 

  public async show({ }: HttpContextContract) {
  }

  public async edit({ }: HttpContextContract) {
  }

  public async update({ }: HttpContextContract) {
  }

  public async destroy({ params, response }: HttpContextContract) {
    const status = await StatusMasterDatum.query().where('id', params.id).delete()

    if (status) {
      return response.status(200).send({ error: false, message: 'Data has been deleted' })
    } else {
      return response.status(400).send({ error: true, message: 'Error while deleting data' })
    }
  }
}
