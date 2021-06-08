import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Device from 'App/Models/Device';
import ThresholdDevice from 'App/Models/ThresholdDevice'
import Node from 'App/Services/Node'

export default class DevicesController {
  public async index({ }: HttpContextContract) {
    const device = await Device.query()
    return device
  }

  public async create({ }: HttpContextContract) {
  }

  public async store({ request, response }: HttpContextContract) {
    const device = new Device()

    device.device_code = request.input('device_code')
    device.device_name = request.input('device_name')
    device.device_type = request.input('device_type')
    device.location = request.input('location')
    device.coordinate = request.input('coordinate')
    device.tank_code = request.input('tank_code')
    device.tank_type = request.input('tank_type')

    const threshold = new ThresholdDevice

    threshold.device_code = request.input('device_code')
    threshold.up_limit = 0
    threshold.low_limit = 0

    const setTankProperties = {
      nodeId : request.input('device_code'),
      up_limit : 0,
      low_limit : 0
    }

    await device.save().then(async () => { await threshold.save().then(async () => { await Node.setTankProperties(setTankProperties) }) })
      .catch(() => { return response.status(400).send('Failed to register') })

    return device

  }

  public async show({ params, response }: HttpContextContract) {
    try {
      const device = await Device.find(params.id)
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

  public async update({ params, request, response }: HttpContextContract) {
    const device = await Device.find(params.id);
    if (device) {
      device.device_code = request.input('device_code')
      device.device_name = request.input('device_name')
      device.device_type = request.input('device_type')
      device.location = request.input('location')
      device.coordinate = request.input('coordinate')
      device.tank_code = request.input('tank_code')
      device.tank_type = request.input('tank_type')

      if (await device.save()) {
        return device
      }
      return response.status(422)
    }
    return response.status(401)
  }

  public async destroy({ params }: HttpContextContract) {
    const device = await Device.query().where('id', params.id).delete()

    return device
  }
}
