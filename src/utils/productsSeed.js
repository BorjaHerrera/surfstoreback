require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const Category = require('../api/models/categories');
const Product = require('../api/models/products');
const { uploadImageToCloudinary } = require('./cloudinaryUpload');
const { configCloudinary } = require('../config/cloudinary');

const DB_URL = process.env.DB_URL;

configCloudinary();

const normalize = (text) => text.toLowerCase().replace(/[^a-z0-9]/g, '');

const productsSeed = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log('Conectado a MongoDB');

    const products = [];

    await new Promise((resolve, reject) => {
      fs.createReadStream('./src/data/products.csv')
        .pipe(
          csv({
            separator: ';',
            mapHeaders: ({ header }) => {
              let h = header;
              h = h.replaceAll(' ', '_');
              h = h.replaceAll('º', '');
              h = h.replaceAll('ó', 'o');
              return h.toLowerCase();
            }
          })
        )
        .on('data', (row) => {
          console.log('Fila leída:', row);
          products.push(row);
        })
        .on('error', (error) => {
          reject(error);
        })
        .on('end', () => {
          console.log('CSV leído, procesando productos...');
          console.log('Primer producto leído:', products[0]);
          resolve();
        });
    });

    for (const productData of products) {
      const sectionRaw = productData.section
        ? productData.section.trim()
        : null;
      const sectionNormalized = sectionRaw ? normalize(sectionRaw) : null;

      console.log(
        `Buscando categoría para sección: "${sectionNormalized}", producto: "${productData.name}"`
      );

      if (!sectionNormalized) {
        console.log(`Sección vacía para producto: ${productData.name}`);
        continue;
      }

      const category = await Category.findOne({
        normalizedName: sectionNormalized
      });

      if (!category) {
        console.log(
          `Categoría no encontrada para producto: ${productData.name} con sección: "${sectionNormalized}"`
        );
        continue;
      }

      let imageUrl;
      try {
        imageUrl = await uploadImageToCloudinary(productData.image);
      } catch (error) {
        console.error(`Error subiendo imagen para ${productData.name}:`, error);
        continue;
      }

      const newProduct = new Product({
        name: productData.name,
        description: productData.description,
        price: parseFloat(productData.price.replace(',', '.')),
        brand: productData.brand,
        style: productData.style || null,
        gender: productData.gender || null,
        image: imageUrl,
        section: category._id
      });

      try {
        await newProduct.save();
        console.log(`Producto creado: ${productData.name}`);
      } catch (error) {
        console.error(`Error guardando producto ${productData.name}:`, error);
      }
    }
  } catch (error) {
    console.error('Error en productsSeed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Desconectado de la base de datos.');
  }
};

productsSeed();
