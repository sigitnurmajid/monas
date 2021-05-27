// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { uid } from 'rand-token';
import TokenUserTelegram from 'App/Models/TokenUserTelegram'

export default class TokensController {
    public async create() {
        const token = uid(20)
        const tokenUserTelegram = new TokenUserTelegram

        tokenUserTelegram.token = token
        await tokenUserTelegram.save()
        
        return token
    }

    public async index() {
        
    }

    // public async delete({ request }: HttpContextContract) {

    // }
}
