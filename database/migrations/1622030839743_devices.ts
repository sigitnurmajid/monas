import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Devices extends BaseSchema {
  protected tableName = 'devices'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('device_name').notNullable()
      table.string('device_code').unique().notNullable()
      table.string('device_type').notNullable()
      table.string('location').notNullable()
      table.string('tank_code').notNullable()
      table.string('tank_type').notNullable()
      table.float('high_limit')
      table.float('low_limit')
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
