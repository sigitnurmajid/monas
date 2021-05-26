import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class TokenUserTelegrams extends BaseSchema {
  protected tableName = 'token_user_telegrams'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('token').unique()
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
