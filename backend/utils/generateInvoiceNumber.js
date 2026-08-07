const generateInvoiceNumber = () => {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(100 + Math.random() * 900);
  return `INV-${timestamp}-${random}`;
};

module.exports = generateInvoiceNumber;
