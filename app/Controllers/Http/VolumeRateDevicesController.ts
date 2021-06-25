import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Device from 'App/Models/Device'
import VolumeRateDevice from 'App/Models/VolumeRateDevice'
import { DateTime } from 'luxon'

export default class VolumeRateDevicesController {
  public async index({ }: HttpContextContract) {
  }

  public async create({ }: HttpContextContract) {

  }

  public async store({ }: HttpContextContract) {
  }

  public async show({ params , response}: HttpContextContract) {
    const volume = await VolumeRateDevice.query().limit(params.id).orderBy('created_at', 'desc')
    .catch(() => {
      return response.status(400).send({ error: true, message: 'Error while querying' })
    })
  return volume

  }

  public async edit({ }: HttpContextContract) {
  }

  public async update({ }: HttpContextContract) {
  }

  public async destroy({ }: HttpContextContract) {
  }

  public async volumeRateCalculate(dataNow :{volume : number, timeDevice : DateTime, deviceCode : string}) {
    const dataLast = await Database
      .from('pressure_volume_devices')
      .orderBy('time_device', 'desc')
      .limit(1)
      .select('time_device', 'volume_value')

    const unixTimeNow = Math.round((new Date(dataNow.timeDevice.toString()).getTime())/1000)
    const unixTimeLast = Math.round((new Date(dataLast[0].time_device).getTime())/1000)

    const volumeRate = (-1 * (dataNow.volume - dataLast[0].volume_value) * 3600 / (unixTimeNow -unixTimeLast))
    
    const volume = new VolumeRateDevice
    
    const device = await Device.findBy('device_code', dataNow.deviceCode)

    if (device){
      volume.volume_rate_value = volumeRate
      volume.device_code = dataNow.deviceCode
      volume.tank_code = device.tank_code
      volume.time_device = dataNow.timeDevice
      await device?.related('volume_rate_device').save(volume)
    }
  }
}
