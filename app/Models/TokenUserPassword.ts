import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class TokenUserPassword extends BaseModel {

  @column({ isPrimary: true , serializeAs: null})
  public id: number

  @column()
  public token: string

  @column()
  public email: string

  @column()
  public is_used: boolean

  @column()
  public created_at: Date

  @column()
  public expired_at: Date
}
