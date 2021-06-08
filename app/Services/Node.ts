import axios from 'axios'
import qs from 'querystring'


export default class Node {
  public static async setTankProperties(threshold: { nodeId: string, up_limit: number, low_limit: number }) {
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    }

    const data = qs.stringify({
      access_token: 'e41ab705fa55773e1737e61c28b8b35bc4e298db',
      args: `{"upperThresholdValue" : ${threshold.up_limit}, "lowerThresholdValue" : ${threshold.low_limit}}`
    })

    await axios.post(`https://api.particle.io/v1/devices/${threshold.nodeId}/setTankProperties`, data , { headers: headers })
  }
}
