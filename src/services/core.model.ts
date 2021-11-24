

interface nameRegistration {

    name: string; //Example huge-dead-curved-ab31.gws.spk.domains
    created_by: string; //did:key of creator 
    created_at: Date; //When the domain was registered
    roles: string[]; // List of primary roles this domain is for

    root_name: string;

    pub_meta: {
        geo_loc?: string //GPS coordinates of the node registered 
    }
    user_debug: {
        register_ip: string //The IP address of the registration node    
    }

}

interface nameRecord {
    name: string;
    root_name: string;

    type: string;
    //ttl?: number //Is this needed? Mostly going to be hard coded for now

    value: string; //127.0.0.1, etc

    created_at: Date
}