import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Profile from 'App/Models/Profile'
import Users from 'App/Models/users'
import Hash from '@ioc:Adonis/Core/Hash'
import users from 'App/Models/users'
import UsersRole from 'App/Models/UsersRole'
import Organization from 'App/Models/Organization'
import Site from 'App/Models/Site'

export default class AuthController {
  public async register({ request, response }: HttpContextContract) {
    const validationSchema = schema.create({
      full_name: schema.string(),
      email: schema.string({ trim: true }, [
        rules.email(),
        rules.unique({ table: 'users', column: 'email' }),
      ]),
      password: schema.string({ trim: true }, [
        rules.confirmed(),
      ]),
      role: schema.enum(
        ['admin','user','superadmin'] as const
      ),
    })

    try {
      const userDetails = await request.validate({
        schema: validationSchema
      })
      const sites_id = request.input('sites_id')


      if(userDetails.role === 'admin'){
        if(!request.input('organization_id')) throw new Error('Please input organization_id for role admin')
        if(request.input('sites_id')) throw new Error('Do not including sites_id for role admin')
      } else if(userDetails.role === 'user'){
        if(!request.input('organization_id') || !request.input('sites_id')) throw new Error('Please input organization_id & sites_id for role user')
        if(!Array.isArray(sites_id)) throw new Error('sites_id must be array')
      } else {
        if(request.input('organization_id') || request.input('sites_id')) throw new Error('Do not including organization_id & sites_id for role superadmin')
      }

      const user = new Users
      const profile = new Profile
      const role = new UsersRole

      user.email = userDetails.email
      user.password = userDetails.password
      profile.full_name = userDetails.full_name
      role.role = userDetails.role
      user.organization_id = request.input('organization_id')

      await user.save()
      await user.related('profile').save(profile)
      await user.related('userRole').save(role)

      const userResgitered = await Users.findByOrFail('email', user.email)

      if(sites_id) await userResgitered?.related('sites').attach(request.input('sites_id'))

      return response.status(200).json({ code: 200, status: 'success' , role : role.role})
    } catch (error) {
      if (error.code === 'E_VALIDATION_FAILURE') return response.status(422).json({ code: 422, status: 'Unprocessable Entity', message: error.messages })

      return response.status(500).json({ code: 500, status: 'error', message: error.message })
    }
  }

  public async login({ request, auth, response }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    try {
      const token = await auth.use('api').attempt(email, password, {
        expiresIn: '7days'
      })

      const user = await users.findByOrFail('email', email)
      await user.load('profile')
      await user.load('userRole')
      await user.load('sites')


      const responseSuccessPayload = {
        code : 200,
        status : 'success',
        data: token,
        theme: user.profile.theme,
        role: user.userRole.role
      }

      if (user.userRole.role === 'superadmin'){
        const organization_id = await Organization.query().select('id')
        responseSuccessPayload['default_organization'] = organization_id[0]
      }

      if (user.userRole.role === 'user'){
        const site = await Site.findOrFail(user.sites[0].id)
        await site.load('device')
        responseSuccessPayload['device_code'] = site.device.device_code
      }

      return response.status(200).json(responseSuccessPayload)

    } catch (error) {
      if (error.code === 'E_INVALID_AUTH_UID') {
        error.code = 400
        error.message = 'Email address not found'
      }

      if (error.code === 'E_INVALID_AUTH_PASSWORD') {
        error.code = 400
        error.message = 'Password mis-match'
      }
      return response.status(error.code).json({ code: error.code, status: 'error', message: error.message })

    }
  }

  public async logout({ auth, response }: HttpContextContract) {
    try {
      await auth.logout()
      return response.status(200).json({ code: 200, status: 'success' })
    } catch (error) {
      return response.status(500).json({ code: 500, status: 'error', message: error.message })
    }
  }

  public async changePassword({ auth, request, response }: HttpContextContract) {

    const validationSchema = schema.create({
      current_password: schema.string({ trim: true }),
      password: schema.string({ trim: true }, [
        rules.confirmed(),
      ]),
    })

    const userDetails = await request.validate({
      schema: validationSchema
    })
    const user = await Users.find(auth.user?.id)

    try {

      if (!user) throw new Error('user not found')


      if (await Hash.verify(user?.password, userDetails.current_password)) {
        user.merge({ password: userDetails.password })

        await user?.save()
        return response.status(200).json({ code: 200, status: 'success' })

      } else {
        throw new Error('password mis-match')
      }
    } catch (error) {
      return response.status(500).json({ code: 500, status: 'error', message: error.message })
    }

  }
}
