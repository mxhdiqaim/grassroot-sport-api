import {matches} from "../schema/match-schema.ts";

const relations = {};

const schema = {
    ...matches,

    ...relations,
    
};

export default schema;