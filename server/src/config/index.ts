export default {
  default: {
    // URL of the Next.js app handling Stripe subscriptions
    // Override with ALT_TEXT_BASE_URL environment variable or in config/plugins.js:
    // module.exports = () => ({
    //   'strapi-plugin-alt-text-generator': {
    //     baseUrl: 'https://your-production-url.com',
    //   },
    // });
    baseUrl: 'https://strapix.com',
  },
  validator(config: { baseUrl?: string }) {
    if (config.baseUrl && typeof config.baseUrl !== 'string') {
      throw new Error('baseUrl must be a string');
    }
  },
};
