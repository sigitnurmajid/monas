import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import Device from './Device'

export default class UsersTelegram extends BaseModel {

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public chat_id: string
  
  @column()
  public role: string

  @column()
  public token: string

  @manyToMany(()=>Device, {
    pivotTable: 'users_devices'
  })
  public devices: ManyToMany<typeof Device>
  
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
