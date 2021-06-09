// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { uid } from 'rand-token';
import TokenUserTelegram from 'App/Models/TokenUserTelegram'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class TokensController {
    public async create({ response }: HttpContextContract) {
        const token = uid(20)
        const tokenUserTelegram = new TokenUserTelegram

        tokenUserTelegram.token = token

        await tokenUserTelegram.save()
            .catch(() => {
                return response.status(400).send({ error: true, message: 'Error while saving to database' })
            })
        return tokenUserTelegram
    }

    public async index({ request, response }: HttpContextContract) {
        const req = request.all()

        if ('status' in req) {
            const token = await TokenUserTelegram.query().where('status', '=', req.status)
                .catch(() => {
                    return response.status(400).send({ error: true, message: 'Error while querying' })
                })
            return token
        } else {
            const token = await TokenUserTelegram.query()
                .catch(() => {
                    return response.status(400).send({ error: true, message: 'Error while querying' })
                })
            return token
        }

    }

    public async delete({ response, params }: HttpContextContract) {
        const token = await TokenUserTelegram.query().where('id', params.id).delete()

        if (token) {
            return response.status(200).send({ error: false, message: 'Data has been deleted' })
        } else {
            return response.status(400).send({ error: true, message: 'Error while deleting data or Id not found' })
        }
    }
}
