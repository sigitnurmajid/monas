import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, hasOne, HasMany, HasOne, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import ThresholdDevice from './ThresholdDevice'
import PressureVolumeDevice from './PressureVolumeDevice'
import VolumeRateDevice from './VolumeRateDevice'
import Filling from './Filling'
import VolumeUsage from './VolumeUsage'
import DevicesLocation from './DevicesLocation'
import DataCollectionDevice from './DataCollectionDevice'
import Site from './Site'
import Organization from './Organization'


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
  public tank_code: string

  @column({})
  public tank_type: string

  @column({})
  public high_limit: number

  @column({})
  public low_limit: number

  @column({serializeAs : null})
  public site_id: number

  @column({serializeAs : null})
  public organization_id: number

  @hasOne(() => ThresholdDevice, {
    foreignKey: 'device_code',
    localKey: 'device_code'
  })
  public threshold_device: HasOne<typeof ThresholdDevice>

  @hasMany(() => PressureVolumeDevice, {
    foreignKey: 'device_code',
    localKey: 'device_code'
  })
  public pressure_volume_device: HasMany<typeof PressureVolumeDevice>

  @hasMany(() => VolumeRateDevice, {
    foreignKey: 'device_code',
    localKey: 'device_code'
  })
  public volume_rate_device: HasMany<typeof VolumeRateDevice>

  @hasMany(() => Filling, {
    foreignKey: 'device_code',
    localKey: 'device_code'
  })
  public filling: HasMany<typeof Filling>

  @hasMany(() => VolumeUsage, {
    foreignKey: 'device_code',
    localKey: 'device_code'
  })
  public volume_usage: HasMany<typeof VolumeUsage>

  @hasMany(() => DevicesLocation, {
    foreignKey: 'device_code',
    localKey: 'device_code'
  })
  public device_location: HasMany<typeof DevicesLocation>

  @hasMany(() => DataCollectionDevice, {
    foreignKey: 'device_code',
    localKey: 'device_code'
  })
  public data_collection_device: HasMany<typeof DataCollectionDevice>

  @hasOne(() => Site, ({localKey: 'site_id'}))
  public site: HasOne<typeof Site>

  @belongsTo(() => Organization, ({foreignKey: 'organization_id'}))
  public organization: BelongsTo<typeof Organization>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
