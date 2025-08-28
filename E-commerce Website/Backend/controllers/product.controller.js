import { v2 as cloudinary } from 'cloudinary';
import productModel from '../models/product.model.js';

// Function for add product
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestSeller } = req.body;

        const images1 = req.files.image1 && req.files.image1[0];
        const images2 = req.files.image2 && req.files.image2[0];
        const images3 = req.files.image3 && req.files.image3[0];
        const images4 = req.files.image4 && req.files.image4[0];

        const images = [images1, images2, images3, images4].filter((item) => item !== undefined);

        const imageUrls = await Promise.all(
            images.map(async (image) => {
                try {
                    const result = await cloudinary.uploader.upload(image.path, {
                        resource_type: 'image',
                    });
                    return result.secure_url;
                } catch (err) {
                    console.error('Cloudinary upload error:', err);
                    throw err;
                }
            })
        );

        // Save product with imageUrls and date
        const productData = await productModel.create({
            name,
            description,
            price: Number(price),
            category,
            subCategory,
            sizes: JSON.parse(sizes),
            bestSeller: bestSeller === 'true' ? true : false,
            image: imageUrls,
            date: Date.now(),
        });

        const product = new productModel(productData);
        await product.save();

        res
        .status(201)
        .json({
            success: true,
            product: product,
            message: 'Product added successfully',
        });
    } catch (error) {
        console.log(error);
        res
        .status(500)
        .json({
            success: false,
            message: error.message,
        });
    }
};

// Function for list product
const listProduct = async (req, res) => {
    try {
        const products = await productModel.find();
        res
        .status(200)
        .json({
            success: true,
            products: products,
            message: 'Products fetched successfully',
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
            message: 'Failed to fetch products',
        });
    }
};

// Function for removing product
const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id);

        res
        .status(200)
        .json({
            success: true,
            message: 'Product removed successfully',
        });

    }
    catch (error) {
        console.log(error);
        res
        .status(500)
        .json({
            success: false,
            message: error.message,
            message: 'Failed to remove product',
        });
        
    }
};

// Function for single product
const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await productModel.findById(productId);

        res
        .status(200)
        .json({
            success: true,
            product: product,
            message: 'Product fetched successfully',
        });
    }
    catch (error) {
        console.log(error);
        res
        .status(500)
        .json({
            success: false,
            message: error.message,
            message: 'Failed to fetch product',
        });
        
    }
};

export { addProduct, listProduct, removeProduct, singleProduct };
