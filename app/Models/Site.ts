import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasOne, hasOne, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Organization from './Organization'
import users from './users'
import Device from './Device'

export default class Site extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ serializeAs: null })
  public organization_id: number

  @column()
  public name: string

  @column()
  public address: string

  @column()
  public coordinate: string

  @column()
  public device_id: number

  @column.dateTime({ autoCreate: true , serializeAs: null})
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true , serializeAs: null})
  public updatedAt: DateTime

  @belongsTo(() => Organization, ({foreignKey: 'organization_id'}))
  public organization: BelongsTo<typeof Organization>

  @manyToMany(()=>users)
  public users: ManyToMany<typeof users>

  @hasOne(()=>Device, ({foreignKey: 'site_id'}))
  public device: HasOne<typeof Device>

}
