import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Device from 'App/Models/Device'
import PressureVolumeDevice from 'App/Models/PressureVolumeDevice'
import StatusMasterDatum from 'App/Models/StatusMasterDatum'
import Node from 'App/Services/Node'

export default class PressureVolumeDevicesController {
  public async index({ }: HttpContextContract) {
  }

  public async create({ request, response }: HttpContextContract) {
    const data = new PressureVolumeDevice
    const node = new Node

    data.device_code = request.input('device_code')
    data.pressure_value = request.input('data.pressure_value')
    data.volume_value = request.input('data.volume_value')
    data.stability_value = request.input('stability_value')
    data.time_device = request.input('time_device')
    data.status = request.input('data.status')

    const status = await StatusMasterDatum.all()
    const checkStatus = (statusParam: string) => status.some(({status})=> status == statusParam)
     
    if(checkStatus(data.status) || data.status === '-'){
      const device = await Device.findBy('device_code', data.device_code)
      if (device) {
        node.sendAlarm(data)
        await device.related('pressure_volume_device').save(data)

        return response.status(200).send({ error: false, message: 'Data saved to database' })
      } else {
        return response.status(400).send({ error: true, message: 'Node Id did not registered' })
      }
    } else {
      return response.status(400).send({ error: true, message: 'Status parameter error' })
    }
  }

  public async store({ }: HttpContextContract) {
  }

  public async show({ params, response }: HttpContextContract) {
    const device = await PressureVolumeDevice.query().limit(params.id).orderBy('created_at', 'desc')
      .catch(() => {
        return response.status(400).send({ error: true, message: 'Error while querying' })
      })
    return device
  }

  public async edit({ }: HttpContextContract) {
  }

  public async update({ }: HttpContextContract) {
  }

  public async destroy({ }: HttpContextContract) {
  }
}
