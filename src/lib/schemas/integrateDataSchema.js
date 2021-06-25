const schema = {
    properties: {
      body: {
        type: 'object',
        properties: {
            nameTable: {
                type: 'string',
                enum: ['people', 'planets'],
            },
        },
        required: ['nameTable'],
      },
    },
    required: ['body'],
  };
  
  export default schema;