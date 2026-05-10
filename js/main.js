/* ============================================================
 *  绿源农业 v2 — Vue 3 CDN + Vue Router 多页面应用
 *  农业电商风格，白底绿色主题
 *  新增模块：翻译系统、购物车、用户认证、主题切换、语言切换、Vue Router
 * ============================================================ */

const { createApp, ref, reactive, computed, onMounted, onUnmounted, nextTick, provide, inject } = Vue;
const { createRouter, createWebHashHistory } = VueRouter;

// ========== 页面组件定义 ==========

// ========== 首页组件 ==========
const HomePage = {
  template: `
    <div>
      <!-- Hero -->
      <section id="hero" class="hero">
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <h1 class="hero-title">{{ state.isChinese ? '从田间到餐桌' : 'From Farm to Table' }}<br>{{ state.isChinese ? '只做看得见的放心好粮' : 'Only Trustworthy Organic Food' }}</h1>
          <p class="hero-subtitle">{{ state.isChinese ? '扎根北京郊区 25 年，坚持生态种植，给你小时候的粮食味道' : 'Based in Beijing suburbs for 25 years, committed to ecological farming, the taste of childhood grains' }}</p>
          <div class="hero-buttons">
            <router-link to="/products" class="btn-primary">{{ state.isChinese ? '查看我们的有机农场' : 'Visit Our Organic Farm' }}</router-link>
            <router-link to="/contact" class="btn-outline">{{ state.isChinese ? '获取有机农产品报价' : 'Get a Quote' }}</router-link>
          </div>
        </div>
      </section>
      <!-- 特色服务 -->
      <section class="section">
        <div class="container">
          <div class="feature-grid">
            <article v-for="feature in displayFeatures" :key="feature.title" class="feature-card fade-in">
              <div class="feature-icon"><i :class="feature.icon"></i></div>
              <h3>{{ feature.displayTitle }}</h3>
              <p>{{ feature.displayDesc }}</p>
            </article>
          </div>
        </div>
      </section>
      <!-- 关于我们 -->
      <section id="about" class="section section-alt">
        <div class="container">
          <div class="about-grid">
            <div class="about-images fade-in">
              <img class="about-img-main" src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&q=80" alt="绿源农业有机农场">
              <img class="about-img-sub" src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=300&q=80" alt="有机蔬菜种植">
            </div>
            <div class="about-content fade-in">
              <h2>{{ state.isChinese ? '关于' : 'About' }}<span>{{ state.isChinese ? '绿源农业' : 'Green Source' }}</span></h2>
              <p class="about-desc">{{ state.isChinese ? '2000年，我们在北京郊外承包了第一块地，开始尝试不打药、不上化肥的种地方式。那时候村里人都觉得我们傻。25年过去了，这片地从最初的50亩扩展到了3000亩，合作农户超过200家。我们不做大，只做对——每一颗菜都能追溯到是哪块地、谁种的、什么时候摘的。' : "In 2000, we leased our first plot in suburban Beijing and started farming without pesticides or chemical fertilizers. The villagers thought we were foolish. 25 years later, that land has grown from 50 mu to 3,000 mu, with over 200 partner farming families. We don't aim to be the biggest — we aim to do it right. Every vegetable can be traced back to the exact field, the farmer who grew it, and the day it was harvested." }}</p>
              <div class="about-features">
                <div class="about-feature-item">
                  <span class="about-feature-icon"><i class="fa-solid fa-circle-check"></i></span>
                  <span>{{ state.isChinese ? '100% 有机认证，全程可追溯' : '100% Organic Certified, Fully Traceable' }}</span>
                </div>
                <div class="about-feature-item">
                  <span class="about-feature-icon"><i class="fa-solid fa-wheat-awn"></i></span>
                  <span>{{ state.isChinese ? '自建有机农场，严格品质管控' : 'Self-owned Farm, Strict Quality Control' }}</span>
                </div>
              </div>
              <router-link to="/products" class="btn-primary">{{ state.isChinese ? '查看产品' : 'View Products' }}</router-link>
              <div class="about-stats">
                <div class="about-stat">
                  <span class="about-stat-number count-up" data-target="25" data-suffix="+">0+</span>
                  <span class="about-stat-label">{{ state.isChinese ? '年行业经验' : 'Years of Experience' }}</span>
                </div>
                <div class="about-stat">
                  <span class="about-stat-number count-up" data-target="100" data-suffix="%">0%</span>
                  <span class="about-stat-label">{{ state.isChinese ? '有机认证' : 'Organic Certified' }}</span>
                </div>
                <div class="about-stat">
                  <span class="about-stat-number count-up" data-target="500" data-suffix="+">0+</span>
                  <span class="about-stat-label">{{ state.isChinese ? '合作伙伴' : 'Partners' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- 创始人说 -->
      <section id="founder" class="section founder-section">
        <div class="container">
          <div class="founder-card">
            <div class="founder-avatar">
              <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80" alt="张明远">
            </div>
            <div class="founder-content">
              <div class="founder-quote-icon"><i class="fa-solid fa-quote-left"></i></div>
              <p class="founder-text">{{ state.isChinese ? "2000年承包第一块地的时候，村里人都说我们傻——不打药不上化肥，菜长得又小又丑，卖给谁？我说不急，先养地。养了三年，土壤活了，虫子少了，种出来的东西自己吃着都觉得不一样。现在回头看，当初那股傻劲儿是对的。做农业没有捷径，你得对得起这片土地。" : "When we leased our first plot of land in 2000, the villagers all said we were foolish — no pesticides, no chemical fertilizers, the vegetables were small and ugly, who would buy them? I said do not worry, we should nourish the soil first. After three years, the soil came alive, pests diminished, and even we could taste the difference. Looking back now, that foolishness was right. There are no shortcuts in farming — you must honor the land." }}</p>
              <div class="founder-info">
                <span class="founder-name">{{ state.isChinese ? '张明远' : 'Zhang Mingyuan' }}</span>
                <span class="founder-title">{{ state.isChinese ? '绿源农业创始人 · 种了25年地的农民' : 'Founder of Green Source · A farmer for 25 years' }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- 产品展示 -->
      <section id="products" class="section">
        <div class="container">
          <h2 class="section-title">{{ state.isChinese ? '我们的' : 'Our' }}<span>{{ state.isChinese ? '有机产品' : 'Organic Products' }}</span></h2>
          <p class="section-subtitle">{{ state.isChinese ? '精选优质有机农产品，从农场直达您的餐桌' : 'Premium organic produce, farm to table' }}</p>
          <div class="products-grid">
            <article v-for="product in displayProducts" :key="product.id" class="product-card">
              <div class="product-img-wrap"
                @mouseenter="hoveredImage[product.id] = 1"
                @mouseleave="hoveredImage[product.id] = 0">
                <img :src="(product.images && product.images[hoveredImage[product.id] || 0]) || product.image" :alt="product.displayName">
                <div class="product-img-dots" v-if="product.images && product.images.length > 1">
                  <span v-for="(img, idx) in product.images" :key="idx"
                    class="dot" :class="{ active: (hoveredImage[product.id] || 0) === idx }"
                    @mouseenter.stop="hoveredImage[product.id] = idx"></span>
                </div>
              </div>
              <div class="product-info">
                <h4 class="product-name">{{ product.displayName }}</h4>
                <p class="product-desc">{{ product.displayDesc }}</p>
                <div class="product-price">
                  <span class="current">&yen;{{ (product.price || 0).toFixed(1) }}</span>
                  <span class="original">&yen;{{ (product.originalPrice || 0).toFixed(1) }}</span>
                </div>
                <button class="product-cart-btn" @click="addToCart(product)"><i class="fa-solid fa-cart-plus"></i> {{ state.isChinese ? '加入购物车' : 'Add to Cart' }}</button>
              </div>
            </article>
          </div>
        </div>
      </section>
      <!-- 促销横幅 -->
      <section class="promo-section">
        <div class="container">
          <div class="promo-grid">
            <div class="promo-card promo-green fade-in">
              <h3>{{ state.isChinese ? '新人首单立减20元' : 'New User: ¥20 Off First Order' }}</h3>
              <p>{{ state.isChinese ? '注册成为会员，首次下单即可享受优惠' : 'Register as a member, enjoy discounts on your first order' }}</p>
              <router-link to="/products" class="btn-white">{{ state.isChinese ? '立即选购' : 'Shop Now' }}</router-link>
            </div>
            <div class="promo-card promo-orange fade-in">
              <h3>{{ state.isChinese ? '每周蔬菜套餐 订阅享9折' : 'Weekly Veggie Box — 10% Off Subscription' }}</h3>
              <p>{{ state.isChinese ? '当季有机蔬菜搭配，每周新鲜配送到家' : 'Seasonal organic veggies delivered weekly to your door' }}</p>
              <router-link to="/contact" class="btn-white">{{ state.isChinese ? '了解详情' : 'Learn More' }}</router-link>
            </div>
          </div>
        </div>
      </section>
      <!-- 服务展示 -->
      <section id="services" class="section section-alt">
        <div class="container">
          <h2 class="section-title">{{ state.isChinese ? '我们的' : 'Our' }}<span>{{ state.isChinese ? '服务' : 'Services' }}</span></h2>
          <p class="section-subtitle">{{ state.isChinese ? '全方位农业服务，满足您的多样化需求' : 'Comprehensive agricultural services for all your needs' }}</p>
          <div class="services-grid">
            <div v-for="service in displayServices" :key="service.title" class="service-card fade-in">
              <img :src="service.image" :alt="service.displayTitle">
              <div class="service-card-overlay"><h4>{{ service.displayTitle }}</h4></div>
            </div>
          </div>
        </div>
      </section>
      <!-- 项目案例 -->
      <section id="projects" class="section">
        <div class="container">
          <h2 class="section-title">{{ state.isChinese ? '探索' : 'Explore' }}<span>{{ state.isChinese ? '项目' : 'Projects' }}</span></h2>
          <p class="section-subtitle">{{ state.isChinese ? '了解我们的核心农业项目与成果' : 'Discover our core agricultural projects and achievements' }}</p>
          <div class="projects-grid">
            <div v-for="project in displayProjects" :key="project.title" class="project-card fade-in">
              <img :src="project.image" :alt="project.displayTitle">
              <div class="project-card-overlay"><h4>{{ project.displayTitle }}</h4></div>
            </div>
          </div>
        </div>
      </section>
      <!-- 团队 -->
      <section id="team" class="section section-alt">
        <div class="container">
          <h2 class="section-title">{{ state.isChinese ? '认识我们的' : 'Meet Our' }}<span>{{ state.isChinese ? '团队' : 'Team' }}</span></h2>
          <p class="section-subtitle">{{ state.isChinese ? '专业团队，用心服务每一位客户' : 'Professional team dedicated to every customer' }}</p>
          <div class="team-grid">
            <div v-for="member in displayTeam" :key="member.name" class="team-card fade-in">
              <img :src="member.avatar" :alt="member.displayName">
              <h4>{{ member.displayName }}</h4>
              <p class="team-role">{{ member.displayRole }}</p>
            </div>
          </div>
        </div>
      </section>
      <!-- 客户评价 -->
      <section id="testimonials" class="section">
        <div class="container">
          <h2 class="section-title">{{ state.isChinese ? '客户' : 'Customer' }}<span>{{ state.isChinese ? '评价' : 'Testimonials' }}</span></h2>
          <p class="section-subtitle">{{ state.isChinese ? '听听我们的客户怎么说' : 'What our customers say' }}</p>
          <div class="testimonials-grid">
            <div v-for="item in displayTestimonials" :key="item.name" class="testimonial-card fade-in">
              <div class="testimonial-stars">
                <span v-for="n in 5" :key="n" :class="n <= item.stars ? 'fa-solid fa-star' : 'fa-regular fa-star'" style="color: #F59E0B;"></span>
              </div>
              <p class="testimonial-text">"{{ item.displayText }}"</p>
              <div class="testimonial-author">
                <img :src="item.avatar" :alt="item.displayName">
                <span class="testimonial-name">{{ item.displayName }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- 新闻资讯 -->
      <section id="news" class="section section-alt">
        <div class="container">
          <h2 class="section-title">{{ state.isChinese ? '最新' : 'Latest' }}<span>{{ state.isChinese ? '资讯' : 'News' }}</span></h2>
          <p class="section-subtitle">{{ state.isChinese ? '了解绿源农业的最新动态' : 'Stay updated with Green Source' }}</p>
          <div class="news-grid">
            <div v-for="item in displayNews" :key="item.title" class="news-card fade-in">
              <div class="news-card-img">
                <img :src="item.image" :alt="item.displayTitle">
              </div>
              <div class="news-card-body">
                <p class="news-card-date">{{ item.date }}</p>
                <h4 class="news-card-title">{{ item.displayTitle }}</h4>
                <p class="news-card-desc">{{ item.displayDesc }}</p>
                <a href="javascript:void(0)" class="news-card-link" @click.prevent>{{ state.isChinese ? '阅读更多' : 'Read More' }} &rarr;</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  inject: ['state', 'displayFeatures', 'displayProducts', 'displayServices', 'displayProjects', 'displayTeam', 'displayTestimonials', 'displayNews', 'addToCart'],
  data() { return { hoveredImage: {} }; },
  mounted() {
    this.$nextTick(() => {
      this.initCountUp();
    });
  },
  methods: {
    initScrollAnimations() {
      // 已禁用渐入动画，内容直接显示
    },
    initCountUp() {
      const counters = this.$el.querySelectorAll('.count-up');
      if (counters.length === 0) return;
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      counters.forEach(el => observer.observe(el));
    },
    animateCounter(el) {
      const target = parseInt(el.getAttribute('data-target'), 10) || 0;
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 2000;
      let startTime = null;
      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target + suffix;
        }
      };
      requestAnimationFrame(step);
    },
  },
};

// ========== 产品页组件 ==========
const ProductsPage = {
  template: `
    <div class="sub-page">
      <section class="sub-page-hero" style="background: linear-gradient(135deg, #1a2e1a 0%, #2d5a27 100%);">
        <div class="container" style="text-align:center;padding:80px 20px;">
          <h1 style="color:#fff;font-size:36px;margin-bottom:12px;">{{ state.isChinese ? '有机产品' : 'Organic Products' }}</h1>
          <p style="color:#c8e6c9;font-size:16px;">{{ state.isChinese ? '从田间到餐桌，每一份都是大自然的馈赠' : "From farm to table, every product is nature's gift" }}</p>
        </div>
      </section>
      <section class="section">
        <div class="container">
          <div class="product-category-tabs">
            <button :class="{ active: currentCategory === 'all' }" @click="setCategory('all')">{{ state.isChinese ? '全部' : 'All' }}</button>
            <button :class="{ active: currentCategory === 'vegetable' }" @click="setCategory('vegetable')">{{ state.isChinese ? '新鲜蔬菜' : 'Fresh Vegetables' }}</button>
            <button :class="{ active: currentCategory === 'fruit' }" @click="setCategory('fruit')">{{ state.isChinese ? '有机水果' : 'Organic Fruits' }}</button>
            <button :class="{ active: currentCategory === 'grain' }" @click="setCategory('grain')">{{ state.isChinese ? '优质谷物' : 'Premium Grains' }}</button>
            <button :class="{ active: currentCategory === 'dairy' }" @click="setCategory('dairy')">{{ state.isChinese ? '乳制品' : 'Dairy Products' }}</button>
          </div>
          <div class="products-grid">
            <article v-for="product in filteredByCategory" :key="product.id" class="product-card">
              <div class="product-img-wrap"
                @mouseenter="hoveredImage[product.id] = 1"
                @mouseleave="hoveredImage[product.id] = 0">
                <img :src="(product.images && product.images[hoveredImage[product.id] || 0]) || product.image" :alt="product.displayName">
                <div class="product-img-dots" v-if="product.images && product.images.length > 1">
                  <span v-for="(img, idx) in product.images" :key="idx"
                    class="dot" :class="{ active: (hoveredImage[product.id] || 0) === idx }"
                    @mouseenter.stop="hoveredImage[product.id] = idx"></span>
                </div>
              </div>
              <div class="product-info">
                <h4 class="product-name">{{ product.displayName }}</h4>
                <p class="product-desc">{{ product.displayDesc }}</p>
                <div class="product-price">
                  <span class="current">&yen;{{ (product.price || 0).toFixed(1) }}</span>
                  <span class="original">&yen;{{ (product.originalPrice || 0).toFixed(1) }}</span>
                </div>
                <button class="product-cart-btn" @click="addToCart(product)"><i class="fa-solid fa-cart-plus"></i> {{ state.isChinese ? '加入购物车' : 'Add to Cart' }}</button>
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>
  `,
  data() { return { currentCategory: 'all', hoveredImage: {}, searchKeyword: '' }; },
  methods: {
    setCategory(cat) {
      this.currentCategory = cat;
      // 同步更新 URL，这样导航栏再点分类时能正确触发
      if (cat === 'all') {
        this.$router.push('/products');
      } else {
        this.$router.push('/products?category=' + cat);
      }
    }
  },
  created() {
    const kw = this.$route.query.keyword || '';
    if (kw) this.searchKeyword = kw;
    const cat = this.$route.query.category || '';
    if (cat) {
      this.currentCategory = cat;
      // 首次加载时滚动到产品区域
      this.$nextTick(() => {
        setTimeout(() => {
          const el = document.querySelector('#products');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 300);
      });
    }
  },
  watch: {
    '$route.query.keyword'(val) {
      this.searchKeyword = val || '';
    },
    '$route.query.category'(val) {
      if (val) {
        this.currentCategory = val;
        // 滚动到产品区域
        this.$nextTick(() => {
          const el = document.querySelector('#products');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      }
    }
  },
  computed: {
    filteredByCategory() {
      let list = this.displayProducts;
      if (this.currentCategory !== 'all') {
        list = list.filter(p => p.category === this.currentCategory);
      }
      if (this.searchKeyword.trim()) {
        const kw = this.searchKeyword.toLowerCase();
        list = list.filter(p =>
          (p.displayName || p.name).toLowerCase().includes(kw) ||
          (p.displayDesc || p.desc).toLowerCase().includes(kw)
        );
      }
      return list;
    }
  },
  inject: ['state', 'displayProducts', 'addToCart'],
};

// ========== 农场故事页组件 ==========
const StoryPage = {
  template: `
    <div class="sub-page">
      <section class="sub-page-hero" style="background: linear-gradient(135deg, #1a2e1a 0%, #2d5a27 100%);">
        <div class="container" style="text-align:center;padding:80px 20px;">
          <h1 style="color:#fff;font-size:36px;margin-bottom:12px;">{{ state.isChinese ? '农场故事' : 'Our Story' }}</h1>
          <p style="color:#c8e6c9;font-size:16px;">{{ state.isChinese ? '25年有机农业之路，每一步都算数' : '25 Years of Organic Farming, Every Step Counts' }}</p>
        </div>
      </section>
      <!-- 关于我们（完整版） -->
      <section id="about" class="section section-alt">
        <div class="container">
          <div class="about-grid">
            <div class="about-images">
              <img class="about-img-main" src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&q=80" alt="绿源农业有机农场">
              <img class="about-img-sub" src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&q=80" alt="有机蔬菜种植">
            </div>
            <div class="about-content">
              <h2>{{ state.isChinese ? '关于' : 'About' }}<span>{{ state.isChinese ? '绿源农业' : 'Green Source' }}</span></h2>
              <p class="about-desc">{{ state.isChinese ? '2000年，我们在北京郊外承包了第一块地，开始尝试不打药、不上化肥的种地方式。那时候村里人都觉得我们傻。25年过去了，这片地从最初的50亩扩展到了3000亩，合作农户超过200家。我们不做大，只做对——每一颗菜都能追溯到是哪块地、谁种的、什么时候摘的。' : "In 2000, we leased our first plot on the outskirts of Beijing and began farming without pesticides or chemical fertilizers. The villagers thought we were foolish. 25 years later, that land has grown from 50 mu to 3,000 mu, with over 200 partner farming families. We don't aim to be the biggest — we aim to do it right. Every vegetable can be traced back to the exact field, the farmer who grew it, and the day it was harvested." }}</p>
              <p class="about-desc" style="margin-top:16px;">{{ state.isChinese ? '我们的农场位于北京市延庆区，海拔500米，昼夜温差大，日照充足，是天然的有机种植宝地。3000亩农场分为蔬菜区、果树区、谷物区和养殖区，实现了种养结合的生态循环。每一块地都有编号，每一批产品都有检测报告，你可以通过包装上的追溯码查看从播种到采摘的全过程。' : 'Our farm is located in Yanqing District, Beijing, at an altitude of 500m with great temperature variation and abundant sunshine — a natural haven for organic farming. The 3,000-mu farm is divided into vegetable, orchard, grain, and livestock zones, achieving eco-friendly crop-livestock integration. Every field is numbered, every batch is tested, and you can trace the entire journey from sowing to harvest via the code on the packaging.' }}</p>
              <div class="about-features">
                <div class="about-feature-item"><i class="fa-solid fa-circle-check"></i><span>{{ state.isChinese ? '100% 有机认证，全程可追溯' : '100% Organic Certified, Fully Traceable' }}</span></div>
                <div class="about-feature-item"><i class="fa-solid fa-circle-check"></i><span>{{ state.isChinese ? '自建有机农场，严格品质管控' : 'Self-owned Farm, Strict Quality Control' }}</span></div>
                <div class="about-feature-item"><i class="fa-solid fa-circle-check"></i><span>{{ state.isChinese ? '种养结合生态循环' : 'Eco-friendly Crop-Livestock Integration' }}</span></div>
                <div class="about-feature-item"><i class="fa-solid fa-circle-check"></i><span>{{ state.isChinese ? '凌晨采摘，当日配送' : 'Harvested at Dawn, Delivered Same Day' }}</span></div>
              </div>
              <div class="about-stats">
                <div class="about-stat"><span class="stat-number">25</span><span class="about-stat-label">{{ state.isChinese ? '年行业经验' : 'Years of Experience' }}</span></div>
                <div class="about-stat"><span class="stat-number">3000</span><span class="about-stat-label">{{ state.isChinese ? '亩有机农场' : 'Mu Organic Farm' }}</span></div>
                <div class="about-stat"><span class="stat-number">200</span><span class="about-stat-label">{{ state.isChinese ? '合作农户' : 'Partner Farmers' }}</span></div>
                <div class="about-stat"><span class="stat-number">50万</span><span class="about-stat-label">{{ state.isChinese ? '服务家庭' : 'Families Served' }}</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- 创始人说 -->
      <section id="founder" class="section founder-section">
        <div class="container">
          <div class="founder-card">
            <div class="founder-avatar"><img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80" alt="张明远"></div>
            <div class="founder-content">
              <div class="founder-quote-icon"><i class="fa-solid fa-quote-left"></i></div>
              <p class="founder-text">{{ state.isChinese ? "2000年承包第一块地的时候，村里人都说我们傻——不打药不上化肥，菜长得又小又丑，卖给谁？我说不急，先养地。养了三年，土壤活了，虫子少了，种出来的东西自己吃着都觉得不一样。现在回头看，当初那股傻劲儿是对的。做农业没有捷径，你得对得起这片土地。" : "When we leased our first plot of land in 2000, the villagers all said we were foolish — no pesticides, no chemical fertilizers, the vegetables were small and ugly, who would buy them? I said do not worry, we should nourish the soil first. After three years, the soil came alive, pests diminished, and even we could taste the difference. Looking back now, that foolishness was right. There are no shortcuts in farming — you must honor the land." }}</p>
              <div class="founder-info">
                <span class="founder-name">{{ state.isChinese ? '张明远' : 'Zhang Mingyuan' }}</span>
                <span class="founder-title">{{ state.isChinese ? '绿源农业创始人 · 种了25年地的农民' : 'Founder of Green Source · A farmer for 25 years' }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- 发展历程 -->
      <section id="milestones" class="section section-alt">
        <div class="container">
          <h2 class="section-title">{{ state.isChinese ? '发展' : 'Our' }}<span>{{ state.isChinese ? '历程' : 'Milestones' }}</span></h2>
          <p class="section-subtitle">{{ state.isChinese ? '25年有机农业之路，每一步都算数' : '25 years of organic farming, every step counts' }}</p>
          <div class="timeline">
            <div class="timeline-item" v-for="(item, index) in milestones" :key="item.year" :class="{ right: index % 2 }">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <span class="timeline-year">{{ item.year }}</span>
                <h4>{{ state.isChinese ? item.title : item.titleEn }}</h4>
                <p>{{ state.isChinese ? item.desc : item.descEn }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- 有机认证 -->
      <section id="certifications" class="section">
        <div class="container">
          <h2 class="section-title">{{ state.isChinese ? '有机' : 'Organic' }}<span>{{ state.isChinese ? '认证' : 'Certifications' }}</span></h2>
          <p class="section-subtitle">{{ state.isChinese ? '权威认证，品质保障' : 'Authoritative certifications, quality guaranteed' }}</p>
          <div class="cert-grid">
            <div class="cert-card" v-for="cert in certifications" :key="cert.title">
              <div class="cert-icon"><i :class="cert.icon"></i></div>
              <h4>{{ state.isChinese ? cert.title : cert.titleEn }}</h4>
              <p>{{ state.isChinese ? cert.desc : cert.descEn }}</p>
              <span class="cert-badge">{{ state.isChinese ? cert.badge : cert.badgeEn }}</span>
            </div>
          </div>
          <div class="cert-process">
            <h3 style="text-align:center;margin-bottom:32px;">{{ state.isChinese ? '从田间到餐桌的全程追溯' : 'Full Traceability from Farm to Table' }}</h3>
            <div class="process-steps">
              <div class="process-step" v-for="(step, idx) in processSteps" :key="idx">
                <div class="process-step-icon"><i :class="step.icon"></i></div>
                <span class="process-step-num">0{{ idx + 1 }}</span>
                <h5>{{ state.isChinese ? step.title : step.titleEn }}</h5>
                <p>{{ state.isChinese ? step.desc : step.descEn }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- 团队成员 -->
      <section id="team" class="section section-alt">
        <div class="container">
          <h2 class="section-title">{{ state.isChinese ? '认识我们的' : 'Meet Our' }}<span>{{ state.isChinese ? '团队' : 'Team' }}</span></h2>
          <p class="section-subtitle">{{ state.isChinese ? '专业团队，用心服务每一位客户' : 'Professional team dedicated to every customer' }}</p>
          <div class="team-grid">
            <div v-for="member in displayTeam" :key="member.name" class="team-card">
              <img :src="member.avatar" :alt="member.displayName">
              <h4>{{ member.displayName }}</h4>
              <p class="team-role">{{ member.displayRole }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  inject: ['state', 'displayTeam', 'displayMilestones', 'displayCertifications', 'displayProcessSteps'],
};

// ========== 项目案例页组件 ==========
const CasesPage = {
  template: `
    <div class="sub-page">
      <section class="sub-page-hero" style="background: linear-gradient(135deg, #1a2e1a 0%, #2d5a27 100%);">
        <div class="container" style="text-align:center;padding:80px 20px;">
          <h1 style="color:#fff;font-size:36px;margin-bottom:12px;">{{ state.isChinese ? '项目案例' : 'Cases' }}</h1>
          <p style="color:#c8e6c9;font-size:16px;">{{ state.isChinese ? '从金色麦田到智能温室，记录我们的每一步' : 'From Golden Fields to Smart Greenhouses' }}</p>
        </div>
      </section>
      <section id="projects" class="section">
        <div class="container">
          <div class="case-list">
            <div v-for="(project, index) in displayProjects" :key="project.title" class="case-item" :class="{ reverse: index % 2, 'case-highlight': highlightProject === index }">
              <div class="case-img">
                <img :src="project.image" :alt="project.displayTitle">
              </div>
              <div class="case-content">
                <h3>{{ project.displayTitle }}</h3>
                <p>{{ project.displayDesc || '我们的核心农业项目之一，致力于打造可持续发展的生态农业模式。' }}</p>
                <div class="case-tags">
                  <span class="case-tag">{{ state.isChinese ? '生态种植' : 'Eco Farming' }}</span>
                  <span class="case-tag">{{ state.isChinese ? '可追溯' : 'Traceable' }}</span>
                  <span class="case-tag">{{ state.isChinese ? '有机认证' : 'Certified' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- 企业合作 -->
      <section id="enterprise" class="section section-alt">
        <div class="container">
          <h2 class="section-title">{{ state.isChinese ? '企业' : 'Enterprise' }}<span>{{ state.isChinese ? '合作' : 'Partnership' }}</span></h2>
          <p class="section-subtitle">{{ state.isChinese ? '为企事业单位提供一站式有机食材解决方案' : 'One-stop organic food solutions for enterprises' }}</p>
          <div class="enterprise-grid">
            <div class="enterprise-card" v-for="item in displayEnterpriseServices" :key="item.title">
              <div class="enterprise-icon"><i :class="item.icon"></i></div>
              <h4>{{ state.isChinese ? item.title : item.titleEn }}</h4>
              <p>{{ state.isChinese ? item.desc : item.descEn }}</p>
              <ul class="enterprise-features">
                <li v-for="f in item.features" :key="f">{{ f }}</li>
              </ul>
            </div>
          </div>
          <div class="enterprise-stats">
            <div class="enterprise-stat-item" v-for="stat in displayEnterpriseStats" :key="stat.label">
              <span class="enterprise-stat-num">{{ stat.num }}</span>
              <span class="enterprise-stat-label">{{ state.isChinese ? stat.label : stat.labelEn }}</span>
            </div>
          </div>
        </div>
      </section>
      <!-- 订阅套餐 -->
      <section id="subscriptions" class="section">
        <div class="container">
          <h2 class="section-title">{{ state.isChinese ? '订阅' : 'Subscription' }}<span>{{ state.isChinese ? '套餐' : 'Plans' }}</span></h2>
          <p class="section-subtitle">{{ state.isChinese ? '新鲜有机蔬菜，每周配送到家' : 'Fresh organic produce, delivered to your door weekly' }}</p>
          <div class="pricing-grid">
            <div class="pricing-card" v-for="plan in displaySubscriptionPlans" :key="plan.name" :class="{ featured: plan.featured }">
              <div class="pricing-badge" v-if="plan.featured">{{ state.isChinese ? '最受欢迎' : 'Most Popular' }}</div>
              <h4 class="pricing-name">{{ state.isChinese ? plan.name : plan.nameEn }}</h4>
              <div class="pricing-price">
                <span class="pricing-currency">&yen;</span>
                <span class="pricing-amount">{{ plan.price }}</span>
                <span class="pricing-period">/{{ state.isChinese ? plan.period : plan.periodEn }}</span>
              </div>
              <p class="pricing-desc">{{ state.isChinese ? plan.desc : plan.descEn }}</p>
              <ul class="pricing-features">
                <li v-for="f in plan.features" :key="f"><i class="fa-solid fa-check"></i> {{ f }}</li>
              </ul>
              <button class="btn-primary" style="width:100%;margin-top:auto;">{{ state.isChinese ? '立即订阅' : 'Subscribe Now' }}</button>
            </div>
          </div>
        </div>
      </section>
      <!-- 客户评价 -->
      <section id="testimonials" class="section section-alt">
        <div class="container">
          <h2 class="section-title">{{ state.isChinese ? '客户' : 'Customer' }}<span>{{ state.isChinese ? '评价' : 'Testimonials' }}</span></h2>
          <p class="section-subtitle">{{ state.isChinese ? '听听我们的客户怎么说' : 'What our customers say' }}</p>
          <div class="testimonials-grid">
            <div v-for="item in displayTestimonials" :key="item.name" class="testimonial-card">
              <p class="testimonial-text">"{{ item.displayText }}"</p>
              <div class="testimonial-stars">
                <span v-for="n in 5" :key="n" :class="n <= item.stars ? 'fa-solid fa-star' : 'fa-regular fa-star'" style="color: #F59E0B;"></span>
              </div>
              <div class="testimonial-author">
                <img :src="item.avatar" :alt="item.displayName">
                <span class="testimonial-name">{{ item.displayName }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  inject: ['state', 'displayProjects', 'displayTestimonials', 'displayEnterpriseServices', 'displayEnterpriseStats', 'displaySubscriptionPlans'],
  data() { return { highlightProject: -1 }; },
  created() {
    const idx = this.$route.query.project;
    if (idx !== undefined && idx !== null) {
      this.highlightProject = parseInt(idx);
    }
  },
  mounted() {
    if (this.highlightProject >= 0) {
      setTimeout(() => {
        const items = document.querySelectorAll('.case-item');
        if (items[this.highlightProject]) {
          const offset = items[this.highlightProject].offsetTop - 100;
          window.scrollTo({ top: offset, behavior: 'smooth' });
          items[this.highlightProject].classList.add('case-highlight');
        }
      }, 300);
    }
  },
  watch: {
    '$route.query.project'(val) {
      if (val !== undefined && val !== null) {
        this.highlightProject = parseInt(val);
        setTimeout(() => {
          const items = document.querySelectorAll('.case-item');
          if (items[this.highlightProject]) {
            const offset = items[this.highlightProject].offsetTop - 100;
            window.scrollTo({ top: offset, behavior: 'smooth' });
          }
        }, 300);
      }
    }
  },
};

// ========== 联系我们页组件 ==========
const ContactPage = {
  template: `
    <div class="sub-page">
      <section class="sub-page-hero" style="background: linear-gradient(135deg, #1a2e1a 0%, #2d5a27 100%);">
        <div class="container" style="text-align:center;padding:80px 20px;">
          <h1 style="color:#fff;font-size:36px;margin-bottom:12px;">{{ state.isChinese ? '联系我们' : 'Contact Us' }}</h1>
          <p style="color:#c8e6c9;font-size:16px;">{{ state.isChinese ? '有任何问题，随时联系我们' : 'Have questions? Feel free to reach out' }}</p>
        </div>
      </section>
      <section class="section">
        <div class="container">
          <div class="contact-grid">
            <div class="contact-form-wrap">
              <h2 style="margin-bottom:24px;">{{ state.isChinese ? '给我们留言' : 'Leave Us a Message' }}</h2>
              <div class="form-group">
                <label>{{ state.isChinese ? '您的姓名' : 'Your Name' }}</label>
                <input type="text" :placeholder="state.isChinese ? '请输入姓名' : 'Enter your name'" v-model="form.name">
              </div>
              <div class="form-group">
                <label>{{ state.isChinese ? '联系电话' : 'Phone' }}</label>
                <input type="text" :placeholder="state.isChinese ? '请输入手机号' : 'Enter phone number'" v-model="form.phone">
              </div>
              <div class="form-group">
                <label>{{ state.isChinese ? '邮箱地址' : 'Email' }}</label>
                <input type="text" :placeholder="state.isChinese ? '请输入邮箱' : 'Enter email'" v-model="form.email">
              </div>
              <div class="form-group">
                <label>{{ state.isChinese ? '留言内容' : 'Message' }}</label>
                <textarea :placeholder="state.isChinese ? '请输入您的留言...' : 'Enter your message...'" v-model="form.message" rows="5" style="width:100%;padding:12px;border:1px solid #e0e0e0;border-radius:6px;font-size:14px;resize:vertical;font-family:inherit;"></textarea>
              </div>
              <button class="btn-primary" style="width:100%;padding:12px;" @click="submitForm">{{ state.isChinese ? '提交留言' : 'Submit' }}</button>
            </div>
            <div class="contact-info-wrap">
              <h2 style="margin-bottom:24px;">{{ state.isChinese ? '联系方式' : 'Contact Info' }}</h2>
              <div class="contact-info-list">
                <div class="contact-info-item">
                  <i class="fa-solid fa-phone"></i>
                  <div><strong>{{ state.isChinese ? '电话' : 'Phone' }}</strong><p>400-888-6789</p></div>
                </div>
                <div class="contact-info-item">
                  <i class="fa-solid fa-location-dot"></i>
                  <div><strong>{{ state.isChinese ? '地址' : 'Address' }}</strong><p>{{ state.isChinese ? '北京市延庆区绿源有机农场' : 'Luyuan Organic Farm, Yanqing, Beijing' }}</p></div>
                </div>
                <div class="contact-info-item">
                  <i class="fa-solid fa-envelope"></i>
                  <div><strong>{{ state.isChinese ? '邮箱' : 'Email' }}</strong><p>contact@luyuanagri.cn</p></div>
                </div>
                <div class="contact-info-item">
                  <i class="fa-regular fa-clock"></i>
                  <div><strong>{{ state.isChinese ? '营业时间' : 'Business Hours' }}</strong><p>{{ state.isChinese ? '周一至周六 8:00 - 18:00' : 'Mon-Sat 8:00 - 18:00' }}</p></div>
                </div>
              </div>
              <div style="margin-top:32px;">
                <h3 style="margin-bottom:12px;">{{ state.isChinese ? '关注我们' : 'Follow Us' }}</h3>
                <div style="display:flex;gap:12px;">
                  <a href="javascript:void(0)" style="width:40px;height:40px;border-radius:50%;background:#07C160;color:#fff;display:flex;align-items:center;justify-content:center;font-size:18px;"><i class="fa-brands fa-weixin"></i></a>
                  <a href="javascript:void(0)" style="width:40px;height:40px;border-radius:50%;background:#E6162D;color:#fff;display:flex;align-items:center;justify-content:center;font-size:18px;"><i class="fa-brands fa-weibo"></i></a>
                  <a href="javascript:void(0)" style="width:40px;height:40px;border-radius:50%;background:#000;color:#fff;display:flex;align-items:center;justify-content:center;font-size:18px;"><i class="fa-brands fa-tiktok"></i></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  inject: ['state'],
  data() { return { form: { name: '', phone: '', email: '', message: '' } }; },
  methods: {
    submitForm() {
      alert(this.state.isChinese ? '留言已提交，我们会尽快联系您！' : 'Message submitted, we will contact you soon!');
      this.form = { name: '', phone: '', email: '', message: '' };
    }
  },
};

// ========== 路由配置 ==========
const routes = [
  { path: '/', component: HomePage },
  { path: '/products', component: ProductsPage },
  { path: '/story', component: StoryPage },
  { path: '/cases', component: CasesPage },
  { path: '/contact', component: ContactPage },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() { return { top: 0 }; },
});

// ========== 创建 Vue 应用 ==========
const app = createApp({
  setup() {

    // ========== 响应式状态 ==========
    const state = reactive({
      // 导航栏
      showMobileMenu: false,
      isScrolled: false,
      activeDropdown: null,

      // 搜索
      showSearch: false,
      searchKeyword: '',

      // 购物车面板
      showCart: false,

      // 回到顶部
      showBackToTop: false,

      // ---- 语言状态 ----
      isChinese: false,

      // ---- 主题状态 ----
      isDarkTheme: false,

      // ---- 用户认证状态 ----
      showAuthModal: false,
      authMode: 'login',
      loginMethod: 'password',
      qrType: 'wechat',
      qrExpired: false,
      codeCooldown: 0,
      isLoggedIn: false,
      username: '',
      authError: '',
      loginForm: {
        username: '',
        password: '',
      },
      registerForm: {
        username: '',
        code: '',
        password: '',
        confirm: '',
      },

      // ---- 购物车数据 ----
      cartItems: [],
      cartToast: '',

      // 产品数据（新增 category 字段）
      products: [
        {
          id: 1,
          name: '有机番茄',
          nameEn: 'Organic Tomato',
          desc: '沙瓤多汁，自然成熟采摘',
          descEn: 'Juicy and naturally ripened',
          image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&q=80',
          images: [
            'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&q=80',
            'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=400&q=80',
            'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?w=400&q=80',
          ],
          price: 15.8,
          originalPrice: 22.0,
          category: 'vegetable',
        },
        {
          id: 2,
          name: '有机胡萝卜',
          nameEn: 'Organic Carrot',
          desc: '脆甜可口，富含胡萝卜素',
          descEn: 'Crisp and rich in carotene',
          image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&q=80',
          images: [
            'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&q=80',
            'https://images.unsplash.com/photo-1590868309235-ea34bed7bd7f?w=400&q=80',
            'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=400&q=80',
          ],
          price: 12.5,
          originalPrice: 18.0,
          category: 'vegetable',
        },
        {
          id: 3,
          name: '有机生菜',
          nameEn: 'Organic Lettuce',
          desc: '鲜嫩清爽，当日采摘当日达',
          descEn: 'Fresh and crisp, harvested daily',
          image: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400&q=80',
          images: [
            'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400&q=80',
            'https://images.unsplash.com/photo-1640958904159-51ae08bd3412?w=400&q=80',
            'https://images.unsplash.com/photo-1515356956468-873dd257f911?w=400&q=80',
          ],
          price: 8.9,
          originalPrice: 12.0,
          category: 'vegetable',
        },
        {
          id: 4,
          name: '红葡萄',
          nameEn: 'Red Grapes',
          desc: '颗粒饱满，甜度14度以上',
          descEn: 'Plump berries, 14+ brix sweetness',
          image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400&q=80',
          images: [
            'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400&q=80',
            'https://images.unsplash.com/photo-1571663716920-9fd87840c9ef?w=400&q=80',
            'https://images.unsplash.com/photo-1602170284188-6a820463dc2b?w=400&q=80',
          ],
          price: 28.0,
          originalPrice: 35.0,
          category: 'fruit',
        },
        {
          id: 5,
          name: '有机大蒜',
          nameEn: 'Organic Garlic',
          desc: '蒜瓣饱满，辛香浓郁',
          descEn: 'Full cloves, rich aroma',
          image: 'https://images.unsplash.com/photo-1503097325940-ae094fdb97ba?w=400&q=80',
          images: [
            'https://images.unsplash.com/photo-1503097325940-ae094fdb97ba?w=400&q=80',
            'https://images.unsplash.com/photo-1636210589096-a53d5dacd702?w=400&q=80',
            'https://images.unsplash.com/photo-1501420193726-1f65acd36cda?w=400&q=80',
          ],
          price: 9.9,
          originalPrice: 14.0,
          category: 'vegetable',
        },
        {
          id: 6,
          name: '有机洋葱',
          nameEn: 'Organic Onion',
          desc: '紫皮洋葱，口感微甜不辣眼',
          descEn: 'Red onion, sweet and mild',
          image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&q=80',
          images: [
            'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&q=80',
            'https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?w=400&q=80',
            'https://images.unsplash.com/photo-1620574387735-3624d75b2dbc?w=400&q=80',
          ],
          price: 7.5,
          originalPrice: 10.0,
          category: 'vegetable',
        },
        {
          id: 7,
          name: '有机苹果',
          nameEn: 'Organic Apple',
          desc: '脆甜多汁，果香浓郁',
          descEn: 'Crisp, juicy with rich aroma',
          image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&q=80',
          images: [
            'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&q=80',
            'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=400&q=80',
            'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=400&q=80',
          ],
          price: 18.8,
          originalPrice: 25.0,
          category: 'fruit',
        },
        {
          id: 8,
          name: '有机草莓',
          nameEn: 'Organic Strawberry',
          desc: '颗颗红透，香甜可口',
          descEn: 'Bright red, sweet and delicious',
          image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&q=80',
          images: [
            'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&q=80',
            'https://images.unsplash.com/photo-1587393855524-087f83d95bc9?w=400&q=80',
            'https://images.unsplash.com/photo-1553522991-71439aa62779?w=400&q=80',
          ],
          price: 32.0,
          originalPrice: 45.0,
          category: 'fruit',
        },
        {
          id: 9,
          name: '有机大米',
          nameEn: 'Organic Rice',
          desc: '东北黑土地，颗粒分明',
          descEn: 'From northeast farmland, distinct grains',
          image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80',
          images: [
            'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80',
            'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=400&q=80',
            'https://images.unsplash.com/photo-1594756202469-9ff9799b2e4e?w=400&q=80',
          ],
          price: 39.9,
          originalPrice: 55.0,
          category: 'grain',
        },
        {
          id: 10,
          name: '鲜牛奶',
          nameEn: 'Fresh Milk',
          desc: '牧场直供，当日新鲜巴氏杀菌',
          descEn: 'Farm-fresh, pasteurized daily',
          image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&q=80',
          images: [
            'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&q=80',
            'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80',
            'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80',
          ],
          price: 15.0,
          originalPrice: 20.0,
          category: 'dairy',
        },
        {
          id: 11,
          name: '有机黄瓜',
          nameEn: 'Organic Cucumber',
          desc: '清脆爽口，水分充足',
          descEn: 'Crisp and refreshing, rich in water',
          image: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400&q=80',
          images: [
            'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400&q=80',
            'https://images.unsplash.com/photo-1589621316382-008455b857cd?w=400&q=80',
            'https://images.unsplash.com/photo-1587411768638-ec71f8e33b78?w=400&q=80',
          ],
          price: 6.8,
          originalPrice: 9.0,
          category: 'vegetable',
        },
        {
          id: 12,
          name: '有机西兰花',
          nameEn: 'Organic Broccoli',
          desc: '花球紧实，翠绿新鲜',
          descEn: 'Tight florets, fresh green',
          image: 'https://images.unsplash.com/photo-1685504445355-0e7bdf90d415?w=400&q=80',
          images: [
            'https://images.unsplash.com/photo-1685504445355-0e7bdf90d415?w=400&q=80',
            'https://images.unsplash.com/photo-1614336215203-05a588f74627?w=400&q=80',
            'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&q=80',
          ],
          price: 11.5,
          originalPrice: 16.0,
          category: 'vegetable',
        },
        {
          id: 13,
          name: '有机蓝莓',
          nameEn: 'Organic Blueberry',
          desc: '颗颗饱满，花青素丰富',
          descEn: 'Plump berries, rich in anthocyanins',
          image: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400&q=80',
          images: [
            'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400&q=80',
            'https://images.unsplash.com/photo-1597474561103-0773c378a1fb?w=400&q=80',
            'https://images.unsplash.com/photo-1606757389667-45c2024f9fa4?w=400&q=80',
          ],
          price: 35.0,
          originalPrice: 48.0,
          category: 'fruit',
        },
        {
          id: 14,
          name: '有机燕麦',
          nameEn: 'Organic Oats',
          desc: '整粒燕麦，高纤维低GI',
          descEn: 'Whole grain oats, high fiber low GI',
          image: 'https://images.unsplash.com/photo-1510776478953-fa4dc5de04ca?w=400&q=80',
          images: [
            'https://images.unsplash.com/photo-1510776478953-fa4dc5de04ca?w=400&q=80',
            'https://images.unsplash.com/photo-1502747220144-846486e80891?w=400&q=80',
            'https://images.unsplash.com/photo-1676289124506-bdce1e1acc97?w=400&q=80',
          ],
          price: 25.0,
          originalPrice: 35.0,
          category: 'grain',
        },
        {
          id: 15,
          name: '有机小麦面粉',
          nameEn: 'Organic Wheat Flour',
          desc: '石磨研磨，麦香浓郁',
          descEn: 'Stone-ground, rich wheat aroma',
          image: 'https://images.unsplash.com/photo-1627735483792-233bf632619b?w=400&q=80',
          images: [
            'https://images.unsplash.com/photo-1627735483792-233bf632619b?w=400&q=80',
            'https://images.unsplash.com/photo-1549590143-d5855148a9d5?w=400&q=80',
            'https://images.unsplash.com/photo-1714842981153-ffeaf74e7a1a?w=400&q=80',
          ],
          price: 22.0,
          originalPrice: 30.0,
          category: 'grain',
        },
        {
          id: 16,
          name: '有机酸奶',
          nameEn: 'Organic Yogurt',
          desc: '低温发酵，口感醇厚',
          descEn: 'Slow-fermented, rich and creamy',
          image: 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=400&q=80',
          images: [
            'https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=400&q=80',
            'https://images.unsplash.com/photo-1562114808-b4b33cf60f4f?w=400&q=80',
            'https://images.unsplash.com/photo-1633893215271-f7e1fca081ad?w=400&q=80',
          ],
          price: 18.0,
          originalPrice: 24.0,
          category: 'dairy',
        },
        {
          id: 17,
          name: '有机菠菜',
          nameEn: 'Organic Spinach',
          desc: '叶片肥厚，铁含量高',
          descEn: 'Thick leaves, rich in iron',
          image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80',
          images: [
            'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80',
            'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80',
            'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80',
          ],
          price: 9.8,
          originalPrice: 14.0,
          category: 'vegetable',
        },
        {
          id: 18,
          name: '有机彩椒',
          nameEn: 'Organic Bell Pepper',
          desc: '红黄彩椒，甜脆多汁',
          descEn: 'Colorful sweet bell peppers, crisp and juicy',
          image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&q=80',
          images: [
            'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&q=80',
            'https://images.unsplash.com/photo-1592548868664-f8b4e4b1cfb7?w=400&q=80',
            'https://images.unsplash.com/photo-1625675411855-534ee6b464ac?w=400&q=80',
          ],
          price: 13.8,
          originalPrice: 19.0,
          category: 'vegetable',
        },
        {
          id: 19,
          name: '有机红薯',
          nameEn: 'Organic Sweet Potato',
          desc: '蜜薯品种，软糯香甜',
          descEn: 'Honey variety, soft and sweet',
          image: 'https://images.unsplash.com/photo-1570723735746-c9bd51bd7c40?w=400&q=80',
          images: [
            'https://images.unsplash.com/photo-1570723735746-c9bd51bd7c40?w=400&q=80',
            'https://images.unsplash.com/photo-1580324613766-3b5d415bb34a?w=400&q=80',
            'https://images.unsplash.com/photo-1680472628312-9ff2605ee718?w=400&q=80',
          ],
          price: 8.5,
          originalPrice: 12.0,
          category: 'vegetable',
        },
        {
          id: 20,
          name: '有机橙子',
          nameEn: 'Organic Orange',
          desc: '赣南脐橙，皮薄汁多',
          descEn: 'Gannan navel orange, thin skin, juicy',
          image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&q=80',
          images: [
            'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&q=80',
            'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=400&q=80',
            'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=400&q=80',
          ],
          price: 22.0,
          originalPrice: 30.0,
          category: 'fruit',
        },
        {
          id: 21,
          name: '有机猕猴桃',
          nameEn: 'Organic Kiwi',
          desc: '翠香品种，维C之王',
          descEn: 'Cuixiang variety, king of Vitamin C',
          image: 'https://images.unsplash.com/photo-1528498033373-3c6c08e93d79?w=400&q=80',
          images: [
            'https://images.unsplash.com/photo-1528498033373-3c6c08e93d79?w=400&q=80',
            'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400&q=80',
            'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=400&q=80',
          ],
          price: 25.0,
          originalPrice: 35.0,
          category: 'fruit',
        },
        {
          id: 22,
          name: '有机樱桃',
          nameEn: 'Organic Cherry',
          desc: '烟台大樱桃，粒大肉厚',
          descEn: 'Yantai cherry, large and meaty',
          image: 'https://images.unsplash.com/photo-1528821154947-1aa3d1b74941?w=400&q=80',
          images: [
            'https://images.unsplash.com/photo-1528821154947-1aa3d1b74941?w=400&q=80',
            'https://images.unsplash.com/photo-1520236060906-9c5ed525b025?w=400&q=80',
            'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400&q=80',
          ],
          price: 45.0,
          originalPrice: 60.0,
          category: 'fruit',
        },
        {
          id: 23,
          name: '有机小米',
          nameEn: 'Organic Millet',
          desc: '陕北黄小米，熬粥浓香',
          descEn: 'Northern Shaanxi yellow millet, rich porridge aroma',
          image: 'https://images.unsplash.com/photo-1768729341679-8a2da8e5b5fa?w=400&q=80',
          images: [
            'https://images.unsplash.com/photo-1768729341679-8a2da8e5b5fa?w=400&q=80',
            'https://images.unsplash.com/photo-1768729339998-909158957162?w=400&q=80',
            'https://images.unsplash.com/photo-1651241587503-a874db54a1a7?w=400&q=80',
          ],
          price: 19.9,
          originalPrice: 28.0,
          category: 'grain',
        },
        {
          id: 24,
          name: '有机黄豆',
          nameEn: 'Organic Soybeans',
          desc: '东北非转基因黄豆，蛋白含量高',
          descEn: 'Northeast non-GMO soybeans, high protein',
          image: 'https://images.unsplash.com/photo-1601993488142-d3050a16478d?w=400&q=80',
          images: [
            'https://images.unsplash.com/photo-1601993488142-d3050a16478d?w=400&q=80',
            'https://images.unsplash.com/photo-1639843606783-b2f9c50a7468?w=400&q=80',
            'https://images.unsplash.com/photo-1728931340275-430196814dc5?w=400&q=80',
          ],
          price: 16.8,
          originalPrice: 22.0,
          category: 'grain',
        },
        {
          id: 25,
          name: '有机土鸡蛋',
          nameEn: 'Organic Free-range Eggs',
          desc: '林下散养土鸡，蛋黄饱满',
          descEn: 'Free-range hens, rich golden yolks',
          image: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=400&q=80',
          images: [
            'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=400&q=80',
            'https://images.unsplash.com/photo-1639194335563-d56b83f0060c?w=400&q=80',
            'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=400&q=80',
          ],
          price: 29.9,
          originalPrice: 38.0,
          category: 'dairy',
        },
        {
          id: 26,
          name: '有机蜂蜜',
          nameEn: 'Organic Honey',
          desc: '百花蜜，天然纯正无添加',
          descEn: 'Wildflower honey, pure and additive-free',
          image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=400&q=80',
          images: [
            'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=400&q=80',
            'https://images.unsplash.com/photo-1605880980331-20a711b27338?w=400&q=80',
            'https://images.unsplash.com/photo-1471943311424-646960669fbc?w=400&q=80',
          ],
          price: 58.0,
          originalPrice: 78.0,
          category: 'dairy',
        },
      ],

      // 特色服务
      features: [
        {
          icon: 'fa-solid fa-leaf',
          title: '有机种植',
          titleEn: 'Organic Farming',
          desc: '不催熟、不打药、不上化肥，让蔬菜按自己的节奏长。我们的土壤检测报告每年更新，你可以随时查看。',
          descEn: 'No forced ripening, no pesticides, no chemicals. Let vegetables grow at their own pace. Soil test reports updated annually.',
        },
        {
          icon: 'fa-solid fa-microchip',
          title: '智能农业',
          titleEn: 'Smart Farming',
          desc: '大棚里装了传感器，土壤缺水了自动灌溉，温度高了自动通风。手机上就能看到每块地的实时数据。',
          descEn: 'Sensors in greenhouses auto-irrigate and auto-ventilate. Real-time data on your phone.',
        },
        {
          icon: 'fa-solid fa-truck-fast',
          title: '冷链配送',
          titleEn: 'Cold Chain Delivery',
          desc: '凌晨4点采摘，上午10点前入库冷藏，下午发车，大部分地区次日达。夏天收到的时候箱子里的冰袋还没化完。',
          descEn: 'Picked at 4am, refrigerated by 10am, shipped same day. Next-day delivery for most areas.',
        },
      ],

      // 服务展示
      services: [
        {
          title: '新鲜蔬菜',
          titleEn: 'Fresh Vegetables',
          image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=600&fit=crop&q=80',
        },
        {
          title: '有机水果',
          titleEn: 'Organic Fruits',
          image: 'https://images.unsplash.com/photo-1773823307113-2dcc3609aa79?w=800&h=600&fit=crop&q=80',
        },
        {
          title: '优质谷物',
          titleEn: 'Premium Grains',
          image: 'https://images.unsplash.com/photo-1743674452796-ad8d0cf38005?w=800&h=600&fit=crop&q=80',
        },
        {
          title: '乳制品',
          titleEn: 'Dairy Products',
          image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&h=600&fit=crop&q=80',
        },
      ],

      // 项目案例（新增 desc/descEn 字段）
      projects: [
        {
          title: '金色麦田',
          titleEn: 'Golden Wheat Field',
          desc: '占地800亩的有机小麦种植基地，采用传统农耕与现代科技相结合的方式，年产优质有机小麦200吨，是北京地区最大的有机小麦生产基地之一。',
          descEn: 'An 800-acre organic wheat base combining traditional farming with modern technology, producing 200 tons of premium organic wheat annually.',
          image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80',
        },
        {
          title: '智能温室',
          titleEn: 'Smart Greenhouse',
          desc: '投资2000万建设的智能温室群，配备物联网传感器、自动灌溉系统和环境控制系统，实现全年无休的有机蔬菜生产，年产量提升40%。',
          descEn: 'A 20M RMB smart greenhouse complex with IoT sensors, auto-irrigation, and climate control, enabling year-round organic vegetable production with 40% yield increase.',
          image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&q=80',
        },
        {
          title: '生态农场',
          titleEn: 'Eco Farm',
          desc: '种养结合的生态循环农场，将农作物秸秆转化为有机肥料，养殖区的畜禽粪便用于农田施肥，形成完整的生态循环链条，实现零废弃排放。',
          descEn: 'An eco-circular farm combining crop farming and animal husbandry, converting crop residue into organic fertilizer and achieving zero-waste emissions.',
          image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&q=80',
        },
      ],

      // 团队成员
      team: [
        {
          name: '张明远',
          nameEn: 'Zhang Mingyuan',
          role: '创始人 / CEO',
          roleEn: 'Founder / CEO',
          avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80',
        },
        {
          name: '李晓芳',
          nameEn: 'Li Xiaofang',
          role: '首席农业专家',
          roleEn: 'Chief Agronomist',
          avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&q=80',
        },
        {
          name: '王建国',
          nameEn: 'Wang Jianguo',
          role: '技术总监',
          roleEn: 'Tech Director',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
        },
      ],

      // 发展历程
      milestones: [
        { year: '2000', title: '创业起步', titleEn: 'Humble Beginnings', desc: '在北京延庆承包第一块50亩试验田，开始有机种植探索之路。', descEn: 'Leased our first 50-mu trial field in Yanqing, Beijing, and began exploring organic farming.' },
        { year: '2002', title: '土壤改良', titleEn: 'Soil Restoration', desc: '耗时两年对退化土地进行有机改良，建立蚯蚓堆肥和绿肥轮作体系。', descEn: 'Spent two years restoring degraded soil with vermicomposting and green manure crop rotation.' },
        { year: '2005', title: '获得有机认证', titleEn: 'Organic Certified', desc: '首批产品通过国家有机产品认证，正式进入有机农产品市场。', descEn: 'First products passed national organic certification, officially entering the organic market.' },
        { year: '2008', title: '社区支持农业', titleEn: 'CSA Program', desc: '推出"社区支持农业"模式，首批200个家庭加入每周蔬菜配送计划。', descEn: 'Launched Community Supported Agriculture (CSA) program with 200 founding member families.' },
        { year: '2010', title: '规模扩展', titleEn: 'Scaling Up', desc: '农场扩展至500亩，合作农户达到30家，建立标准化生产流程。', descEn: 'Farm expanded to 500 mu with 30 partner farmers. Established standardized production processes.' },
        { year: '2013', title: '农旅融合', titleEn: 'Agri-tourism', desc: '开放农场体验项目，年均接待游客超5000人次，获评"北京市休闲农业示范园"。', descEn: 'Opened farm experience programs, hosting 5,000+ visitors annually. Named "Beijing Leisure Agriculture Demonstration Farm."' },
        { year: '2015', title: '智能农业升级', titleEn: 'Smart Farming', desc: '引入物联网传感器和智能温室系统，实现精准灌溉和环境监控。', descEn: 'Introduced IoT sensors and smart greenhouse systems for precision irrigation and environmental monitoring.' },
        { year: '2018', title: '冷链物流体系', titleEn: 'Cold Chain Logistics', desc: '建成自有冷链仓储中心，实现凌晨采摘、当日配送的供应链体系。', descEn: 'Built our own cold chain warehouse, achieving a dawn-harvest, same-day delivery supply chain.' },
        { year: '2020', title: '电商平台上线', titleEn: 'E-commerce Launch', desc: '绿源农业电商平台正式上线，开启线上线下一体化销售模式。', descEn: 'Green Source e-commerce platform officially launched, integrating online and offline sales.' },
        { year: '2022', title: '碳中和农场', titleEn: 'Carbon Neutral Farm', desc: '启动碳中和计划，安装太阳能板和沼气发电系统，实现农场运营零碳排放。', descEn: 'Launched carbon neutrality plan with solar panels and biogas systems, achieving zero-carbon farm operations.' },
        { year: '2023', title: '千亩生态农场', titleEn: '1,000-Mu Eco Farm', desc: '农场规模突破1000亩，合作农户超过100家，服务家庭超20万户。', descEn: 'Farm exceeded 1,000 mu with 100+ partner farmers, serving over 200,000 families.' },
        { year: '2024', title: '国际认证', titleEn: 'Global Certification', desc: '获得EU Organic、USDA Organic和JAS有机认证，产品远销海外12个国家。', descEn: 'Obtained EU Organic, USDA Organic, and JAS certifications. Products exported to 12 countries.' },
        { year: '2025', title: '行业标杆', titleEn: 'Industry Leader', desc: '连续三年有机抽检100%合格，获评"北京市农业龙头企业"称号。', descEn: 'Three consecutive years of 100% organic inspection pass rate. Named "Beijing Agricultural Leading Enterprise."' },
      ],

      // 有机认证
      certifications: [
        { icon: 'fa-solid fa-certificate', title: '中国有机产品认证', titleEn: 'China Organic Certification', desc: '通过国家认监委有机产品认证，每年复审，确保全程符合有机标准。', descEn: 'Certified by CNCA, annually reviewed to ensure full compliance with organic standards.', badge: 'CNCA', badgeEn: 'CNCA' },
        { icon: 'fa-solid fa-shield-halved', title: 'ISO 22000 食品安全', titleEn: 'ISO 22000 Food Safety', desc: '国际食品安全管理体系认证，从原料到成品全链条管控。', descEn: 'International food safety management system certification, full chain control from raw materials to finished products.', badge: 'ISO 22000', badgeEn: 'ISO 22000' },
        { icon: 'fa-solid fa-leaf', title: 'Global G.A.P. 认证', titleEn: 'Global G.A.P.', desc: '全球良好农业规范认证，产品可出口至欧盟、日本等国际市场。', descEn: 'Global Good Agricultural Practices certification, products exportable to EU, Japan and other international markets.', badge: 'G.A.P.', badgeEn: 'G.A.P.' },
        { icon: 'fa-solid fa-seedling', title: '绿色食品认证', titleEn: 'Green Food Certification', desc: '中国绿色食品发展中心认证，A级绿色食品标准。', descEn: 'Certified by China Green Food Development Center, Grade A green food standard.', badge: 'A级', badgeEn: 'Grade A' },
        { icon: 'fa-solid fa-globe', title: 'EU Organic 欧盟有机', titleEn: 'EU Organic', desc: '通过欧盟有机认证，符合欧盟最严格的有机法规EC 834/2007。', descEn: 'EU organic certified, meeting the strictest EU organic regulation EC 834/2007.', badge: 'EU', badgeEn: 'EU' },
        { icon: 'fa-solid fa-flag-usa', title: 'USDA Organic 美国有机', titleEn: 'USDA Organic', desc: '通过美国农业部国家有机计划(NOP)认证。', descEn: 'Certified by USDA National Organic Program (NOP).', badge: 'USDA', badgeEn: 'USDA' },
        { icon: 'fa-solid fa-microscope', title: 'HACCP 危害分析', titleEn: 'HACCP', desc: '国际认可的食品安全预防控制体系，对生产各环节进行危害分析和关键控制点管理。', descEn: 'Internationally recognized food safety preventive control system with hazard analysis and critical control points.', badge: 'HACCP', badgeEn: 'HACCP' },
        { icon: 'fa-solid fa-recycle', title: '碳中和认证', titleEn: 'Carbon Neutral', desc: '通过第三方核查，农场运营实现碳中和，太阳能和沼气发电覆盖全部用电需求。', descEn: 'Third-party verified carbon neutral farm operations. Solar and biogas systems cover all electricity needs.', badge: '零碳', badgeEn: 'Zero Carbon' },
      ],

      // 追溯流程
      processSteps: [
        { icon: 'fa-solid fa-seedling', title: '有机播种', titleEn: 'Organic Sowing', desc: '使用经过认证的有机种子，在检测合格的土壤中播种。', descEn: 'Certified organic seeds sown in tested, approved soil.' },
        { icon: 'fa-solid fa-droplet', title: '生态灌溉', titleEn: 'Eco Irrigation', desc: '采用滴灌技术，使用经过净化的山泉水灌溉。', descEn: 'Drip irrigation with purified mountain spring water.' },
        { icon: 'fa-solid fa-sun', title: '自然生长', titleEn: 'Natural Growth', desc: '不使用化学农药和化肥，依靠生物防治和有机堆肥。', descEn: 'No chemical pesticides or fertilizers. Biological pest control and organic compost only.' },
        { icon: 'fa-solid fa-hand-sparkles', title: '人工采摘', titleEn: 'Hand Picked', desc: '凌晨4点人工采摘，确保果蔬在最佳成熟度时收获。', descEn: 'Hand-picked at 4 AM to ensure optimal ripeness at harvest.' },
        { icon: 'fa-solid fa-temperature-low', title: '冷链运输', titleEn: 'Cold Chain Transport', desc: '全程0-4°C冷链运输，锁住新鲜与营养。', descEn: 'Full cold chain at 0-4°C to lock in freshness and nutrition.' },
        { icon: 'fa-solid fa-qrcode', title: '扫码溯源', titleEn: 'QR Traceability', desc: '每份产品附带追溯码，扫码查看从播种到配送的全过程。', descEn: 'Every product includes a traceability QR code. Scan to view the full journey from sowing to delivery.' },
      ],

      // 企业合作服务
      enterpriseServices: [
        { icon: 'fa-solid fa-building', title: '企业食堂直供', titleEn: 'Corporate Cafeteria Supply', desc: '为企事业单位食堂提供每日新鲜有机蔬菜和肉类，支持定制化菜单。', descEn: 'Daily fresh organic vegetables and meat for corporate cafeterias with customizable menus.', features: ['每日配送', '定制菜单', '品质保障', '专属客服'] },
        { icon: 'fa-solid fa-store', title: '商超渠道合作', titleEn: 'Supermarket Partnership', desc: '与大型商超建立长期合作关系，提供稳定的有机产品供应链。', descEn: 'Long-term partnerships with major supermarkets for a stable organic product supply chain.', features: ['稳定供货', '品牌专区', '联合营销', '退换保障'] },
        { icon: 'fa-solid fa-utensils', title: '餐饮企业定制', titleEn: 'Restaurant Customization', desc: '为高端餐厅和连锁餐饮提供专属有机食材解决方案。', descEn: 'Exclusive organic ingredient solutions for premium restaurants and chain dining.', features: ['专属品种', '规格定制', '优先配送', '季节限定'] },
      ],

      enterpriseStats: [
        { num: '200+', label: '合作企业', labelEn: 'Partner Enterprises' },
        { num: '50万+', label: '年供应量(斤)', labelEn: 'Annual Supply (kg)' },
        { num: '99.8%', label: '客户满意度', labelEn: 'Customer Satisfaction' },
        { num: '24h', label: '售后响应', labelEn: 'After-sales Response' },
      ],

      // 订阅套餐
      subscriptionPlans: [
        { name: '体验装', nameEn: 'Starter', price: '68', period: '周', periodEn: 'week', desc: '适合1-2人小家庭，每周体验当季有机蔬菜。', descEn: 'Perfect for 1-2 person households. Weekly seasonal organic veggies.', featured: false, features: ['3-4种当季蔬菜', '约3kg/周', '每周一定时配送', '随时可取消'] },
        { name: '家庭装', nameEn: 'Family', price: '128', period: '周', periodEn: 'week', desc: '适合3-5人家庭，蔬菜水果搭配，营养均衡。', descEn: 'Ideal for 3-5 person families. Veggies and fruits for balanced nutrition.', featured: true, features: ['6-8种蔬果搭配', '约5kg/周', '每周一定时配送', '附赠食谱卡', '专属客服'] },
        { name: '尊享装', nameEn: 'Premium', price: '238', period: '周', periodEn: 'week', desc: '适合追求品质生活的家庭，包含稀有品种和进口有机食材。', descEn: 'For families who demand the best. Includes rare varieties and imported organic ingredients.', featured: false, features: ['10-12种精选蔬果', '约8kg/周', '每周一定时配送', '含稀有品种', '附赠食谱+礼品', 'VIP专属客服'] },
      ],

      // 客户评价
      testimonials: [
        {
          text: '第一次订了蔬菜套餐，打开箱子确实新鲜，生菜根上还带着泥。就是品种选择可以再多一些，连续吃了两周有点重复。',
          textEn: 'First time ordering the veggie box. The produce was fresh, lettuce still had soil on the roots. Just wish there were more variety — got a bit repetitive after two weeks.',
          stars: 4,
          name: '陈女士',
          nameEn: 'Ms. Chen',
          avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&q=80',
        },
        {
          text: '给公司食堂供了半年菜，品质比较稳定。偶尔有一两箱状态不太好，客服处理还算及时。',
          textEn: 'Been supplying our company canteen for 6 months. Quality is consistent. Occasionally a box or two is subpar, but customer service handles it promptly.',
          stars: 4,
          name: '刘经理',
          nameEn: 'Mr. Liu',
          avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80',
        },
        {
          text: '带孩子去农场参观过，小孩第一次知道番茄是长在藤上的不是超市里长出来的。体验不错，就是周末人太多了。',
          textEn: 'Took my kid to visit the farm. First time they learned tomatoes grow on vines, not in supermarkets. Great experience, just too crowded on weekends.',
          stars: 5,
          name: '赵先生',
          nameEn: 'Mr. Zhao',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
        },
      ],

      // 新闻资讯
      news: [
        {
          date: '2025-04-15',
          title: '北京有机农产品抽检合格率公布，绿源农业连续三年100%达标',
          titleEn: 'Beijing Organic Product Inspection Results: Green Source 100% Compliant for 3 Consecutive Years',
          desc: '北京市农业农村局发布2025年第一季度有机农产品抽检结果，绿源农业送检的128个样品全部合格，连续三年保持100%合格率。',
          descEn: 'Beijing Agriculture Bureau published Q1 2025 organic product inspection results. All 128 samples from Green Source passed, maintaining 100% compliance for 3 years.',
          image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&q=80',
        },
        {
          date: '2025-04-08',
          title: '新发地市场有机蔬菜专区开业，绿源农业等12家企业入驻',
          titleEn: 'Xinfadi Market Opens Organic Vegetable Zone, Green Source Among 12 Enterprises',
          desc: '新发地批发市场设立有机蔬菜专区，绿源农业等12家获得有机认证的企业首批入驻，专区实行统一溯源管理。',
          descEn: 'Xinfadi wholesale market established an organic vegetable zone. Green Source and 11 other certified enterprises are the first batch, with unified traceability management.',
          image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=600&q=80',
        },
        {
          date: '2025-03-28',
          title: '农业农村部发布新规：有机产品包装须标注追溯码',
          titleEn: 'New Regulation: Organic Products Must Display Traceability Codes',
          desc: '新修订的《有机产品认证管理办法》要求，自2025年7月1日起，所有有机产品包装须印制可追溯二维码，消费者扫码即可查看生产全流程信息。',
          descEn: 'The revised Organic Product Certification Management Rules require all organic products to carry traceability QR codes from July 1, 2025. Consumers can scan to view the full production process.',
          image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80',
        },
      ],

      // 导航菜单（新增 route 字段）
      navItems: [
        { text: '首页', textEn: 'Home', route: '/', href: '#hero' },
        { text: '有机产品', textEn: 'Products', route: '/products', href: '#products', children: [
          { text: '新鲜蔬菜', textEn: 'Fresh Vegetables', route: '/products?category=vegetable', href: '#products' },
          { text: '有机水果', textEn: 'Organic Fruits', route: '/products?category=fruit', href: '#products' },
          { text: '优质谷物', textEn: 'Premium Grains', route: '/products?category=grain', href: '#products' },
          { text: '乳制品', textEn: 'Dairy Products', route: '/products?category=dairy', href: '#products' },
        ]},
        { text: '农场故事', textEn: 'Our Story', route: '/story', href: '#about', children: [
          { text: '关于我们', textEn: 'About Us', route: '/story', href: '#about' },
          { text: '创始人说', textEn: "Founder's Words", route: '/story', href: '#founder' },
          { text: '发展历程', textEn: 'Milestones', route: '/story', href: '#milestones' },
          { text: '有机认证', textEn: 'Certifications', route: '/story', href: '#certifications' },
          { text: '团队成员', textEn: 'Team', route: '/story', href: '#team' },
        ]},
        { text: '客户案例', textEn: 'Cases', route: '/cases', href: '#testimonials', children: [
          { text: '金色麦田', textEn: 'Golden Wheat', route: '/cases?project=0', href: '#projects' },
          { text: '智能温室', textEn: 'Smart Greenhouse', route: '/cases?project=1', href: '#projects' },
          { text: '生态农场', textEn: 'Eco Farm', route: '/cases?project=2', href: '#projects' },
          { text: '企业合作', textEn: 'Enterprise', route: '/cases', href: '#enterprise' },
          { text: '订阅套餐', textEn: 'Subscriptions', route: '/cases', href: '#subscriptions' },
        ]},
        { text: '联系我们', textEn: 'Contact', route: '/contact', href: '#footer' },
      ],
    });

    // ========== 计算属性 ==========

    // 购物车商品总数
    const cartCount = computed(() => {
      return state.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    });

    // 购物车总价
    const cartTotal = computed(() => {
      return state.cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    });

    // 购物车是否为空
    const cartEmpty = computed(() => {
      return state.cartItems.length === 0;
    });

    // ========== 响应式翻译 computed 属性 ==========

    const displayNavItems = computed(() => state.navItems.map(n => {
      const item = {
        ...n,
        displayText: state.isChinese ? n.text : (n.textEn || n.text),
      };
      if (n.children) {
        item.children = n.children.map(c => ({
          ...c,
          displayText: state.isChinese ? c.text : (c.textEn || c.text),
        }));
      }
      return item;
    }));

    const displayFeatures = computed(() => state.features.map(f => ({
      ...f,
      displayTitle: state.isChinese ? f.title : (f.titleEn || f.title),
      displayDesc: state.isChinese ? f.desc : (f.descEn || f.desc),
    })));

    const displayProducts = computed(() => state.products.map(p => ({
      ...p,
      displayName: state.isChinese ? p.name : (p.nameEn || p.name),
      displayDesc: state.isChinese ? p.desc : (p.descEn || p.desc),
    })));

    const displayServices = computed(() => state.services.map(s => ({
      ...s,
      displayTitle: state.isChinese ? s.title : (s.titleEn || s.title),
    })));

    const displayProjects = computed(() => state.projects.map(p => ({
      ...p,
      displayTitle: state.isChinese ? p.title : (p.titleEn || p.title),
      displayDesc: state.isChinese ? (p.desc || '') : (p.descEn || p.desc || ''),
    })));

    const displayTeam = computed(() => state.team.map(t => ({
      ...t,
      displayName: state.isChinese ? t.name : (t.nameEn || t.name),
      displayRole: state.isChinese ? t.role : (t.roleEn || t.role),
    })));

    const displayTestimonials = computed(() => state.testimonials.map(t => ({
      ...t,
      displayText: state.isChinese ? t.text : (t.textEn || t.text),
      displayName: state.isChinese ? t.name : (t.nameEn || t.name),
    })));

    const displayNews = computed(() => state.news.map(n => ({
      ...n,
      displayTitle: state.isChinese ? n.title : (n.titleEn || n.title),
      displayDesc: state.isChinese ? n.desc : (n.descEn || n.desc),
    })));

    // 搜索过滤后的产品列表
    const filteredProducts = computed(() => {
      const products = displayProducts.value;
      if (!state.searchKeyword.trim()) return products;
      const kw = state.searchKeyword.toLowerCase();
      return products.filter(p =>
        p.displayName.toLowerCase().includes(kw) ||
        p.displayDesc.toLowerCase().includes(kw)
      );
    });

    const displayMilestones = computed(() => state.milestones);
    const displayCertifications = computed(() => state.certifications);
    const displayProcessSteps = computed(() => state.processSteps);
    const displayEnterpriseServices = computed(() => state.enterpriseServices);
    const displayEnterpriseStats = computed(() => state.enterpriseStats);
    const displaySubscriptionPlans = computed(() => state.subscriptionPlans);

    // ========== Provide 共享数据给子组件 ==========
    provide('state', state);
    provide('displayProducts', displayProducts);
    provide('displayFeatures', displayFeatures);
    provide('displayServices', displayServices);
    provide('displayProjects', displayProjects);
    provide('displayTeam', displayTeam);
    provide('displayMilestones', displayMilestones);
    provide('displayCertifications', displayCertifications);
    provide('displayProcessSteps', displayProcessSteps);
    provide('displayEnterpriseServices', displayEnterpriseServices);
    provide('displayEnterpriseStats', displayEnterpriseStats);
    provide('displaySubscriptionPlans', displaySubscriptionPlans);
    provide('displayTestimonials', displayTestimonials);
    provide('displayNews', displayNews);
    provide('addToCart', addToCart);

    // ========== 原有方法：导航与搜索 ==========

    function toggleMobileMenu() {
      state.showMobileMenu = !state.showMobileMenu;
      document.body.style.overflow = state.showMobileMenu ? 'hidden' : '';
    }

    function openSearch() {
      state.showSearch = true;
      document.body.style.overflow = 'hidden';
      nextTick(() => {
        const input = document.querySelector('.search-input');
        if (input) input.focus();
      });
    }

    function closeSearch() {
      state.showSearch = false;
      document.body.style.overflow = '';
    }

    function handleSearch() {
      if (!state.searchKeyword.trim()) return;
      const keyword = state.searchKeyword.trim();
      closeSearch();
      // 跳转到产品页，带上搜索关键词
      router.push('/products?keyword=' + encodeURIComponent(keyword));
    }

    function scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function scrollToAnchor(href) {
      state.showMobileMenu = false;
      document.body.style.overflow = '';
      if (!href || href === '#') return;
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    function navigateTo(route, href) {
      state.activeDropdown = null;
      state.showMobileMenu = false;
      document.body.style.overflow = '';
      
      const currentPath = router.currentRoute.value.fullPath;
      const currentPathNoQuery = currentPath.split('?')[0];
      const targetPath = route.split('?')[0];
      
      // 如果 href 是锚点（以 # 开头）
      if (href && href.startsWith('#')) {
        if (currentPathNoQuery === targetPath) {
          // 同一页面，直接滚动到锚点
          scrollToAnchor(href);
        } else {
          // 不同页面，先跳转再滚动
          router.push(route).then(() => {
            setTimeout(() => scrollToAnchor(href), 300);
          });
        }
        return;
      }
      
      // 如果当前路由和目标路由相同（只是 query 不同），需要先跳到无 query 再跳回来
      if (currentPath === route) {
        // 完全相同的路由，先跳到根再回来
        router.push('/').then(() => {
          setTimeout(() => router.push(route), 50);
        });
      } else {
        router.push(route);
      }
    }

    function handleScroll() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      state.isScrolled = scrollTop > 50;
      state.showBackToTop = scrollTop > 400;
    }

    // ========== 完整购物车系统 ==========

    async function addToCart(product) {
      // 如果已登录，使用API添加到购物车
      if (state.isLoggedIn) {
        await addToCartAPI(product, 1);
        state.showCart = true;
        return;
      }

      // 未登录时使用本地购物车
      const existing = state.cartItems.find(item => item.product.id === product.id);
      if (existing) {
        existing.quantity++;
      } else {
        state.cartItems.push({ product: { ...product }, quantity: 1 });
      }
      state.showCart = true;
      state.cartToast = (product.displayName || product.name) + (state.isChinese ? ' 已加入购物车' : ' added to cart');
      setTimeout(() => { state.cartToast = ''; }, 2000);
      saveCart();
    }

    function removeFromCart(index) {
      if (index >= 0 && index < state.cartItems.length) {
        state.cartItems.splice(index, 1);
        saveCart();
      }
    }

    function updateQuantity(index, delta) {
      if (index < 0 || index >= state.cartItems.length) return;
      const newQty = state.cartItems[index].quantity + delta;
      if (newQty < 1) {
        removeFromCart(index);
        return;
      }
      state.cartItems[index].quantity = newQty;
      saveCart();
    }

    function incrementQuantity(index) {
      if (index >= 0 && index < state.cartItems.length) {
        state.cartItems[index].quantity++;
        saveCart();
      }
    }

    function decrementQuantity(index) {
      if (index >= 0 && index < state.cartItems.length) {
        if (state.cartItems[index].quantity > 1) {
          state.cartItems[index].quantity--;
          saveCart();
        } else {
          removeFromCart(index);
        }
      }
    }

    function clearCart() {
      state.cartItems.splice(0);
      saveCart();
    }

    function saveCart() {
      try {
        const data = state.cartItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
        }));
        localStorage.setItem('agri_cart', JSON.stringify(data));
      } catch (e) {
        console.warn('保存购物车失败:', e);
      }
    }

    function loadCart() {
      try {
        const raw = localStorage.getItem('agri_cart');
        if (!raw) return;
        const data = JSON.parse(raw);
        if (!Array.isArray(data)) return;

        state.cartItems = data
          .filter(item => item.productId && item.quantity > 0)
          .map(item => {
            const product = state.products.find(p => p.id === item.productId);
            if (product) {
              return { product: { ...product }, quantity: item.quantity };
            }
            return null;
          })
          .filter(Boolean);
      } catch (e) {
        console.warn('加载购物车失败:', e);
        state.cartItems = [];
      }
    }

    function toggleCart() {
      state.showCart = !state.showCart;
      document.body.style.overflow = state.showCart ? 'hidden' : '';
    }

    function closeCart() {
      state.showCart = false;
      document.body.style.overflow = '';
    }

    function checkout() {
      if (state.cartItems.length === 0) return;
      if (!state.isLoggedIn) {
        openAuthModal('login');
        return;
      }
      const total = cartTotal.value.toFixed(2);
      alert(state.isChinese ? '订单提交成功！合计：¥' : 'Order submitted! Total: ¥' + total);
      clearCart();
      closeCart();
    }

    // ========== 用户认证系统 ==========

    function openAuthModal(form) {
      state.authMode = (typeof form === 'string' && form) ? form : 'login';
      state.loginMethod = 'qr';
      state.authError = '';
      state.showAuthModal = true;
      document.body.style.overflow = 'hidden';
      refreshQrCode();
    }

    function closeAuthModal() {
      state.showAuthModal = false;
      state.authError = '';
      state.loginForm.username = '';
      state.loginForm.password = '';
      state.registerForm.username = '';
      state.registerForm.code = '';
      state.registerForm.password = '';
      state.registerForm.confirm = '';
      document.body.style.overflow = '';
    }

    function switchAuthMode(mode) {
      state.authMode = mode;
      state.authError = '';
    }

    async function login() {
      state.authError = '';

      // 扫码登录判断（从 handleLogin 移入）
      if (state.loginMethod === 'qr') {
        state.authError = state.isChinese ? '扫码登录功能开发中，请使用密码登录' : 'QR login is in development, please use password login';
        return;
      }

      const username = state.loginForm.username.trim();
      const password = state.loginForm.password;

      if (!username) {
        state.authError = state.isChinese ? '请输入邮箱' : 'Please enter email';
        return;
      }
      if (!password) {
        state.authError = state.isChinese ? '请输入密码' : 'Please enter password';
        return;
      }
      if (password.length < 6) {
        state.authError = state.isChinese ? '密码至少6位' : 'Password must be at least 6 characters';
        return;
      }

      try {
        const data = await api.login({ username: username, password });
        state.isLoggedIn = true;
        state.username = data.user.username;
        state.currentUser = data.user;
        localStorage.setItem('agri_username', data.user.username);
        localStorage.setItem('agri_logged_in', 'true');
        closeAuthModal();
        state.cartToast = state.isChinese ? '登录成功，欢迎回来 ' + data.user.username + '！' : 'Login successful, welcome back ' + data.user.username + '!';
        setTimeout(() => { state.cartToast = ''; }, 2000);
        // 登录后加载购物车
        loadCartFromServer();
      } catch (error) {
        state.authError = error.message || (state.isChinese ? '登录失败，请重试' : 'Login failed, please try again');
      }
    }

    async function register() {
      state.authError = '';

      const username = state.registerForm.username.trim();
      const code = state.registerForm.code.trim();
      const password = state.registerForm.password;
      const confirm = state.registerForm.confirm;

      // 验证码检查（从 handleRegister 移入）
      if (!username) {
        state.authError = state.isChinese ? '请输入用户名' : 'Please enter username';
        return;
      }
      if (!code) {
        state.authError = state.isChinese ? '请输入验证码' : 'Please enter verification code';
        return;
      }
      if (!password) {
        state.authError = state.isChinese ? '请设置密码' : 'Please set password';
        return;
      }
      if (password.length < 6) {
        state.authError = state.isChinese ? '密码至少6位' : 'Password must be at least 6 characters';
        return;
      }
      if (password !== confirm) {
        state.authError = state.isChinese ? '两次密码不一致' : 'Passwords do not match';
        return;
      }

      try {
        const email = username + '@example.com';
        const data = await api.register({
          username: username,
          email: email,
          password: password
        });
        state.isLoggedIn = true;
        state.username = data.user.username;
        state.currentUser = data.user;
        localStorage.setItem('agri_username', data.user.username);
        localStorage.setItem('agri_logged_in', 'true');
        closeAuthModal();
        state.cartToast = state.isChinese ? '注册成功，首单立减20元！' : 'Registration successful, get 20 CNY off your first order!';
        setTimeout(() => { state.cartToast = ''; }, 3000);
      } catch (error) {
        state.authError = error.message || (state.isChinese ? '注册失败，请重试' : 'Registration failed, please try again');
      }
    }

    function sendVerifyCode() {
      if (state.codeCooldown > 0) return;
      const phone = state.registerForm.username;
      if (!phone.trim()) { state.authError = state.isChinese ? '请先输入用户名' : 'Enter username first'; return; }
      state.codeCooldown = 60;
      const timer = setInterval(() => {
        state.codeCooldown--;
        if (state.codeCooldown <= 0) clearInterval(timer);
      }, 1000);
      state.cartToast = state.isChinese ? '验证码已发送（模拟：123456）' : 'Code sent (demo: 123456)';
      setTimeout(() => { state.cartToast = ''; }, 2000);
    }

    function refreshQrCode() {
      state.qrExpired = false;
      setTimeout(() => { state.qrExpired = true; }, 120000);
    }

    function logout() {
      api.logout();
      state.isLoggedIn = false;
      state.username = '';
      state.currentUser = null;
      state.cartItems = [];
      localStorage.removeItem('agri_username');
      localStorage.removeItem('agri_logged_in');
      alert(state.isChinese ? '已退出登录' : 'Logged out');
    }

    // ========== GitHub 回调处理 ==========
    function handleGithubCallback() {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const github = urlParams.get('github');
      const error = urlParams.get('error');
      
      if (token && github) {
        localStorage.setItem('token', token);
        localStorage.setItem('agri_logged_in', 'true');
        // 清除 URL 参数
        window.history.replaceState({}, document.title, window.location.pathname);
        state.cartToast = state.isChinese ? 'GitHub 登录成功！' : 'GitHub login successful!';
        checkLoginStatus();
      } else if (error) {
        state.cartToast = state.isChinese ? 'GitHub 登录失败，请重试' : 'GitHub login failed, please try again';
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }

    async function checkLoginStatus() {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const data = await api.getCurrentUser();
          state.isLoggedIn = true;
          state.username = data.user.username;
          state.currentUser = data.user;
          loadCartFromServer();
        } catch (error) {
          console.log('Token无效，需要重新登录');
          api.clearToken();
        }
      }
    }

    // ========== API集成功能 ==========

    async function loadCartFromServer() {
      try {
        const data = await api.getCart();
        state.cartItems = data.items.map(item => ({
          product: {
            id: item.product._id,
            name: item.product.name,
            price: item.product.price,
            image: item.product.image,
            unit: item.product.unit
          },
          quantity: item.quantity
        }));
      } catch (error) {
        console.error('加载购物车失败:', error);
      }
    }

    async function addToCartAPI(product, quantity = 1) {
      if (!state.isLoggedIn) {
        openAuthModal();
        state.cartToast = state.isChinese ? '请先登录' : 'Please login first';
        setTimeout(() => { state.cartToast = ''; }, 2000);
        return;
      }

      try {
        await api.addToCart(product.id || product._id, quantity);
        await loadCartFromServer();
        state.cartToast = state.isChinese ? '已添加到购物车' : 'Added to cart';
        setTimeout(() => { state.cartToast = ''; }, 2000);
      } catch (error) {
        state.cartToast = error.message || (state.isChinese ? '添加失败' : 'Add failed');
        setTimeout(() => { state.cartToast = ''; }, 2000);
      }
    }

    async function updateCartItemAPI(productId, updates) {
      try {
        await api.updateCartItem(productId, updates);
        await loadCartFromServer();
      } catch (error) {
        console.error('更新购物车失败:', error);
      }
    }

    async function removeFromCartAPI(productId) {
      try {
        await api.removeFromCart(productId);
        await loadCartFromServer();
      } catch (error) {
        console.error('移除商品失败:', error);
      }
    }

    async function createOrder(orderData) {
      try {
        const data = await api.createOrder(orderData);
        state.cartItems = [];
        return data.order;
      } catch (error) {
        throw error;
      }
    }

    // ========== 主题切换系统 ==========

    function toggleTheme() {
      state.isDarkTheme = !state.isDarkTheme;
      document.body.classList.toggle('dark-mode', state.isDarkTheme);
      localStorage.setItem('agri_theme', state.isDarkTheme ? 'dark' : 'light');
    }

    function loadTheme() {
      const saved = localStorage.getItem('agri_theme');
      if (saved === 'dark') {
        state.isDarkTheme = true;
        document.body.classList.add('dark-mode');
      } else {
        state.isDarkTheme = false;
        document.body.classList.remove('dark-mode');
      }
    }

    // ========== 语言切换系统 ==========

    function switchLanguage() {
      state.isChinese = !state.isChinese;
      const targetLang = state.isChinese ? 'zh' : 'en';
      localStorage.setItem('agri_lang', targetLang);
    }

    function loadLanguage() {
      const saved = localStorage.getItem('agri_lang');
      if (saved === 'en') {
        state.isChinese = false;
      } else {
        state.isChinese = true;
      }
    }

    // ========== 键盘事件处理 ==========

    function handleKeydown(e) {
      if (e.key === 'Escape') {
        if (state.showSearch) closeSearch();
        if (state.showCart) closeCart();
        if (state.showAuthModal) closeAuthModal();
      }
    }

    // ========== 生命周期 ==========
    onMounted(() => {
      loadTheme();
      loadLanguage();
      handleGithubCallback();
      checkLoginStatus();
      loadCart();

      window.addEventListener('scroll', handleScroll);
      document.addEventListener('keydown', handleKeydown);
      handleScroll();
    });

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('keydown', handleKeydown);
    });

    // ========== 返回值 ==========
    return {
      state,
      cartCount,
      cartTotal,
      cartEmpty,
      filteredProducts,
      displayNavItems,
      displayFeatures,
      displayProducts,
      displayServices,
      displayProjects,
      displayTeam,
      displayTestimonials,
      displayNews,
      toggleMobileMenu,
      openSearch,
      closeSearch,
      handleSearch,
      scrollToTop,
      scrollToAnchor,
      navigateTo,
      addToCart,
      removeFromCart,
      updateQuantity,
      incrementQuantity,
      decrementQuantity,
      clearCart,
      toggleCart,
      openCart: toggleCart,
      closeCart,
      checkout,
      openAuthModal,
      closeAuthModal,
      switchAuthMode,
      login,
      register,
      sendVerifyCode,
      refreshQrCode,
      logout,
      toggleTheme,
      switchLanguage,
      toggleLanguage: switchLanguage,
      currentLang: computed(() => state.isChinese ? 'zh' : 'en'),
    };
  },
});

// 使用路由
app.use(router);

// 挂载到 #app
app.mount('#app');
