import { Body, Controller, Get, InternalServerErrorException, Param, Post } from '@nestjs/common'
import { coreContainer } from '../api.module'
import { DID } from 'dids'
import KeyResolver from 'key-did-resolver'
import { generateSlug, totalUniqueSlugs } from "random-word-slugs";



const resolver = new DID({  resolver: KeyResolver.getResolver() })
    resolver.verifyJWS

@Controller('/spk-domains/api/v0')
export class UserAdmin {

    @Post('register')
    async registerName(@Body() postBody) {

        const jwsData = await resolver.verifyJWS(postBody.jws)
        const {payload, kid} = jwsData
        const [did] = kid.split('#')

        if(payload.action !== "register") {
            return {fail: true}
        }

        const nameDoc = await coreContainer.self.names.findOne({
            created_by: did
        });

        
        if(nameDoc) {
            return {
                error: 'You have already registered a domain'
            }
        }


        let domainRecord = {
            created_by: did,
            created_at: new Date(),
            root_name: 'gws', //Everything gws for the forseeable future.
            name: generateSlug(4)
        }

        await coreContainer.self.names.insertOne(domainRecord)

        const initialRecords = payload.initialRecords;

        if(initialRecords) {

            if(initialRecords['A']) {
                await coreContainer.self.records.insertOne({
                    name: domainRecord.name,
                    root_name: domainRecord.root_name,
                    type: 'A',
                    value: initialRecords['A'],
                    created_at: new Date()
                })
            }

            if(initialRecords['AAAA']) {
                await coreContainer.self.records.insertOne({
                    name: domainRecord.name,
                    root_name: domainRecord.root_name,
                    type: 'AAAA',
                    value: initialRecords['AAAA'],
                    created_at: new Date()
                })
            }
        }

        return {success: true, name:`${domainRecord.name}.${domainRecord.root_name}.spk.domains`}
    }

    @Post('deletedomain')
    async deletedomain(@Body() postBody) {
        

    }

    @Post('setrecord')
    async setRecord(@Body() postBody) {
        const jwsData = await resolver.verifyJWS(postBody.jws)
        const {payload, kid} = jwsData
        const [did] = kid.split('#')

        if(payload.action !== "setRecord") {
            return {fail: true}
        }

        const nameDoc = await coreContainer.self.names.findOne({
            created_by: did
        });

        
        if(!nameDoc) {
            return {
                error: 'Domain does not exist'
            }
        }

        await coreContainer.self.records.findOneAndUpdate({
            name: nameDoc.name,
            root_name: nameDoc.root_name,
            type: payload.type,
        }, {
            $set: {
                value: payload.value
            }
        }, {
            upsert: true
        })
    }

    @Post('rmrecord')
    async rmrecord(@Body() postBody) {

    }
    
    /**
     * Resolves an ed25519 did key --> assigned domain
     * @param domain 
     */
    @Get('resolvedomain/:key')
    async getDomain(@Param('key') domain) {

    }

}