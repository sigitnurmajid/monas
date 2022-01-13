import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import DataCollectionDevice from 'App/Models/DataCollectionDevice'
import Device from 'App/Models/Device'
import PressureVolumeDevice from 'App/Models/PressureVolumeDevice'
import StatusMasterDatum from 'App/Models/StatusMasterDatum'
import ThresholdDevice from 'App/Models/ThresholdDevice'
import users from 'App/Models/users'
import VolumeRateDevice from 'App/Models/VolumeRateDevice'
import Node from 'App/Services/Node'
import { query } from './RawQuery/PressureVolumeRaw'
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
    dataCollection.battery_voltage = request.input('data.battery_voltage')
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

        if (threshold) {
          if (data.status === '-' && (data.pressure_value < threshold.hospital_low_threshold || data.pressure_value > threshold.hospital_high_threshold)) {
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

  public async show({ auth, response, request }: HttpContextContract) {

    try {
      const user = await users.findOrFail(auth.user?.id)
      await user.load('organization')
      await user.load('userRole')
      await user.load('sites')

      async function data() {
        if (user.userRole.role === 'superadmin') {
          const organization_id = request.qs().organization_id
          if (!organization_id) throw new Error('Insert organization_id for superadmin role')

          const deviceByOrganization = await Device.query().where('organization_id', organization_id)
          const devicesEntity = deviceByOrganization.map(x => `\'${x.device_code}\'`).join(',')
          return await Database.rawQuery(query(devicesEntity))

        } else if (user.userRole.role === 'admin') {
          const organization = user.organization
          const deviceByOrganization = await Device.query().where('organization_id', organization.id)
          const devicesEntity = deviceByOrganization.map(x => `\'${x.device_code}\'`).join(',')
          return await Database.rawQuery(query(devicesEntity))

        } else {
          const site = user.sites
          const deviceBySite = await Device.query().where('site_id', site[0].id)
          const devicesEntity = deviceBySite.map(x => `\'${x.device_code}\'`).join(',')
          return await Database.rawQuery(query(devicesEntity))
        }
      }
      const resultData = await data()

      return response.status(200).json({ code: 200, status: 'success', data: resultData.rows })
    } catch (error) {
      return response.status(500).json({ code: 500, status: 'error', message: error.message })
    }

  }

  public async edit({ }: HttpContextContract) {
  }

  public async update({ }: HttpContextContract) {
  }

  public async destroy({ }: HttpContextContract) {
  }

  public async details({ request, response }: HttpContextContract) {
    try {
      const parameter = request.qs()
      const deviceCode = request.param('device_code')

      const dataPressureVolume = await PressureVolumeDevice
        .query()
        .select('pressure_value', 'volume_value', 'time_device')
        .where('device_code', '=', deviceCode)
        .andWhere('time_device', '>', parameter.start_date)
        .andWhere('time_device', '<', parameter.end_date)

      const dataVolumeRate = await VolumeRateDevice
        .query()
        .select('volume_rate_value', 'time_device')
        .where('device_code', '=', deviceCode)
        .andWhere('time_device', '>',parameter.start_date)
        .andWhere('time_device', '<',parameter.end_date)

      return response.status(200).json({
        code: 200, status: 'success', data:
        {
          pressure_volume_value: dataPressureVolume,
          volume_rate_value: dataVolumeRate
        }
      })

    } catch (error) {
      return response.status(500).json({ code: 500, status: 'error', message: error.message })
    }

  }
}
