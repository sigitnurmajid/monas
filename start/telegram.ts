import Telegram from "@ioc:Monas/Services/Telegram"
import Logger from '@ioc:Adonis/Core/Logger'


Telegram.on('message', (msg) => {
  const chatId = msg.chat.id;
  // send a message to the chat acknowledging receipt of their message
  Telegram.sendMessage(chatId, 'Received your message');
  Logger.info(`Client ${msg.from?.first_name} try to message with this message ${msg.text}`)
  // Telegram.sendAudio(chatId, 'path/The Beatles - Ask Me Why.mp3');
});

Telegram.onText(/\/sendsong/, async (msg) =>{
  const chatId = msg.chat.id
  await Telegram.sendAudio(chatId, 'path/The Beatles - Ask Me Why.mp3')
});

Telegram.on('message', (msg) => {
  let location = "location";
  if (msg.text?.indexOf(location) === 0) {
      Telegram.sendLocation(msg.chat.id,-6.8816504,107.5426699);
      Telegram.sendMessage(msg.chat.id, "Here is the point");
  }
});