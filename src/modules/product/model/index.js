const { DataTypes,} = require('sequelize');
const sequelize = require('../../../configs/db.config');
const Brands = require('../../brand/model');
const products = sequelize.define('product', {
    product_id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    product_Name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    number: {
        type: DataTypes.INTEGER
    },
    image_data: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description:{
        type:DataTypes.STRING,
        allowNull: false
    }
}
);

Brands.hasMany(products, { foreignKey: 'Brand_id' }); // A Brand has many Products
products.belongsTo(Brands, { foreignKey: 'Brand_id' });
module.exports = products;