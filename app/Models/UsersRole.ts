import { DateTime } from 'luxon'
import { BaseModel, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import users from './users'

export default class UsersRole extends BaseModel {
  public static table = 'users_roles'

  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number

  @column()
  public role: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => users)
  public user: HasOne<typeof users>
}
