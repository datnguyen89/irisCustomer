const merge = require('lodash/merge')

const config = {
  all: {
    env: process.env.NODE_ENV || 'development',
    isDev: process.env.NODE_ENV !== 'production',
    basename: process.env.PUBLIC_URL,
    isBrowser: typeof window !== 'undefined',
  },
  development: {
    apiUrl: window.BASE_URL,
    minuteScaleOnClick: window.MINUTES_SCALE_ON_CLICK,
    wsUrl: window.WS_URL,
    recapchaSitekey: window.RECAPCHA_V2_SITE_KEY,
  },
  production: {
    apiUrl: window.BASE_URL,
    minuteScaleOnClick: window.MINUTES_SCALE_ON_CLICK,
    wsUrl: window.WS_URL,
    recapchaSitekey: window.RECAPCHA_V2_SITE_KEY,
  },
}
module.exports = merge(config.all, config[config.all.env])
