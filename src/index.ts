import { MongoClient } from 'mongodb'
import {ApiModule} from './api/api.module'
import { ConfigService } from './services/config.service'
import {CoreService} from './services/core.service'


async function startup(): Promise<void> {
  console.log(`startup`)
  const MONGO_HOST = ConfigService.getConfig().mongoHost
  const url = `mongodb://${MONGO_HOST}`
  const mongo = new MongoClient(url)
  await mongo.connect()
  const instance = new CoreService(mongo);

  instance.start()
  const api = new ApiModule()
  api.listen(instance)
}

void startup()

process.on('unhandledRejection', (error: Error) => {
  console.log('unhandledRejection', error.message)
})
