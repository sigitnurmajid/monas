import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Device from 'App/Models/Device'
import Filling from 'App/Models/Filling'
import Node from 'App/Services/Node'
import PressureVolumeDevice from 'App/Models/PressureVolumeDevice'
import VolumeUsagesController from './VolumeUsagesController'

export default class FillingsController {
  public async index({ }: HttpContextContract) {
  }

  public async create({ request, response }: HttpContextContract) {
    const data = new Filling
    const node = new Node
    const volumeUsage = new VolumeUsagesController
    const dataRealtime = new PressureVolumeDevice

    data.device_code = request.input('device_code')
    data.pressure_value = request.input('data.pressure_value')
    data.volume_value = request.input('data.volume_value')
    data.weight_value = request.input('data.weight_value')
    data.stability_value = request.input('data.stability_value')
    data.filling_state = request.input('data.filling_state')
    data.time_device = request.input('time_device')

    dataRealtime.device_code = request.input('device_code')
    dataRealtime.pressure_value = request.input('data.pressure_value')
    dataRealtime.volume_value = request.input('data.volume_value')
    dataRealtime.status = 'Filling'
    dataRealtime.stability_value = request.input('data.stability_value')
    dataRealtime.time_device = request.input('time_device')

    const device = await Device.findBy('device_code', data.device_code)

    if (device) {
      if (data.filling_state !== 'ERROR') node.sendAlarmFillingTelegram(data)
      try {
        if(data.filling_state === 'STARTED') await volumeUsage.calculateVolumeUsage({volume:data.volume_value, deviceCode: data.device_code}, 'FILLING')
        await device.related('filling').save(data)
        await device.related('pressure_volume_device').save(dataRealtime)
      } catch (error) {
        return response.status(400).send({ error: true, message: `Error while saving data with error ${error.message}` })
      }
      return response.status(200).send({ error: false, message: 'Data saved to database' })
    } else {
      return response.status(400).send({ error: true, message: 'Node Id did not registered' })
    }
  }

  public async store({ }: HttpContextContract) {
  }

  public async show({ params, response }: HttpContextContract) {
    const data = await Filling.query().limit(params.id).orderBy('created_at', 'desc')
      .catch(() => {
        return response.status(400).send({ error: true, message: 'Error while querying' })
      })
    return data
  }

  public async edit({ }: HttpContextContract) {
  }

  public async update({ }: HttpContextContract) {
  }

  public async destroy({ }: HttpContextContract) {
  }
}
