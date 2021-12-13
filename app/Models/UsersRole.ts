import { DateTime } from 'luxon'
import { BaseModel, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import users from './users'

export default class UsersRole extends BaseModel {
  public static table = 'users_roles'

  @column({ isPrimary: true , serializeAs: null})
  public id: number

  @column({ serializeAs: null })
  public user_id: number

  @column()
  public role: string

  @column.dateTime({ autoCreate: true , serializeAs: null})
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @hasOne(() => users)
  public user: HasOne<typeof users>
}
