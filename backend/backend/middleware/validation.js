const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: '验证失败',
      errors: errors.array()
    });
  }
  next();
};

const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('用户名长度必须在3-20个字符之间'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('请输入有效的邮箱地址'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('密码长度至少为6个字符'),
  body('phone')
    .optional()
    .isMobilePhone('zh-CN')
    .withMessage('请输入有效的手机号码'),
  handleValidationErrors
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('请输入有效的邮箱地址'),
  body('password')
    .notEmpty()
    .withMessage('请输入密码'),
  handleValidationErrors
];

const cartValidation = [
  body('productId')
    .notEmpty()
    .withMessage('商品ID不能为空'),
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('数量必须大于0'),
  handleValidationErrors
];

const orderValidation = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('订单必须包含至少一个商品'),
  body('shippingAddress')
    .isObject()
    .withMessage('请提供收货地址'),
  body('shippingAddress.name')
    .notEmpty()
    .withMessage('请提供收货人姓名'),
  body('shippingAddress.phone')
    .notEmpty()
    .withMessage('请提供收货人电话'),
  body('shippingAddress.detail')
    .notEmpty()
    .withMessage('请提供详细地址'),
  handleValidationErrors
];

const reviewValidation = [
  body('productId')
    .notEmpty()
    .withMessage('商品ID不能为空'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('评分必须在1-5之间'),
  body('content')
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage('评论内容长度必须在5-500个字符之间'),
  handleValidationErrors
];

module.exports = {
  registerValidation,
  loginValidation,
  cartValidation,
  orderValidation,
  reviewValidation
};
