import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import DataCollectionDevice from 'App/Models/DataCollectionDevice'
import Device from 'App/Models/Device'
import PressureVolumeDevice from 'App/Models/PressureVolumeDevice'
import StatusMasterDatum from 'App/Models/StatusMasterDatum'
import ThresholdDevice from 'App/Models/ThresholdDevice'
import Node from 'App/Services/Node'
import VolumeRateDevicesController from './VolumeRateDevicesController'
import VolumeUsagesController from './VolumeUsagesController'

export default class PressureVolumeDevicesController {
  public async index({ }: HttpContextContract) {
  }

  public async create({ request, response }: HttpContextContract) {
    const data = new PressureVolumeDevice
    const node = new Node
    const volume = new VolumeRateDevicesController
    const volumeUsage = new VolumeUsagesController
    const dataCollection = new DataCollectionDevice

    data.device_code = request.input('device_code')
    data.pressure_value = request.input('data.pressure_value')
    data.volume_value = request.input('data.volume_value')
    data.stability_value = request.input('data.stability_value')
    data.time_device = request.input('time_device')
    data.status = request.input('data.status')

    dataCollection.device_code = request.input('device_code')
    dataCollection.temperature = request.input('data.temperature')
    dataCollection.solar_exposure = request.input('data.solar_exposure')
    dataCollection.humidity = request.input('data.humidity')
    dataCollection.battery_level = request.input('data.battery_level')
    dataCollection.status = request.input('data.device_status')
    dataCollection.firmware_version = request.input('data.firmware_version')
    dataCollection.device_type = request.input('data.device_type')
    dataCollection.memory_usage = request.input('data.memory_usage')
    dataCollection.battery_current = request.input('data.battery_current')
    dataCollection.battery_current = request.input('data.battery_voltage')
    dataCollection.solar_current = request.input('data.solar_current')
    dataCollection.solar_voltage = request.input('data.solar_voltage')
    dataCollection.time_device = request.input('time_device')


    const status = await StatusMasterDatum.all()
    const checkStatus = (statusParam: string) => status.some(({ status }) => status == statusParam)

    if (checkStatus(data.status) || data.status === '-') {
      const device = await Device.findBy('device_code', data.device_code)
      if (device) {
        if (data.status !== '-') node.sendAlarmPressureTelegram(data, 'SUPPLIER')
        const threshold = await ThresholdDevice.findBy('device_code', data.device_code)

        if(threshold){
          if(data.status === '-' && (data.pressure_value < threshold.hospital_low_threshold || data.pressure_value > threshold.hospital_high_threshold)){
            node.sendAlarmPressureTelegram(data, 'CLIENT')
          }
        }

        try {
          if (data.status === '-') {
            await volumeUsage.calculateVolumeUsage({ volume: data.volume_value, deviceCode: data.device_code }, 'PRESSUREVOLUME')
            await volume.volumeRateCalculate({ volume: data.volume_value, deviceCode: data.device_code, timeDevice: data.time_device })
          }

          await device.related('pressure_volume_device').save(data)
          await device.related('data_collection_device').save(dataCollection)
        } catch (error) {
          console.log(error)
          return response.status(400).send({ error: true, message: `Error while saving data with error ${error.message}` })
        }
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
