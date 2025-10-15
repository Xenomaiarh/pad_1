const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class ValidationError extends Error {
  constructor(message, field = null) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

const orderValidation = {
  validateEmail: (email) => {
    if (!email || typeof email !== 'string') {
      throw new ValidationError('Email is required', 'email');
    }

    const trimmedEmail = email.trim().toLowerCase();

    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /data:/i,
    ];

    if (suspiciousPatterns.some(pattern => pattern.test(trimmedEmail))) {
      throw new ValidationError('Email contains invalid characters', 'email');
    }

    if (trimmedEmail.length > 254) {
      throw new ValidationError('Email must be less than 254 characters', 'email');
    }

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (!emailRegex.test(trimmedEmail)) {
      throw new ValidationError('Invalid email format', 'email');
    }

    return trimmedEmail;
  },

  validateName: (name, fieldName = 'name') => {
    if (!name || typeof name !== 'string') {
      throw new ValidationError(`${fieldName} is required`, fieldName);
    }

    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
      throw new ValidationError(`${fieldName} must be at least 2 characters`, fieldName);
    }

    if (trimmedName.length > 50) {
      throw new ValidationError(`${fieldName} must be less than 50 characters`, fieldName);
    }

    const dangerousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /data:/i,
      /<\w+[^>]*>/,
    ];

    if (dangerousPatterns.some(pattern => pattern.test(trimmedName))) {
      throw new ValidationError(`${fieldName} contains invalid characters`, fieldName);
    }

    if (!/^[\p{L}\p{M}\s\-'.]+$/u.test(trimmedName)) {
      throw new ValidationError(`${fieldName} contains invalid characters`, fieldName);
    }

    return trimmedName;
  },

  validatePhone: (phone) => {
    if (!phone || typeof phone !== 'string') {
      throw new ValidationError('Phone number is required', 'phone');
    }

    const cleanedPhone = phone.replace(/[^0-9+\-\(\)\s]/g, '');

    if (cleanedPhone.length < 10) {
      throw new ValidationError('Phone number must be at least 10 digits', 'phone');
    }

    if (cleanedPhone.length > 20) {
      throw new ValidationError('Phone number must be less than 20 characters', 'phone');
    }

    return cleanedPhone;
  },

  validateAddress: (address, fieldName = 'address') => {
    if (!address || typeof address !== 'string') {
      throw new ValidationError(`${fieldName} is required`, fieldName);
    }

    const trimmedAddress = address.trim();
    const minLength = fieldName === 'apartment' ? 1 : 5;

    if (trimmedAddress.length < minLength) {
      throw new ValidationError(`${fieldName} must be at least ${minLength} characters`, fieldName);
    }

    if (trimmedAddress.length > 200) {
      throw new ValidationError(`${fieldName} must be less than 200 characters`, fieldName);
    }

    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /data:/i,
    ];

    if (suspiciousPatterns.some(pattern => pattern.test(trimmedAddress))) {
      throw new ValidationError(`${fieldName} contains invalid characters`, fieldName);
    }

    return trimmedAddress;
  },

  validatePostalCode: (postalCode) => {
    if (!postalCode || typeof postalCode !== 'string') {
      throw new ValidationError('Postal code is required', 'postalCode');
    }

    const trimmedCode = postalCode.trim();

    if (trimmedCode.length < 3) {
      throw new ValidationError('Postal code must be at least 3 characters', 'postalCode');
    }

    if (trimmedCode.length > 20) {
      throw new ValidationError('Postal code must be less than 20 characters', 'postalCode');
    }

    return trimmedCode;
  },

  validateTotal: (total) => {
    if (total === null || total === undefined) {
      throw new ValidationError('Total amount is required', 'total');
    }

    const numTotal = parseFloat(total);

    if (isNaN(numTotal)) {
      throw new ValidationError('Total must be a valid number', 'total');
    }

    if (numTotal <= 0) {
      throw new ValidationError('Total must be greater than 0', 'total');
    }

    if (numTotal > 999999.99) {
      throw new ValidationError('Total amount is too large', 'total');
    }

    return Math.round(numTotal * 100) / 100;
  },

  validateStatus: (status) => {
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!status || typeof status !== 'string') {
      throw new ValidationError('Order status is required', 'status');
    }

    if (!validStatuses.includes(status.toLowerCase())) {
      throw new ValidationError(`Invalid order status. Must be one of: ${validStatuses.join(', ')}`, 'status');
    }

    return status.toLowerCase();
  }
};

const validateOrderData = (orderData) => {
  const errors = [];
  const validatedData = {};

  const safeValidate = (validationFn, value, fieldName) => {
    try {
      return validationFn(value, fieldName);
    } catch (error) {
      if (error instanceof ValidationError) {
        errors.push({ field: error.field, message: error.message });
        return null;
      } else {
        errors.push({ field: fieldName, message: 'Validation error occurred' });
        return null;
      }
    }
  };

  validatedData.name = safeValidate(orderValidation.validateName, orderData.name, 'name');
  validatedData.lastname = safeValidate(orderValidation.validateName, orderData.lastname, 'lastname');
  validatedData.email = safeValidate(orderValidation.validateEmail, orderData.email, 'email');
  validatedData.phone = safeValidate(orderValidation.validatePhone, orderData.phone, 'phone');
  validatedData.company = safeValidate(orderValidation.validateAddress, orderData.company, 'company');
  validatedData.adress = safeValidate(orderValidation.validateAddress, orderData.adress, 'address');
  validatedData.apartment = safeValidate(orderValidation.validateAddress, orderData.apartment, 'apartment');
  validatedData.city = safeValidate(orderValidation.validateAddress, orderData.city, 'city');
  validatedData.country = safeValidate(orderValidation.validateAddress, orderData.country, 'country');
  validatedData.postalCode = safeValidate(orderValidation.validatePostalCode, orderData.postalCode, 'postalCode');
  validatedData.total = safeValidate(orderValidation.validateTotal, orderData.total, 'total');
  validatedData.status = safeValidate(orderValidation.validateStatus, orderData.status || 'pending', 'status');

  validatedData.orderNotice = orderData.orderNotice
      ? orderData.orderNotice.trim().substring(0, 500)
      : '';

  return {
    isValid: errors.length === 0,
    errors,
    validatedData
  };
};

module.exports = {
  ValidationError,
  orderValidation,
  validateOrderData
};
