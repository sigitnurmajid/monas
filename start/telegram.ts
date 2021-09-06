import Telegram from "@ioc:Monas/Services/Telegram"
import TokenUserTelegram from 'App/Models/TokenUserTelegram'
import Logger from '@ioc:Adonis/Core/Logger'
import Database from "@ioc:Adonis/Lucid/Database";
import UsersTelegram from "App/Models/UsersTelegram";

const COMMAND_TEMPLATE1 = 'template1';
const COMMAND_TEMPLATE2 = 'template2';
const COMMAND_TEMPLATE3 = 'template3';

async function savedToDatabase(name: any, chatId: any, role: any, token: any, messageTodelete: any, location: any) {
  const user = new UsersTelegram
  user.location = location
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
    console.log(e.message)
  }

  Telegram.deleteMessage(chatId, messageTodelete)
}

let name: any
let chatId: any
let token: any
let messageTodelete: any
let location: any

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
  const checkUser = await UsersTelegram.findBy('chat_id', id).catch(() => {
    return Telegram.sendMessage(id, 'Register function is wrong')
  })

  if (checkUser) {
    return Telegram.sendMessage(id, 'Your phone has been registered')
  }

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

          Telegram.sendMessage(chatId, `Please enter your location`, {
            reply_markup: {
              force_reply: true
            }
          }).then(addApiId => {
            Telegram.onReplyToMessage(addApiId.chat.id, addApiId.message_id, async msg => {
              location = msg.text
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
      })
    })
  })
});



Telegram.on('callback_query', query => {
  switch (query.data) {
    case COMMAND_TEMPLATE1:
      savedToDatabase(name, chatId, 'maintenance', token, messageTodelete, location)
      break;
    case COMMAND_TEMPLATE2:
      savedToDatabase(name, chatId, 'supplier', token, messageTodelete, location)
      break;
    case COMMAND_TEMPLATE3:
      savedToDatabase(name, chatId, 'client', token, messageTodelete, location)
      break;
  }
})


Telegram.onText(/\/telegramfitur/, async (msg) => {
  const userMaintenance = await UsersTelegram.findBy('chat_id', msg.chat.id.toString())

  if (userMaintenance?.role === 'maintenance') {
    const status = await Database
      .from('state_controls')
      .where('description', '=', 'telegram')
      .select('status')

    try {
      await Database
        .from('state_controls')
        .where('description', '=', 'telegram')
        .update({ status: !status[0].status })
      Telegram.sendMessage(msg.chat.id, `State telegram changed to ${!status[0].status}`)
    } catch (error) {
      Telegram.sendMessage(msg.chat.id, 'Failed change state')
    }
  } else {
    Telegram.sendMessage(msg.chat.id, 'You dont have previllage to change this state')
  }
})

Telegram.onText(/\/sendbroadcast/, async (msg) => {
  const userMaintenance = await UsersTelegram.findBy('chat_id', msg.chat.id.toString())

  if (userMaintenance?.role === 'maintenance') {
    Telegram.sendMessage(msg.chat.id, 'What\'s your message', {
      reply_markup: {
        force_reply: true
      }
    }).then(addApiId => {
      Telegram.onReplyToMessage(addApiId.chat.id, addApiId.message_id, async msg => {
        const messageToSent = msg.text
        if (messageToSent) {
          Telegram.sendMessage(msg.chat.id, `Are you sure to send this message : \n\nType : 'yes' (to proceed) / 'no' (to cancel) \n\n${msg.text}`, {
            reply_markup: {
              force_reply: true
            }
          }).then(addApiId => {
            Telegram.onReplyToMessage(addApiId.chat.id, addApiId.message_id, async msg => {
              if (msg.text === 'yes') {
                const usersTelegram = await UsersTelegram.all()
                usersTelegram.forEach(user => {
                  Telegram.sendMessage(user.chat_id, messageToSent)
                })
              } else if (msg.text === 'no'){
                Telegram.sendMessage(msg.chat.id, 'Broadcast message cancelled')
              } else {
                Telegram.sendMessage(msg.chat.id, 'Invalid response')
              }
            })
          })
        } else {
          Telegram.sendMessage(msg.chat.id, 'Message invalid')
        }
      })
    })
  } else {
    Telegram.sendMessage(msg.chat.id, 'You dont have previllage to broadcast a message')
  }
})
