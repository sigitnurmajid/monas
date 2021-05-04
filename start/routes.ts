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
import Config from '@ioc:Adonis/Core/Config'

Route.group(()=>{
  Route.post('/register', 'AuthController.register').as('auth.signup')
  Route.post('/login', 'AuthController.login').as('auth.login')
  Route.post('/logout', 'AuthController.logout').as('auth.logout')
}).prefix('user')

Route.get('/dashboard', ()=>{
  return Config.get('telegram')
})
Route.get('/telegram', 'AuthController.telegram')

Route.resource('/posts', 'PostsController')