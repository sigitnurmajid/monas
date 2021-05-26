import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class ThresholdDevice extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({})
  public device_code: string

  @column({})
  public up_limit: number

  @column({})
  public low_limit: number
  
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
