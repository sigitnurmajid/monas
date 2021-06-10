import Database from '@ioc:Adonis/Lucid/Database'
import Telegram from '@ioc:Monas/Services/Telegram'
import Device from 'App/Models/Device'
import PressureVolumeDevice from 'App/Models/PressureVolumeDevice'
import axios from 'axios'
import qs from 'querystring'


export default class Node {
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

  public async sendAlarm(data: PressureVolumeDevice) {
    if (data.status !== 'NORMAL') {
      const device = await Device.findBy('device_code', data.device_code)

      if (device?.location !== undefined) {
        const user = await Database
          .from('users_telegrams')
          .where('location', '=', device.location)
          .orWhere('role', '=', 'maintenance')
          .orWhere('role', '=', 'supplier')
          .select('chat_id')

        const threshold = await Database
          .from('threshold_devices')
          .where('device_code', '=', data.device_code)
          .select('up_limit', 'low_limit')

        const highThreshold = threshold[0].up_limit
        const lowThreshold = threshold[0].low_limit
        
        user.forEach(async element => {
          const line1 = `\u{203C} [ALARM] \u{203C}\n\n`
          const line2 = `Oxygen Level : ${data.status}\n\n`
          const line3 = `Location : ${device.location}\n\n`
          const line4 = `Current Level : ${data.volume_value}\n\n`
          const line5 = `High Threshold : ${highThreshold} \n\n`
          const line6 = `Low Threshold : ${lowThreshold} `
          const message = line1 + line2 + line3 + line4 + line5 + line6
          await Telegram.sendMessage(element.chat_id, message)
        })
      }
    }
  }
}
