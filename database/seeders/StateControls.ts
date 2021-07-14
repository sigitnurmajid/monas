import Database from '@ioc:Adonis/Lucid/Database';
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

export default class DeviceSeeder extends BaseSeeder {
  public static developmentOnly = true
  
  public async run () {
    await Database
    .table('state_controls')
    .insert({
      description : 'telegram',
      status : true
    })
  }
}
