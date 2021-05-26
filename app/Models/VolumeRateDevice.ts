import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Device from './Device'
import { BelongsTo } from '@ioc:Adonis/Lucid/Relations'

export default class VolumeRateDevice extends BaseModel {

  @column({ isPrimary: true })
  public id: number

  @column({})
  public device_code: string

  @column({})
  public volume_rate_value: number

  @column({})
  public status: string

  @column({})
  public time_device: DateTime
  
  @belongsTo(()=> Device, {
    foreignKey: 'device_code'
  })
  public device: BelongsTo<typeof Device>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
