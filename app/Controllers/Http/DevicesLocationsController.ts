import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Device from 'App/Models/Device'
import DevicesLocation from 'App/Models/DevicesLocation'
import users from 'App/Models/users'
import { queryDevicesLocation } from './RawQuery/PressureVolumeRaw'


export default class DevicesLocationsController {
  public async index({ }: HttpContextContract) {
  }

  public async create({ request , response}: HttpContextContract) {
    const location = new DevicesLocation

    location.device_code = request.input('device_code')
    location.gps_status = request.input('data.gps_status')
    location.latitude = request.input('data.latitude')
    location.longitude = request.input('data.longitude')
    location.time_device = request.input('time_device')

    const device = await Device.findBy('device_code', location.device_code)

    if (device) {
      await device.related('device_location').save(location)
      return response.status(200).send({ error: false, message: 'Saved to database' })
    } else {
      return response.status(400).send({ error: true, message: 'Node Id did not registered' })
    }
  }

  public async store({ }: HttpContextContract) {
  }

  public async show({ auth , response , request}: HttpContextContract) {
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
          return await Database.rawQuery(queryDevicesLocation(devicesEntity))

        } else if (user.userRole.role === 'admin') {
          const organization = user.organization
          const deviceByOrganization = await Device.query().where('organization_id', organization.id)
          const devicesEntity = deviceByOrganization.map(x => `\'${x.device_code}\'`).join(',')
          return await Database.rawQuery(queryDevicesLocation(devicesEntity))

        } else {
          const site = user.sites
          const deviceBySite = await Device.query().where('site_id', site[0].id)
          const devicesEntity = deviceBySite.map(x => `\'${x.device_code}\'`).join(',')
          return await Database.rawQuery(queryDevicesLocation(devicesEntity))
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
}
