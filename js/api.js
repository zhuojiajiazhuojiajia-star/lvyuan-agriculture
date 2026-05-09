// ====== API 地址配置 ======
// 部署时只需要修改这里的地址即可
// 本地开发: http://localhost:3000/api
// Render部署后: https://你的项目名.onrender.com/api
const API_BASE_URL = window.__API_URL__ || 'http://localhost:3000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async request(url, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${url}`, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '请求失败');
      }

      return data;
    } catch (error) {
      console.error('API请求错误:', error);
      throw error;
    }
  }

  // 认证相关
  async register(userData) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  async login(credentials) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async updateProfile(profileData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  async changePassword(passwordData) {
    return this.request('/auth/password', {
      method: 'PUT',
      body: JSON.stringify(passwordData)
    });
  }

  logout() {
    this.clearToken();
  }

  // 商品相关
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/products?${queryString}`);
  }

  async getProductCategories() {
    return this.request('/products/categories');
  }

  async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  // 购物车相关
  async getCart() {
    return this.request('/cart');
  }

  async addToCart(productId, quantity = 1) {
    return this.request('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity })
    });
  }

  async updateCartItem(productId, updates) {
    return this.request(`/cart/update/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  async removeFromCart(productId) {
    return this.request(`/cart/remove/${productId}`, {
      method: 'DELETE'
    });
  }

  async clearCart() {
    return this.request('/cart/clear', {
      method: 'DELETE'
    });
  }

  async selectAllCartItems(selected) {
    return this.request('/cart/select-all', {
      method: 'PUT',
      body: JSON.stringify({ selected })
    });
  }

  // 订单相关
  async getOrders(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/orders?${queryString}`);
  }

  async getOrder(id) {
    return this.request(`/orders/${id}`);
  }

  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  }

  async cancelOrder(id) {
    return this.request(`/orders/${id}/cancel`, {
      method: 'PUT'
    });
  }

  async payOrder(id, paymentMethod) {
    return this.request(`/orders/${id}/pay`, {
      method: 'PUT',
      body: JSON.stringify({ paymentMethod })
    });
  }

  // 评论相关
  async getProductReviews(productId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/reviews/product/${productId}?${queryString}`);
  }

  async createReview(reviewData) {
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData)
    });
  }

  async likeReview(reviewId) {
    return this.request(`/reviews/${reviewId}/like`, {
      method: 'PUT'
    });
  }

  // 订阅相关
  async getSubscription() {
    return this.request('/subscriptions');
  }

  async getSubscriptionPlans() {
    return this.request('/subscriptions/plans');
  }

  async createSubscription(subscriptionData) {
    return this.request('/subscriptions', {
      method: 'POST',
      body: JSON.stringify(subscriptionData)
    });
  }

  async pauseSubscription() {
    return this.request('/subscriptions/pause', {
      method: 'PUT'
    });
  }

  async resumeSubscription() {
    return this.request('/subscriptions/resume', {
      method: 'PUT'
    });
  }

  async updateSubscriptionPreferences(preferences) {
    return this.request('/subscriptions/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences)
    });
  }

  async updateDeliveryDay(deliveryDay) {
    return this.request('/subscriptions/delivery-day', {
      method: 'PUT',
      body: JSON.stringify({ deliveryDay })
    });
  }

  async cancelSubscription() {
    return this.request('/subscriptions', {
      method: 'DELETE'
    });
  }
}

const api = new ApiService();
