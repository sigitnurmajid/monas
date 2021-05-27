import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Device from './Device'

export default class Filling extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({})
  public device_code: string

  @column({})
  public pressure: number

  @column({})
  public weight: number

  @column({})
  public volume: number

  @column({})
  public time_device: DateTime

  @belongsTo(() => Device, {
    foreignKey: 'device_code'
  })
  public device: BelongsTo<typeof Device>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
