import Database from '@ioc:Adonis/Lucid/Database'
import Telegram from '@ioc:Monas/Services/Telegram'
import Device from 'App/Models/Device'
import Filling from 'App/Models/Filling'
import PressureVolumeDevice from 'App/Models/PressureVolumeDevice'
import axios from 'axios'
import qs from 'querystring'
import Logger from '@ioc:Adonis/Core/Logger'



export default class Node {

  private maintenance: any

  public async setTankProperties(threshold: { nodeId: string, up_limit: number, low_limit: number }) {
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    }

    const data = qs.stringify({
      access_token: 'e41ab705fa55773e1737e61c28b8b35bc4e298db',
      args: `{"upperThresholdValue" : ${threshold.up_limit}, "lowerThresholdValue" : ${threshold.low_limit}}`
    })

    let respond: any

    await axios.post(`https://api.particle.io/v1/devices/${threshold.nodeId}/setTankProperties`, data, { headers: headers })
      .then((response) => { respond = response.statusText })
      .catch(() => { throw Error('NODE_NOT_RESPOND') })

    return respond
  }

  public async sendAlarmPressureTelegram(data: PressureVolumeDevice, forWho: string) {
    const device = await Device.findBy('device_code', data.device_code)

    if (device?.location !== undefined) {

      const threshold = await Database
        .from('threshold_devices')
        .where('device_code', '=', data.device_code)
        .select('*')

      const highThreshold = threshold[0].up_limit
      const lowThreshold = threshold[0].low_limit
      const highThresholdHospital = threshold[0].up_limit_hospital
      const lowThresholdHospital = threshold[0].low_limit_hospital

      const line1 = `\u{26A0} OXYGEN LEVEL ${data.status} \u{26A0}\n\n`
      const line2 = `\u{1F3E5} Location : ${device.location}\n\n`
      const line3 = `Current Level : ${data.pressure_value} InH2O\n\n`
      const line4 = `Current Volume : ${data.volume_value} m3\n\n`

      const userMaintenance = await Database
        .from('users_telegrams')
        .where('role', '=', 'maintenance')
        .select('*')

      this.maintenance = userMaintenance

      if (forWho === 'CLIENT') {
        const userClient = await Database
          .from('users_telegrams')
          .where('location', '=', device.location)
          .orWhere('role', '=', 'client')
          .select('*')

        const user = userMaintenance.concat(userClient)
        const line5 = `High Level Threshold : ${highThresholdHospital} InH2O\n\n`
        const line6 = `Low Level Threshold : ${lowThresholdHospital} InH2O`
        const message = line1 + line2 + line3 + line4 + line5 + line6

        user.forEach(async element => {
          await this.sendMessage(element.chat_id, message, `OXYGEN LEVEL ${data.status} for ${element.name} with Role ${element.role}`)
        })
      } else if (forWho === 'SUPPLIER') {
        const userSupplier = await Database
          .from('users_telegrams')
          .where('role', '=', 'supplier')
          .select('*')

        const user = userMaintenance.concat(userSupplier)
        const line5 = `High Level Threshold : ${highThreshold} InH2O\n\n`
        const line6 = `Low Level Threshold : ${lowThreshold} InH2O`
        const message = line1 + line2 + line3 + line4 + line5 + line6

        user.forEach(async element => {
          await this.sendMessage(element.chat_id, message, `OXYGEN LEVEL ${data.status} for ${element.name} with Role ${element.role}`)
        })
      }
    }
  }

  public async sendAlarmFillingTelegram(data: Filling) {
    const device = await Device.findBy('device_code', data.device_code)
    if (device?.location !== undefined) {
      const user = await Database
        .from('users_telegrams')
        .where('location', '=', device.location)
        .orWhere('role', '=', 'maintenance')
        .orWhere('role', '=', 'supplier')
        .select('chat_id', 'name')

      user.forEach(async element => {
        const line1 = `\u{26A0} FILLING ${data.filling_state} \u{26A0}\n\n`
        const line2 = `\u{1F3E5} Location : ${device.location}\n\n`
        const line3 = `Current Level : ${data.pressure_value} InH2O\n\n`
        const line4 = `Current Volume : ${data.volume_value} m3\n\n`
        const line5 = `Current Weight : ${data.weight_value} Kg`
        const message = line1 + line2 + line3 + line4 + line5
        await this.sendMessage(element.chat_id, message, `Filling ${data.filling_state} for ${element.name} with chat id ${element.chat_id}`)
      })
    }
  }

  private async sendMessage(chat_id: string, message: string, log: string) {
    const status = await Database
    .from('state_controls')
    .where('description', '=', 'telegram')
    .select('status')

    if (status[0].status) {
      await Telegram.sendMessage(chat_id, message)
      Logger.info(`${log}`)
    } else {
      this.maintenance.forEach(async element => {
        await Telegram.sendMessage(element.chat_id, 'Alarm appears on system but telegram feature still disable')
      });
      Logger.info(`Alarm appears on system but telegram feature still disable`)
    }
  }
}
