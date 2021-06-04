import Telegram from "@ioc:Monas/Services/Telegram"
import UsersTelegram from 'App/Models/UsersTelegram'
import Logger from '@ioc:Adonis/Core/Logger'
import Database from "@ioc:Adonis/Lucid/Database";

const COMMAND_TEMPLATE1 = 'template1';
const COMMAND_TEMPLATE2 = 'template2';
const COMMAND_TEMPLATE3 = 'template3';

async function savedToDatabase(name: any, chatId: any, role: any, token: any) {
  const user = new UsersTelegram

  user.name = name
  user.chat_id = chatId
  user.role = role
  user.token_user = token

  try {
    await user.save()
    Logger.info(`User saved to Database with name : ${name}, role : ${role}`)
    Telegram.sendMessage(chatId, 'Saved to Database');
  } catch (error) {
    Telegram.sendMessage(chatId, 'Failed, please contact admin');
    Logger.info(error)
  }

}

let name : any;
let chatId : any;
let token : any;

let inline_keyboard = [
  [
    {
      text: 'Maintenance',
      callback_data: COMMAND_TEMPLATE1
    },
    {
      text: 'Supplier',
      callback_data: COMMAND_TEMPLATE2
    },
    {
      text: 'Client',
      callback_data: COMMAND_TEMPLATE3
    }
  ]
];

Telegram.onText(/\/register/, async (msg) =>  {
  const { chat: { id } } = msg;
  
  Telegram.sendMessage(id, `Enter your name`, {
    reply_markup: {
      force_reply: true
    }
  }).then(addApiId => {
    Telegram.onReplyToMessage(addApiId.chat.id, addApiId.message_id, msg => {
      name = msg.text
      Telegram.sendMessage(addApiId.chat.id, `Enter your token`, {
        reply_markup: {
          force_reply: true
        }
      }).then(addApiId => {
        Telegram.onReplyToMessage(addApiId.chat.id, addApiId.message_id, async msg => {
          chatId = addApiId.chat.id
          token = msg.text

          const tokenUser = await Database
          .from('token_user_telegrams')
          .count('* as total')
          .where('token', token)

          if (tokenUser[0].total == 0) return Telegram.sendMessage(chatId, 'Token not available')

          Telegram.sendMessage(addApiId.chat.id, `Hello ${name} enter your role`, {
            reply_markup: {
              inline_keyboard
            }
          })
        })
      })
    })
  });
})


Telegram.on('callback_query', query => {
  switch (query.data) {
    case COMMAND_TEMPLATE1:
      savedToDatabase(name, chatId, 'maintenance', token)
      break;
    case COMMAND_TEMPLATE2:
      savedToDatabase(name, chatId, 'supplier', token)
      break;
    case COMMAND_TEMPLATE3:
      savedToDatabase(name, chatId, 'client', token)
      break;
  }
})