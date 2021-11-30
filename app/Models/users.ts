import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel,
  hasOne,
  HasOne,
  belongsTo,
  BelongsTo,
  manyToMany,
  ManyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import Profile from './Profile'
import UsersRole from './UsersRole'
import Organization from './Organization'
import Site from './Site'

export default class users extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ serializeAs: null })
  public organization_id: number

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken?: string

  @column.dateTime({ autoCreate: true , serializeAs: null})
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true , serializeAs: null})
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword (users: users) {
    if (users.$dirty.password) {
      users.password = await Hash.make(users.password)
    }
  }

  @hasOne(() => Profile, {foreignKey : 'user_id'})
  public profile: HasOne<typeof Profile>

  @hasOne(() => UsersRole, {foreignKey : 'user_id'})
  public userRole: HasOne<typeof UsersRole>

  @manyToMany(() => Site)
  public sites: ManyToMany<typeof Site>

  @belongsTo(()=> Organization, ({foreignKey: 'organization_id'}))
  public organization: BelongsTo<typeof Organization>
}
