import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Device from 'App/Models/Device';
import ThresholdDevice from 'App/Models/ThresholdDevice'
import Node from 'App/Services/Node'

export default class DevicesController {
  public async index({ response }: HttpContextContract) {
    const device = await Device.query()
      .catch(() => {
        return response.status(400).send({ error: true, message: 'Error while querying' })
      })
    return device
  }

  public async create({ }: HttpContextContract) {
  }

  public async store({ request, response }: HttpContextContract) {
    const device = new Device
    const node = new Node

    device.device_code = request.input('device_code')
    device.device_name = request.input('device_name')
    device.device_type = request.input('device_type')
    device.location = request.input('location')
    device.tank_code = request.input('tank_code')
    device.tank_type = request.input('tank_type')
    device.high_limit = request.input('high_limit')
    device.low_limit = request.input('low_limit')

    const threshold = new ThresholdDevice

    threshold.device_code = request.input('device_code')
    threshold.high_threshold = 0
    threshold.low_threshold = 0
    threshold.hospital_high_threshold = 0
    threshold.hospital_low_threshold = 0

    const setTankProperties = {
      nodeId: request.input('device_code'),
      up_limit: 0,
      low_limit: 0
    }

    await device.save().then(async () => {
      await threshold.save()
        .then(async () => {
          await node.setTankProperties(setTankProperties)
            .then((respond: any) => {
              if (respond.response == '0') return response.status(400).send({ error: true, message: 'Device respond with bad respond' })
            })
            .catch((e) => {
              if (e.message == 'NODE_NOT_RESPOND') {
                return response.status(400).send({ error: true, message: 'Device did not respond' })
              }
            })
        })
        .catch(() => {
          return response.status(400).send({ error: true, message: 'Failed to save threshold, try another option with API call' })
        })
    })
      .catch(() => {
        return response.status(400).send({ error: true, message: 'Failed to register' })
      })

    return device

  }

  public async show({ params, response }: HttpContextContract) {
    const device = await Device.find(params.id)
      .catch(() => {
        return response.status(400).send({ error: true, message: 'Error while querying' })
      })
    if (device) {
      return device
    } else {
      return response.status(400).send({ error: true, message: 'Id did not match' })
    }
  }

  public async edit({ }: HttpContextContract) {
  }

  public async update({ params, request, response }: HttpContextContract) {
    const device = await Device.find(params.id)
      .catch(() => {
        return response.status(400).send({ error: true, message: 'Error while querying' })
      })
    if (device) {
      device.device_code = request.input('device_code')
      device.device_name = request.input('device_name')
      device.device_type = request.input('device_type')
      device.location = request.input('location')
      device.tank_code = request.input('tank_code')
      device.tank_type = request.input('tank_type')
      device.high_limit = request.input('high_limit')
      device.low_limit = request.input('low_limit')

      if (await device.save()) {
        return device
      }
      return response.status(400).send({ error: true, message: 'Failed to update' })
    } else {
      return response.status(400).send({ error: true, message: 'Id did not match' })
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    const device = await Device.query().where('id', params.id).delete()

    if (device) {
      return response.status(200).send({ error: false, message: 'Data has been deleted' })
    } else {
      return response.status(400).send({ error: true, message: 'Error while deleting data' })
    }
  }
}
