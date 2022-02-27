import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Device from './Device'

export default class Filling extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({})
  public device_code: string

  @column({})
  public pressure_value: number

  @column({})
  public weight_value: number

  @column({})
  public volume_value: number

  @column({})
  public stability_value: number

  @column({})
  public filling_state : string

  @column({})
  public time_device: DateTime

  @belongsTo(() => Device, {
    foreignKey: 'device_code',
    localKey: 'device_code'
  })
  public device: BelongsTo<typeof Device>

  @column.dateTime({ autoCreate: true , serializeAs: null})
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime
}
