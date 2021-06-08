import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Device from 'App/Models/Device'
import ThresholdDevice from 'App/Models/ThresholdDevice'
import Node from 'App/Services/Node'

export default class ThresholdDevicesController {
  public async index({ }: HttpContextContract) {
    const data = await Database
      .from('threshold_devices')
      .join('devices', 'devices.device_code', '=', 'threshold_devices.device_code')
      .select('threshold_devices.*')
      .select('devices.device_name')
      .orderBy('created_at')

    return data
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
      const device = await Database
        .from('threshold_devices')
        .join('devices', 'devices.device_code', '=', 'threshold_devices.device_code')
        .select('threshold_devices.*')
        .select('devices.device_name')
        .where('threshold_devices.id', params.id)
        .orderBy('created_at')
      if (device) {
        return device[0]
      } else {
        return response.status(401)
      }
    } catch (error) {
      return response.status(400)
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

      
    const setTankProperties = {
      nodeId : data.device_code,
      up_limit : data.up_limit,
      low_limit : data.low_limit
    }

      const device = await Device.findBy('device_code', data.device_code)
      
      if (device) {
        await device.related('threshold_device').save(data)
        await Node.setTankProperties(setTankProperties)
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
