import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Device from 'App/Models/Device';
import Organization from 'App/Models/Organization';
import Site from 'App/Models/Site';
import ThresholdDevice from 'App/Models/ThresholdDevice'
import { schema } from '@ioc:Adonis/Core/Validator'
// import Node from 'App/Services/Node'

export default class DevicesController {
  public async index({ response }: HttpContextContract) {
    const device = await Device.query()
      .catch(() => {
        return response.status(400).send({ error: true, message: 'Error while querying' })
      })
    return device
  }

  public async create({ }: HttpContextContract) {
  }

  public async store({ request, response }: HttpContextContract) {
    const validationSchema = schema.create({
      device_code: schema.string(),
      device_name: schema.string(),
      device_type: schema.string(),
      location: schema.string(),
      tank_code: schema.string(),
      tank_type: schema.string(),
      high_limit: schema.number(),
      low_limit: schema.number(),
      site_id: schema.number(),
      organization_id: schema.number()
    })

    const device = new Device
    // const node = new Node

    try {

      const deviceDetails = await request.validate({
        schema: validationSchema
      })

      device.device_code = deviceDetails.device_code
      device.device_name = deviceDetails.device_name
      device.device_type = deviceDetails.device_type
      device.location = deviceDetails.location
      device.tank_code = deviceDetails.tank_code
      device.tank_type = deviceDetails.tank_type
      device.high_limit = deviceDetails.high_limit
      device.low_limit = deviceDetails.low_limit

      const threshold = new ThresholdDevice

      threshold.device_code = deviceDetails.device_code
      threshold.high_threshold = 0
      threshold.low_threshold = 0
      threshold.hospital_high_threshold = 0
      threshold.hospital_low_threshold = 0

      // const setTankProperties = {
      //   nodeId: deviceDetails.device_code,
      //   up_limit: 0,
      //   low_limit: 0
      // }

      const site = await Site.findOrFail(deviceDetails.site_id)
      await site.load('device')

      if(site.device !== null) throw new Error('Site already has a device')

      const organization = await Organization.findOrFail(deviceDetails.organization_id)

      await site?.related('device').create(device)

      const deviceRegistered = await Device.findByOrFail('device_code', device.device_code)

      if (organization) await deviceRegistered.related('organization').associate(organization)

      await threshold.save()
      // await node.setTankProperties(setTankProperties)

      return response.status(200).json({ code: 200, status: 'success', data: device })

    } catch (error) {

      if(error.code ==='E_ROW_NOT_FOUND') error.message = 'Organization or Site not found'
      if(error.code === '23505') error.message = 'Device already registered'
      return response.status(500).json({ code: 500, status: 'error', message: error.message })

    }

    /*
    await device.save().then(async () => {
      await threshold.save()
        .then(async () => {
          await node.setTankProperties(setTankProperties)
            .then((respond: any) => {
              if (respond.response == '0') return response.status(400).send({ error: true, message: 'Device respond with bad respond' })
            })
            .catch((e) => {
              if (e.message == 'NODE_NOT_RESPOND') {
                return response.status(400).send({ error: true, message: 'Device did not respond' })
              }
            })
        })
        .catch(() => {
          return response.status(400).send({ error: true, message: 'Failed to save threshold, try another option with API call' })
        })
    })
      .catch(() => {
        return response.status(400).send({ error: true, message: 'Failed to register' })
      })

    return device
    */
  }

  public async show({ params, response }: HttpContextContract) {
    const device = await Device.find(params.id)
      .catch(() => {
        return response.status(400).send({ error: true, message: 'Error while querying' })
      })
    if (device) {
      return device
    } else {
      return response.status(400).send({ error: true, message: 'Id did not match' })
    }
  }

  public async edit({ }: HttpContextContract) {
  }

  public async update({ params, request, response }: HttpContextContract) {
    const device = await Device.find(params.id)
      .catch(() => {
        return response.status(400).send({ error: true, message: 'Error while querying' })
      })
    if (device) {
      device.device_code = request.input('device_code')
      device.device_name = request.input('device_name')
      device.device_type = request.input('device_type')
      device.location = request.input('location')
      device.tank_code = request.input('tank_code')
      device.tank_type = request.input('tank_type')
      device.high_limit = request.input('high_limit')
      device.low_limit = request.input('low_limit')

      if (await device.save()) {
        return device
      }
      return response.status(400).send({ error: true, message: 'Failed to update' })
    } else {
      return response.status(400).send({ error: true, message: 'Id did not match' })
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    const device = await Device.query().where('id', params.id).delete()

    if (device) {
      return response.status(200).send({ error: false, message: 'Data has been deleted' })
    } else {
      return response.status(400).send({ error: true, message: 'Error while deleting data' })
    }
  }
}
