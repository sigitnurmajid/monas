import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';
import Device from 'App/Models/Device';
import VolumeUsage from 'App/Models/VolumeUsage'
import Logger from '@ioc:Adonis/Core/Logger'


export default class VolumeUsagesController {
  public async index({ }: HttpContextContract) {
  }

  public async create({ }: HttpContextContract) {
  }

  public async store({ }: HttpContextContract) {
  }

  public async show({ params, response }: HttpContextContract) {
    const volume = await VolumeUsage.query().limit(params.id).orderBy('created_at', 'desc')
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

  public async calculateVolumeUsage(dataNow: { volume: number, deviceCode: string, }, fromWhere: string) {

    let volumeLast: number = 0

    if (fromWhere === 'PRESSUREVOLUME') {
      const fillingFinish = await Database
        .from('fillings')
        .where('filling_state', 'FINISHED')
        .andWhere('device_code','=',dataNow.deviceCode)
        .orderBy('created_at', 'desc')
        .limit(1)
        .select('created_at', 'volume_value')

      const volumeRealtimeCase1 = await Database
        .from('pressure_volume_devices')
        .where('status', '=', '-')
        .andWhere('device_code','=',dataNow.deviceCode)
        .orderBy('created_at', 'desc')
        .limit(1)
        .select('created_at', 'volume_value')

      let unixTimeFilling: number = 0
      let unixTimeVolumeRealtime: number = 0
      if (fillingFinish.length !== 0) unixTimeFilling = Math.round(new Date(fillingFinish[0].created_at).getTime())
      if (volumeRealtimeCase1.length !== 0) unixTimeVolumeRealtime = Math.round(new Date(volumeRealtimeCase1[0].created_at).getTime())

      if (unixTimeFilling > unixTimeVolumeRealtime) {
        volumeLast = parseFloat(fillingFinish[0].volume_value)
      } else {
        volumeLast = parseFloat(volumeRealtimeCase1[0].volume_value)
      }
    } else if (fromWhere === 'FILLING') {
      const volumeRealtimeCase2 = await Database
        .from('pressure_volume_devices')
        .where('status', '=', '-')
        .andWhere('device_code','=',dataNow.deviceCode)
        .orderBy('created_at', 'desc')
        .limit(1)
        .select('volume_value')

      volumeLast = parseFloat(volumeRealtimeCase2[0].volume_value)
    }
    
    const totalVolume = volumeLast - dataNow.volume
    if (totalVolume > 0) {
      const volume = new VolumeUsage

      const device = await Device.findBy('device_code', dataNow.deviceCode)

      if (device) {
        volume.volume_usage_value = totalVolume
        volume.tank_code = device.tank_code
        volume.device_code = dataNow.deviceCode

        await device.related('volume_usage').save(volume)
      }
    } else {
      Logger.error(`Volume Usage lower than 0 : ${totalVolume}, data can't be save to database`)
    }
  }
}
