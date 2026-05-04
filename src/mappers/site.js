export function mapPublicSettingsToDistSite(settings) {
  return {
    name: settings.site_name || 'Sub2API',
    logo: settings.site_logo || '',
    announcement: settings.site_subtitle || '',
    theme_template: 'starter',
    enable_topup: Boolean(settings.payment_enabled || settings.promo_code_enabled),
    allow_sub_dist: false,
    currency: {
      code: 'USD',
      symbol: '$',
      exchange_rate: 1,
      usd_exchange_rate: 1,
    },
    topup_config: settings,
  };
}
