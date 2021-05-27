import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Device from 'App/Models/Device'
import ThresholdDevice from 'App/Models/ThresholdDevice'

export default class ThresholdDevicesController {
  public async index({ }: HttpContextContract) {
    const device = await ThresholdDevice.query()
    return device
  }

  public async create({ }: HttpContextContract) {
  }

  public async store({ request }: HttpContextContract) {
    const data = new ThresholdDevice()

    data.device_code = request.input('device_code')
    data.up_limit = request.input('up_limit')
    data.low_limit = request.input('low_limit')

    const device = await Device.findBy('device_code', data.device_code)
    const count = await Database.from('threshold_devices').count('* as total').where('device_code', data.device_code)

    if (device && (count[0].total == 0)) {
      await device.related('threshold_device').save(data)
      return 'Data Saved'
    } else {
      return 'error'
    }
  }

  public async show({ response, params }: HttpContextContract) {
    try {
      const device = await ThresholdDevice.find(params.id)
      if (device) {
        return device
      } else {
        return response.status(401)
      }
    } catch (error) {
      console.log(error)
    }
  }

  public async edit({ }: HttpContextContract) {
  }

  public async update({ request, params }: HttpContextContract) {
    const data = await ThresholdDevice.find(params.id);
    if (data) {
      data.device_code = request.input('device_code')
      data.up_limit = request.input('up_limit')
      data.low_limit = request.input('low_limit')

      const device = await Device.findBy('device_code', data.device_code)

      if (device) {
        await device.related('threshold_device').save(data)
        return 'Data Updated'
      } else {
        return 'error'
      }
    }
  }

  public async destroy({ params }: HttpContextContract) {
    const device = await ThresholdDevice.query().where('id', params.id).delete()

    return device
  }
}
