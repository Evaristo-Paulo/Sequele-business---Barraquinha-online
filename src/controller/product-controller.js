const Product = require('../models/product-model')
const User = require('../models/user-model')

const get_products = async (req, res) => {
    const products = await Product.find({});

    res.send({
        products
    });
}

const get_create = (req, res) => {
    res.send(req.user)
}

const post_create = async (req, res) => {
    const {
        name,
        category,
        description,
    } = req.body;

    const chef = req.user.id;

    try {
        const user = await User.findById({
            _id: chef
        })

        if (!user) {
            
        }

        const newProduct = new Product();
        newProduct.name = name;
        newProduct.category = category;
        newProduct.slug = name.replace(/ /g, '-');
        newProduct.description = description;
        newProduct.chef = chef;

        const result = await newProduct.save();

        res.send( result )

    } catch (err) {
        console.error('Error saving product ', err)
    }

}

const get_product = async (req, res) => {
    const product = await Product.findById(req.params.id).populate('chef')

    if (product) {
        res.send(product);
    }
}

const delete_product = async (req, res) => {
    const product = await Product.findOneAndDelete(req.params.id)

    if (product) {
        res.send(product);
    }
}

module.exports = {
    get_products,
    get_create,
    post_create,
    get_product,
    delete_product
}