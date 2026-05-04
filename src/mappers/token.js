export function normalizeApiKey(key = '') {
  return String(key || '').replace(/^sk-/, '');
}

export function mapSub2ApiKeyToDistToken(item) {
  return {
    id: item.id,
    name: item.name,
    key: normalizeApiKey(item.key),
    status: item.status === 'active' ? 1 : 2,
    remain_quota:
      item.quota > 0 ? Math.max(0, Math.round((item.quota - item.quota_used) * 500000)) : -1,
    unlimited_quota: !item.quota || item.quota <= 0,
    used_quota: Math.round(Number(item.quota_used || 0) * 500000),
    expired_time: item.expires_at ? Math.floor(new Date(item.expires_at).getTime() / 1000) : -1,
    created_time: item.created_at ? Math.floor(new Date(item.created_at).getTime() / 1000) : 0,
    accessed_time: item.last_used_at ? Math.floor(new Date(item.last_used_at).getTime() / 1000) : 0,
    model_limits_enabled: false,
    model_limits: '',
    group: item.group?.name || '',
    group_id: item.group_id || 0,
    rate_limit_5h: item.rate_limit_5h || 0,
    rate_limit_1d: item.rate_limit_1d || 0,
    rate_limit_7d: item.rate_limit_7d || 0,
    usage_5h: item.usage_5h || 0,
    usage_1d: item.usage_1d || 0,
    usage_7d: item.usage_7d || 0,
    tags: '[]',
    ip_whitelist: Array.isArray(item.ip_whitelist) ? item.ip_whitelist : [],
    ip_blacklist: Array.isArray(item.ip_blacklist) ? item.ip_blacklist : [],
  };
}

export function mapSub2ApiGroupToDistKeyGroup(group) {
  const limit =
    group.daily_limit_usd != null ? group.daily_limit_usd :
    group.weekly_limit_usd != null ? group.weekly_limit_usd :
    group.monthly_limit_usd != null ? group.monthly_limit_usd :
    0;

  return {
    id: group.id,
    name: group.name,
    vendor_category: group.platform || 'default',
    description: group.description || '',
    is_unavailable: group.status !== 'active',
    is_recommended: false,
    quota_price: Number(group.rate_multiplier || 0),
    quota_amount: limit > 0 ? Math.round(limit * 500000) : 0,
    subscription_type: group.subscription_type || 'standard',
    require_oauth_only: Boolean(group.require_oauth_only),
    rmb_per_usd: 0,
    discount_label: '',
    tags: '[]',
  };
}
