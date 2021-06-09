import Telegram from "@ioc:Monas/Services/Telegram"
import UsersTelegram from 'App/Models/UsersTelegram'
import TokenUserTelegram from 'App/Models/TokenUserTelegram'
import Logger from '@ioc:Adonis/Core/Logger'
import Database from "@ioc:Adonis/Lucid/Database";

const COMMAND_TEMPLATE1 = 'template1';
const COMMAND_TEMPLATE2 = 'template2';
const COMMAND_TEMPLATE3 = 'template3';

async function savedToDatabase(name: any, chatId: any, role: any, token: any, messageTodelete: any) {
  const user = new UsersTelegram

  user.name = name
  user.chat_id = chatId
  user.role = role
  user.token = token

  try {
    await user.save().then(async () => {
      const tokenUser = await TokenUserTelegram.findByOrFail('token', token)
      tokenUser.status = 'USED'
      await tokenUser.save().catch(async () => {
        await Telegram.sendMessage(chatId, 'Failed to change state token, please contact admin')
      })
    })
    Logger.info(`User saved to Database with name : ${name}, role : ${role}`)
    await Telegram.sendMessage(chatId, 'User registered');
  } catch (e) {
    await Telegram.sendMessage(chatId, 'Failed, please contact admin')
  }

  Telegram.deleteMessage(chatId, messageTodelete)
}

let name: any
let chatId: any
let token: any
let messageTodelete: any

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

Telegram.onText(/\/register/, async (msg) => {
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
            .select('*')
            .where('status', '=', 'NOT USE')
            .andWhere('token', '=', token)

          if (tokenUser.length == 0) return Telegram.sendMessage(chatId, 'Token not availabe or used by other user')

          Telegram.sendMessage(chatId, `Hello ${name} enter your role`, {
            reply_markup: {
              inline_keyboard
            }
          }).then((result) => {
            messageTodelete = result.message_id
          })
        })
      })
    })
  });
})


Telegram.on('callback_query', query => {
  switch (query.data) {
    case COMMAND_TEMPLATE1:
      savedToDatabase(name, chatId, 'maintenance', token, messageTodelete)
      break;
    case COMMAND_TEMPLATE2:
      savedToDatabase(name, chatId, 'supplier', token, messageTodelete)
      break;
    case COMMAND_TEMPLATE3:
      savedToDatabase(name, chatId, 'client', token, messageTodelete)
      break;
  }
})