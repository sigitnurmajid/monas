import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, hasOne } from '@ioc:Adonis/Lucid/Orm'
import { HasMany, HasOne } from '@ioc:Adonis/Lucid/Relations'
import ThresholdDevice from './ThresholdDevice'
import PressureVolumeDevice from './PressureVolumeDevice'
import VolumeRateDevice from './VolumeRateDevice'
import Filling from './Filling'


export default class Device extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({})
  public device_name: string

  @column({})
  public device_code: string

  @column({})
  public device_type: string

  @column({})
  public location: string

  @column({})
  public coordinate: string

  @column({})
  public tank_code: string

  @column({})
  public tank_type: string

  @hasOne(()=> ThresholdDevice, {
    foreignKey: 'device_code'
  })
  public threshold_device: HasOne<typeof ThresholdDevice> 

  @hasMany(()=> PressureVolumeDevice, {
    foreignKey: 'device_code'
  })
  public pressure_volume_device: HasMany<typeof PressureVolumeDevice>

  @hasMany(()=> VolumeRateDevice, {
    foreignKey: 'device_code'
  })
  public volume_rate_device: HasMany<typeof VolumeRateDevice>
  
  @hasMany(()=> Filling, {
    foreignKey: 'device_code'
  })
  public filling: HasMany<typeof Filling>


  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
