import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PressureVolumeDevices extends BaseSchema {
  protected tableName = 'pressure_volume_devices'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('device_code').notNullable().references('devices.device_code')
      table.float('pressure_value')
      table.float('volume_value')
      table.float(' stability_value')
      table.string('status').notNullable()
      table.dateTime('time_device')
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
