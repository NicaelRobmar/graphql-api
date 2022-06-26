const axios = require('axios');
const { knex } = require('./connection');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLFloat,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');

//Tipo genérico de dado instanciado para o GraphQL
OccurrenceType = new GraphQLObjectType({
    name: 'Gereric',
    fields:() => ({
        ID: {type: GraphQLString},
        ANO_BO: {type: GraphQLInt},
        DATAOCORRENCIA: {type: GraphQLString},
        LOGRADOURO: {type: GraphQLString},
        NUMERO: {type: GraphQLInt},
        BAIRRO: {type: GraphQLString},
        LATITUDE: {type: GraphQLFloat},
        LONGITUDE: {type: GraphQLFloat},
    })
});

async function getDataById(id) {
    const result = await knex.select().from('furtos_celular').where('ID', id);
    return result[0];
}

async function getAllData() {
    const result = await knex.select().from('furtos_celular');
    return result;
}

// Root Query para fazer a consulta dos dados
const RootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields:{
        data: {
            type: OccurrenceType,
            args: {
                id: {type: GraphQLString}
            },
            // resolve(parentValue, args){
            //     return axios.get('http://localhost:3000/trechoDeVia/'+ args.id)
            //         .then(resp => resp.data);
            // }
            async resolve(parentValue, args){
                const result = await getDataById(args.id);
                return result;
            }
        },
        dataList: {
            type: new GraphQLList(OccurrenceType),
            // resolve(parentValue, args){
            //     return axios.get('http://localhost:3000/trechoDeVia/')
            //         .then(resp => resp.data);
            // }
            async resolve(parentValue, args){
                const result = await getAllData();
                return result;
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});