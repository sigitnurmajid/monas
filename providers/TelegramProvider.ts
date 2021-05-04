import { ApplicationContract } from '@ioc:Adonis/Core/Application'

/*
|--------------------------------------------------------------------------
| Provider
|--------------------------------------------------------------------------
|
| Your application is not ready when this file is loaded by the framework.
| Hence, the top level imports relying on the IoC container will not work.
| You must import them inside the life-cycle methods defined inside
| the provider class.
|
| @example:
|
| public async ready () {
|   const Database = (await import('@ioc:Adonis/Lucid/Database')).default
|   const Event = (await import('@ioc:Adonis/Core/Event')).default
|   Event.on('db:query', Database.prettyPrint)
| }
|
*/
export default class TelegramProvider {
  public static needsApplication = true
  constructor (protected application: ApplicationContract) {
  }


  public register () {
  /**
    * Do not register if not running in "web" environment
    */
    if (this.application.environment !== 'web') {
      return
    }
    this.application.container.singleton('Monas/Services/Telegram', () => {
      const config = this.application.container.use('Adonis/Core/Config')
      const Telegram = require('node-telegram-bot-api')
      return new Telegram(config.get('telegram.token'),{polling : true})
    })
  }

  public async boot () {

  }

  public async ready () {
    // App is ready
  }

  public async shutdown () {
    const Telegram = this.application.container.use('Monas/Services/Telegram')
    if (Telegram) Telegram.end()
  }
}
