import { DateTime } from 'luxon'
import { BaseModel, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Users from './Users'

export default class Profile extends BaseModel {
  @column({ isPrimary: true , serializeAs: null})
  public id: number

  @column({ serializeAs: null })
  public user_id: number

  @column()
  public full_name: string

  @column()
  public theme?: string

  @column()
  public avatar_url?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => Users)
  public user: HasOne<typeof Users>
}
