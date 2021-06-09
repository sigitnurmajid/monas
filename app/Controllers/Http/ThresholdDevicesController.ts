import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Device from 'App/Models/Device'
import ThresholdDevice from 'App/Models/ThresholdDevice'
import Node from 'App/Services/Node'

export default class ThresholdDevicesController {
  public async index({ response }: HttpContextContract) {
    const data = await Database
      .from('threshold_devices')
      .join('devices', 'devices.device_code', '=', 'threshold_devices.device_code')
      .select('threshold_devices.*')
      .select('devices.device_name')
      .orderBy('created_at')
      .catch(() => { return response.status(400).send({ error: true, message: 'Error while querying' }) })
    return data
  }

  public async create({ }: HttpContextContract) {
  }

  public async store({ }: HttpContextContract) {
  }

  public async show({ }: HttpContextContract) {
    /*

    THIS CODE NOT USE FOR A WHILE

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
        return response.status(400)
      }
    } catch (error) {
      return response.status(400)
    }


    */
  }

  public async edit({ }: HttpContextContract) {
  }

  public async update({ request, params, response }: HttpContextContract) {
    const data = await ThresholdDevice.find(params.id);
    if (data) {
      // data.up_limit = request.input('device_code')
      data.up_limit = request.input('up_limit')
      data.low_limit = request.input('low_limit')

      const setTankProperties = {
        nodeId: data.device_code,
        up_limit: data.up_limit,
        low_limit: data.low_limit
      }

      const device = await Device.findBy('device_code', data.device_code)

      if (device) {
        await Node.setTankProperties(setTankProperties)
          .then(async () => {
            await device.related('threshold_device').save(data).catch(() => {
              return response.status(400).send({ error: true, message: 'Failed save data threshold' })
            })
            return response.status(400).send({ error: false, message: 'Operation success' })
          })
          .catch((e) => {
            if (e.message == 'NODE_NOT_RESPOND') {
              return response.status(400).send({ error: true, message: 'Device did not respond' })
            }
          })
      } else {
        return response.status(400).send({ error: true, message: 'Relation not ok' })
      }
    } else {
      return response.status(400).send({ error: true, message: 'Id cannot found' })
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    const device = await ThresholdDevice.query().where('id', params.id).delete()

    if (device) {
      return response.status(200).send({ error: false, message: 'Data has been deleted' })
    } else {
      return response.status(400).send({ error: true, message: 'Error while deleting data' })
    }
  }
}
