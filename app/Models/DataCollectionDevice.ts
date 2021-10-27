import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Device from './Device'

export default class DataCollectionDevice extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({})
  public device_code: string

  @column({})
  public temperature: number

  @column({})
  public solar_exposure: number

  @column({})
  public humidity: number

  @column({})
  public battery_level: number

  @column({})
  public status: string

  @column({})
  public firmware_version: string

  @column({})
  public device_type: string

  @column({})
  public memory_usage: number

  @column({})
  public time_device: DateTime

  @belongsTo(() => Device, {
    foreignKey: 'device_code',
    localKey: 'device_code'
  })
  public device: BelongsTo<typeof Device>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
