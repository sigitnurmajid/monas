import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class DevicesLocations extends BaseSchema {
  protected tableName = 'devices_locations'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('device_code').notNullable().references('devices.device_code')
      table.string('gps_status').notNullable()
      table.string('latitude').notNullable()
      table.string('longtitude').notNullable()
      table.dateTime('time_device').notNullable()
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
