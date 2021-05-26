import { DateTime } from 'luxon'
import { BaseModel, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import UsersTelegram from 'App/Models/UsersTelegram'

export default class TokenUserTelegram extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public token: string

  @hasOne(() => UsersTelegram, {
    foreignKey: 'token_user'
  })
  public userTelegram: HasOne<typeof UsersTelegram>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
