import Env from '@ioc:Adonis/Core/Env'

const config = {
  token: Env.get('TELEGRAM_TOKEN'),
  polling: {
    polling : Env.get('TELEGRAM_POLLING')
  },
  healthCheck: true
}

export default config