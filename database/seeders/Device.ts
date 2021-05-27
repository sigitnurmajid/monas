import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Device from 'App/Models/Device';

export default class DeviceSeeder extends BaseSeeder {
  public static developmentOnly = true
  
  public async run () {
    await Device.create({
      device_name: 'Sigit',
      device_code: '12345678',
      device_type: 'PressureDevice',
      location: 'Cimahi',
      coordinate: 'Kalidam',
      tank_code: 'L01',
      tank_type: 'Besar'
    })
  }
}
