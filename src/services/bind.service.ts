import NativeDns from 'native-node-dns'
import { CoreService } from './core.service';

import {consts} from 'native-node-dns-packet'

const {QTYPE_TO_NAME} = consts

export class BindService {
    self: CoreService;
    server: any;
    constructor(self) {
        this.self = self;

        this.handleRequest = this.handleRequest.bind(this)
    }

    async handleRequest(request, response) {
        const name = request.question[0].name;
        const [subdomain, rootName, tld, exTld] = name.split('.');

        if(tld !== 'spk' || exTld !== 'domains') {
            response.send()
            return;
        }

        const arr = await this.self.records.find({
            name: subdomain,
            root_name: rootName
        }).toArray()

        for(let record of arr) {
            //if(request.)
            if(QTYPE_TO_NAME[request.question[0].type] === record.type) {
                response.answer.push(NativeDns.A({
                    name: request.question[0].name,
                    address: record.value,
                    ttl: 600,
                }));
            }
        }

        response.send();
    }

    async start() {
        this.server = NativeDns.createServer()
        
        this.server.on('request', this.handleRequest);
        this.server.serve(15353)
    }
}