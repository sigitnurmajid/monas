import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class ThresholdDevice extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({})
  public device_code: string

  @column({})
  public high_threshold: number

  @column({})
  public low_threshold: number

  @column({})
  public hospital_high_threshold: number

  @column({})
  public hospital_low_threshold: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
