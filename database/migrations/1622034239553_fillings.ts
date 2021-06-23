import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Fillings extends BaseSchema {
  protected tableName = 'fillings'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('device_code').notNullable().references('devices.device_code')
      table.float('pressure_value')
      table.float('weight_value')
      table.float('volume_value')
      table.float('stability_value')
      table.enum('filling_state', ['STARTED','FINISHED','ERROR'])
      table.dateTime('time_device')
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
