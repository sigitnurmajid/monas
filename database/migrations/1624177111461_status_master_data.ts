import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class StatusMasterData extends BaseSchema {
  protected tableName = 'status_master_data'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('status').unique()
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
