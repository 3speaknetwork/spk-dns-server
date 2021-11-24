import { MongoClient, Db, Collection } from 'mongodb'
import { ConfigService } from './config.service'
import { BindService } from './bind.service'

export class CoreService {
    db: Db
    names: Collection
    records: Collection
    bindService: BindService

    constructor(public readonly mongoClient: MongoClient) {
        this.db = this.mongoClient.db(ConfigService.getConfig().mongoDatabaseName)
        
    }

    async start() {
        this.names = this.db.collection("names")
        this.records = this.db.collection('records')

        this.bindService = new BindService(this)

        this.bindService.start()
    }
}
