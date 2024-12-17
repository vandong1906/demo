
const { getAll,create,remove,update,getOne, getLimit} = require("../../usecase");
const path=require('path');
const product =require('../../model/index');
const user = require("../../../user/model/user");
async function get(req, res, next) {
    try {
        res.json(await getAll())
    } catch (error) {
        console.log("error",error)
    }
}
async function getProduct(req, res, next) {
    try {
        res.json(await getOne(req.params.id))
    } catch (error) {
        console.log("error",error)
    }
}
async function getLimitProduct(req, res, next) {
    try {
        res.json(await getLimit());
    } catch (error) {
        console.log("error",error)
    }
}



async function createProduct(req,res,next) {
    try {
        console.log(req.files.file);
        const imageFile = req.files.file;
        console.log(imageFile);
       const flag=await create(req.body,imageFile);
       if(flag){
        res.status(200).send("succes");
       }
       
    } catch (error) {
        console.log("error",error)
    }
}
async function updateProduct(req,res,next) {
    try {
        res.json(await update(req.params.id,req.body))
    } catch (error) {
        console.log("error",error)
    }
}
async function removeProduct(req,res,next) {
    try {
        res.json(await remove(req.params.id))
    } catch (error) {
        console.log("error",error)
    }
}
const getProductsWithPagination = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;
    const offset = (page - 1) * size;

    try {

        const products = await product.findAndCountAll({
            limit: size,
            offset: offset,
            order: [['createdAt', 'DESC']],
        });
        res.status(200).json({
            total: products.count,
            pages: Math.ceil(products.count / size),
            currentPage: page,
            products: products.rows,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
module.exports={
    get,
    createProduct,
    updateProduct,
    removeProduct,
    getProduct,
getLimitProduct,
    getProductsWithPagination}