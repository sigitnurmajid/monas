
import telegram from '@ioc:Monas/Services/Telegram' 

export default class TelegramServices {
  public async sendMessage(){
    const chatId = '1042005566'
    await telegram.sendMessage(chatId,"Hello dear user");
  }
}
