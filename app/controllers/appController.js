
const knex_connection = require('../database/connection');

module.exports = {

    async getGeomData(req, res){
        try{   
            let json = [];

            const properties = await knex_connection
            .select('objectid',
                    knex_connection.raw('geometry::STGeomFromText(shape.STAsText(), 4326) as shape'))
            .from('MUNICIPIOS')
            .whereNotNull('shape');
            
            properties.forEach(function (property) {
                json.push({
                    type: 'Feature',
                    properties:{
                        ID: property.objectid
                    },
                    geometry: {
                        type: 'Polygon',
                        coordinates: [[...property.shape.points].map((point) => [point.x, point.y])]
                    }
                });
                
            });

            res.status(200).json({ "type": "FeatureCollection", "features":json });

        }catch(err){
            res.status(400).json({ message: err.message, type: "erro" });
        }
    }
    
}