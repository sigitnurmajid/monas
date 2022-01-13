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
import HealthCheck from '@ioc:Adonis/Core/HealthCheck'

/**
 * Health check feature
 */
Route.get('health', async ({ response }) => {
  const report = await HealthCheck.getReport()

  return report.healthy
    ? response.ok(report)
    : response.badRequest(report)
}).middleware(['auth:api','rbac:admin,superadmin'])

/**
 * User Route
 */

Route.group(() => {
  Route.post('/register', 'AuthController.register').as('auth.signup')
  Route.post('/login', 'AuthController.login').as('auth.login')
  Route.get('/logout', 'AuthController.logout').as('auth.logout').middleware('auth:api')
  Route.post('/change-password', 'AuthController.changePassword').as('auth.password').middleware('auth:api')
  Route.post('/reset-password/email', 'ForgotPasswordsController.store')
  Route.get('/reset-password/:token/:email', 'ForgotPasswordsController.show')
  Route.post('/reset-password/reset', 'ForgotPasswordsController.edit')
  Route.group(() => {
    Route.get('/profile', 'ProfilesController.index')
    Route.put('/profile', 'ProfilesController.update')
  }).middleware('auth:api')
}).prefix('api/user')



Route.resource('api/organization', 'OrganizationsController').middleware({
  '*': ['auth:api'],
  'store' : ['rbac:superadmin'],
  'update' : ['rbac:superadmin'],
  'destroy' : ['rbac:superadmin']
}).apiOnly()
Route.get('api/list-organizations', 'OrganizationsController.shows').middleware(['auth:api','rbac:superadmin'])

Route.resource('api/site', 'SitesController').middleware({
  '*': ['auth:api'],
  'store' : ['rbac:superadmin,admin'],
  'update' : ['rbac:superadmin,admin'],
  'destroy' : ['rbac:superadmin,admin']
}).apiOnly()


Route.get('test', 'SitesController.test')
/**
 * Telegram users Route
 */

Route.group(() => {
  Route.get('/create', 'TokensController.create').as('token.create')
  Route.get('/index', 'TokensController.index').as('token.index')
  Route.delete('/delete/:id', 'TokensController.delete').as('token.delete')
}).prefix('token').middleware('auth:api')

/**
 * Devices Route
 */

Route.group(() => {
  Route.resource('/device', 'DevicesController').apiOnly()
  Route.resource('/threshold-device', 'ThresholdDevicesController').apiOnly()
  Route.group(() => {
    Route.post('/pressure-volume', 'PressureVolumeDevicesController.create')
    Route.get('/pressure-volume/', 'PressureVolumeDevicesController.show').middleware('auth:api')
    Route.get('/pressure-volume/:device_code', 'PressureVolumeDevicesController.details').middleware('auth:api')
    Route.get('/volume-rate/:id', 'VolumeRateDevicesController.show')
    Route.post('/filling', 'FillingsController.create')
    Route.get('/filling/:id', 'FillingsController.show')
    Route.get('/volume-usage/:id', 'VolumeUsagesController.show')
  }).prefix('/node-data')
  Route.resource('/status-master-data', 'StatusMasterDataController').apiOnly()
}).prefix('/api')


Route.group(() => {
  Route.group(() => {
    Route.post('/device-location', 'DevicesLocationsController.create')
    Route.get('/device-location', 'DevicesLocationsController.show').middleware('auth:api')
  }).prefix('/node-data')
}).prefix('/api-v2')
