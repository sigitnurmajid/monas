import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Device from 'App/Models/Device'
import DevicesLocation from 'App/Models/DevicesLocation'

export default class DevicesLocationsController {
  public async index({ }: HttpContextContract) {
  }

  public async create({ request , response}: HttpContextContract) {
    const location = new DevicesLocation

    location.device_code = request.input('device_code')
    location.gps_status = request.input('data.gps_status')
    location.latitude = request.input('data.latitude')
    location.longitude = request.input('data.longitude')
    location.time_device = request.input('time_device')

    const device = await Device.findBy('device_code', location.device_code)

    if (device) {
      await device.related('device_location').save(location)
      return response.status(200).send({ error: false, message: 'Saved to database' })
    } else {
      return response.status(400).send({ error: true, message: 'Node Id did not registered' })
    }
  }

  public async store({ }: HttpContextContract) {
  }

  public async show({ }: HttpContextContract) {
  }

  public async edit({ }: HttpContextContract) {
  }

  public async update({ }: HttpContextContract) {
  }

  public async destroy({ }: HttpContextContract) {
  }
}
