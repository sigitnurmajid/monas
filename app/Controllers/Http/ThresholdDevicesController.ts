import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Device from 'App/Models/Device'
import ThresholdDevice from 'App/Models/ThresholdDevice'
import Node from 'App/Services/Node'

export default class ThresholdDevicesController {
  public async index({ }: HttpContextContract) {

  }

  public async create({ }: HttpContextContract) {
  }

  public async store({ }: HttpContextContract) {
  }

  public async show({ request, response }: HttpContextContract) {
    try {
      const deviceCode = request.param('id')
      const data = await ThresholdDevice.findByOrFail('device_code', deviceCode)

      return response.status(200).json({ code: 200, status: 'success', data: data })
    } catch (error) {
      return response.status(500).json({ code: 500, status: 'error', message: error.message })
    }
  }

  public async edit({ }: HttpContextContract) {
  }

  public async update({ request , response }: HttpContextContract) {

    const deviceCode = request.param('id')
    const node = new Node
    const data = await ThresholdDevice.findByOrFail('device_code', deviceCode)

    if (data) {
      // data.up_limit = request.input('device_code')
      data.high_threshold = request.input('up_limit')
      data.low_threshold = request.input('low_limit')
      data.hospital_high_threshold = request.input('up_limit_hospital')
      data.hospital_low_threshold = request.input('low_limit_hospital')

      const setTankProperties = {
        nodeId: data.device_code,
        up_limit: data.high_threshold,
        low_limit: data.low_threshold
      }

      try {
        const device = await Device.findBy('device_code', data.device_code)
        if(!device) return response.status(500).send({ error: true, message: 'Id cannot found' })

        const nodeResponse = await node.setTankProperties(setTankProperties)
        if (nodeResponse.data.response == '0') return response.status(500).send({ error: true, message: 'Device did not respond' })

        await device.related('threshold_device').save(data)
        return response.status(200).send({ error: false, message: 'Operation success' })
      } catch (error) {
        return response.status(500).json({ code: 500, status: 'error', message: error })
      }
    }
  }

  public async destroy({ }: HttpContextContract) {
    /*
    const device = await ThresholdDevice.query().where('id', params.id).delete()

    if (device) {
      return response.status(200).send({ error: false, message: 'Data has been deleted' })
    } else {
      return response.status(400).send({ error: true, message: 'Error while deleting data' })
    }
    */
  }
}
