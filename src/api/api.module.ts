import { NestFactory } from '@nestjs/core'
import { Module } from '@nestjs/common'

import { UserAdmin } from './controllers/useradmin.controller'
import { CoreService } from '../services/core.service'

export const coreContainer: { self:CoreService } = {} as any

@Module({
    imports: [],
    controllers: [UserAdmin],
    providers: [],
})
class ControllerModule {}


export class ApiModule {
    instance: CoreService
    public async listen(instance:CoreService) {
        this.instance = instance;
        coreContainer.self = instance;
        const app = await NestFactory.create(ControllerModule)

        /*const swaggerconfig = new DocumentBuilder().setTitle('SPK Indexer CDN Daemon').build()
        const swaggerDocument = SwaggerModule.createDocument(app, swaggerconfig)
        SwaggerModule.setup('swagger', app, swaggerDocument)*/

        await app.listen(28080)
    }
}