import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Site from './Site'
import users from './users'
import Device from './Device'

export default class Organization extends BaseModel {
  // public serializeExtras = true

  @column({ isPrimary: true })
  public id: number

  @column({})
  public name: string

  @column()
  public email: string

  @column()
  public address: string

  @column()
  public avatar_url: string

  @column.dateTime({ autoCreate: true , serializeAs: null})
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null})
  public updatedAt: DateTime

  @hasMany(() => Site, ({foreignKey: 'organization_id'}))
  public sites: HasMany<typeof Site>

  @hasMany(() => users, ({foreignKey: 'organization_id'}))
  public users: HasMany<typeof users>

  @hasMany(()=>Device, ({foreignKey: 'organization_id'}))
  public device: HasMany<typeof Device>
}
