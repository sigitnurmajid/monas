/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes/index.ts` as follows
|
| import './cart'
| import './customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.group(()=>{
  Route.post('/register', 'AuthController.register').as('auth.signup')
  Route.post('/login', 'AuthController.login').as('auth.login')
  Route.post('/logout', 'AuthController.logout').as('auth.logout')
}).prefix('user')

Route.group(()=>{
  Route.get('/create', 'TokensController.create').as('token.create')
  Route.get('/index', 'TokensController.index').as('token.index')
  Route.delete('/delete/:id', 'TokensController.delete').as('token.delete')
}).prefix('token')

Route.group(()=> {
  Route.resource('/device', 'DevicesController').apiOnly()
  Route.resource('/threshold-device', 'ThresholdDevicesController').apiOnly()
  Route.group(()=>{
    Route.post('/pressure-volume', 'PressureVolumeDevicesController.create')
    Route.get('/pressure-volume/:id', 'PressureVolumeDevicesController.show')
    Route.post('/volume-rate', 'VolumeRateDevicesController.create')
    Route.get('/volume-rate/:id', 'VolumeRateDevicesController.show')
    Route.post('/filling', 'FillingsController.create')
    Route.get('/filling/:id', 'FillingsController.show')
  }).prefix('/node-data')
  Route.resource('/status-master-data', 'StatusMasterDataController').apiOnly()
}).prefix('/api')
