import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Device from 'App/Models/Device'
import VolumeRateDevice from 'App/Models/VolumeRateDevice'

export default class VolumeRateDevicesController {
  public async index({ }: HttpContextContract) {
  }

  public async create({ request, response }: HttpContextContract) {
    const data = new VolumeRateDevice

    data.device_code = request.input('device_code')
    data.volume_rate_value = request.input('data.volume_rate_value')
    data.time_device = request.input('time_device')
    data.tank_code = request.input('tank_code')

    const device = await Device.findBy('device_code', data.device_code)

    if (device) {
      await device.related('volume_rate_device').save(data)
      return response.status(200).send('Data Saved')
    } else {
      return response.status(400)
    }
  }

  public async store({ }: HttpContextContract) {
  }

  public async show({ params }: HttpContextContract) {
    const data = await VolumeRateDevice.query().limit(params.id).orderBy('created_at', 'desc')
    return data
  }

  public async edit({ }: HttpContextContract) {
  }

  public async update({ }: HttpContextContract) {
  }

  public async destroy({ }: HttpContextContract) {
  }
}
