import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Device from 'App/Models/Device'
import PressureVolumeDevice from 'App/Models/PressureVolumeDevice'

export default class PressureVolumeDevicesController {
  public async index({ }: HttpContextContract) {
  }

  public async create({ request , response}: HttpContextContract) {
    const data = new PressureVolumeDevice

    data.device_code = request.input('device_code')
    data.pressure_value = request.input('pressure_value')
    data.volume_value = request.input('volume_value')
    data.time_device =  request.input('time_device')
    data.status = request.input('status')

    if ((request.input('status') == 'NORMAL') || (request.input('status') == 'LOWER') || (request.input('status') == 'UPPER')) {
      
      const device = await Device.findBy('device_code', data.device_code)

      if(device){
        await device.related('pressure_volume_device').save(data)
        return response.status(200).send('Data Saved')
      } else {
        return response.status(400)
      }
    }
  }

  public async store({ }: HttpContextContract) {
  }

  public async show({ params }: HttpContextContract) {
    const device = await PressureVolumeDevice.query().limit(params.id).orderBy('created_at', 'desc')
    return device
  }

  public async edit({ }: HttpContextContract) {
  }

  public async update({ }: HttpContextContract) {
  }

  public async destroy({ }: HttpContextContract) {
  }
}
