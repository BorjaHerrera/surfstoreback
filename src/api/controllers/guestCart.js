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

const getGuestCart = async (req, res, next) => {
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

const addGuestCartProduct = async (req, res) => {
  try {
    const { cartId } = req.params;
    const { productId, quantity = 1 } = req.body;

    if (!cartId) {
      return res.status(400).json({ error: 'Se requiere cartId' });
    }

    if (!productId) {
      return res.status(400).json({ error: 'Se requiere productId' });
    }

    const cart = await GuestCart.findById(cartId);

    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();

    return res.status(200).json(cart);
  } catch (error) {
    console.error('Error añadiendo producto al carrito invitado:', error);
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
  deleteGuestCartProduct
};
