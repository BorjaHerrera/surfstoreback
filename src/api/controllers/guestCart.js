const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const GuestCart = require('../models/guestCart');

const createGuestCart = async (req, res) => {
  try {
    const newCart = new GuestCart({ items: [] });
    await newCart.save();
    return res.status(201).json({ cartId: newCart._id });
  } catch (error) {
    console.error('Error creando carrito invitado:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const getGuestCart = async (req, res) => {
  try {
    const { cartId } = req.params;

    if (!cartId) {
      return res.status(400).json({ error: 'Se requiere cartId' });
    }

    const cart = await GuestCart.findById(cartId).populate('items.product');
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    return res.status(200).json(cart);
  } catch (error) {
    console.error('Error al obtener el carrito de invitado:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Añadir producto al carrito de invitado
const addGuestCartProduct = async (req, res) => {
  try {
    const { cartId } = req.params;
    const { productId, quantity = 1 } = req.body;

    if (!cartId || !productId) {
      return res.status(400).json({ error: 'Se requiere cartId y productId' });
    }

    const cart = await GuestCart.findById(cartId);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    const qty = Number(quantity);
    const prodId = new ObjectId(productId);

    // Log para depuración
    console.log('Añadiendo producto:', { cartId, productId, qty });

    const existingItem = cart.items.find(
      (item) => String(item.product) === String(prodId)
    );

    if (existingItem) {
      existingItem.quantity += qty;
    } else {
      cart.items.push({ product: prodId, quantity: qty });
    }

    await cart.save();
    await cart.populate('items.product');

    // Log para ver el estado del carrito tras añadir
    console.log('Carrito tras añadir:', cart.items);

    return res.status(200).json(cart);
  } catch (error) {
    console.error('Error añadiendo producto al carrito invitado:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Actualizar cantidad de producto en carrito de invitado
const updateGuestCartQuantity = async (req, res) => {
  try {
    const { cartId, productId } = req.params;
    let { quantity } = req.body;

    if (!cartId || !productId || quantity == null) {
      return res
        .status(400)
        .json({ error: 'Faltan cartId, productId o quantity' });
    }

    quantity = Number(quantity);
    const prodId = new ObjectId(productId);

    const cart = await GuestCart.findById(cartId);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    // Logs para depuración
    console.log('Items en el carrito:', cart.items);
    console.log('productId recibido:', productId);
    console.log(
      'Comparando con:',
      cart.items.map((i) => i.product.toString())
    );

    const item = cart.items.find((i) => String(i.product) === String(prodId));

    if (!item) {
      return res
        .status(404)
        .json({ error: 'Producto no encontrado en el carrito' });
    }

    item.quantity = quantity;
    await cart.save();
    await cart.populate('items.product');

    // Log para ver el estado del carrito tras actualizar
    console.log('Carrito tras actualizar:', cart.items);

    return res.status(200).json(cart);
  } catch (error) {
    console.error('Error actualizando cantidad:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};
const deleteGuestCartProduct = async (req, res) => {
  try {
    const { cartId, productId } = req.params;

    if (!cartId || !productId) {
      return res.status(400).json({ error: 'Faltan cartId o productId' });
    }

    const cart = await GuestCart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    // Filtra los items para eliminar el que coincida con productId
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    return res.status(200).json(cart);
  } catch (error) {
    console.error('Error eliminando producto del carrito:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  createGuestCart,
  getGuestCart,
  addGuestCartProduct,
  updateGuestCartQuantity,
  deleteGuestCartProduct
};
