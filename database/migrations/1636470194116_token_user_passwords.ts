import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class TokenUserPasswords extends BaseSchema {
  protected tableName = 'token_user_passwords'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('token')
      table.string('email')
      table.enum('is_used', [true,false])
      table.timestamp('expired_at')
      table.timestamp('created_at')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
