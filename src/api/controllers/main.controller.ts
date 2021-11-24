import { Body, Controller, Get, InternalServerErrorException, Param, Post } from '@nestjs/common'
import { coreContainer } from '../api.module'

@Controller('/spk-domains/api/v0')
export class UserAdmin {

    /**
     * Lists all domains registered with the spk domains system
     */
    @Get('listdomains')
    async listDomains() {

    }
}