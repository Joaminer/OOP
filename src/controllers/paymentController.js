const stripe = require('../config/stripe');

const createCheckoutSession = async (req, res) => {
  const { items } = req.body; // items debería ser un array de objetos con información del producto

  try {
    // Crear una sesión de pago en Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'ars', // Moneda en pesos argentinos
          product_data: {
            name: item.nombre,
          },
          unit_amount: item.precio * 100, // Convertir el precio a centavos
        },
        quantity: item.cantidad,
      })),
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/success`, // URL de éxito
      cancel_url: `${process.env.FRONTEND_URL}/cancel`, // URL de cancelación
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error('Error al crear la sesión de pago:', error);
    res.status(500).json({ error: 'Error al crear la sesión de pago' });
  }
};

module.exports = {
  createCheckoutSession,
};
