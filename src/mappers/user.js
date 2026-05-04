export const QUOTA_PER_UNIT = 500000;

export function mapSub2ApiUserToDistUser(user, usage = null) {
  const balance = Number(user?.balance || 0);
  const totalRequests = Number(usage?.total_requests || 0);
  const usedQuota = Number(usage?.total_actual_cost ?? usage?.total_cost ?? 0);

  return {
    id: user?.id,
    username: user?.username || user?.email || '',
    email: user?.email || '',
    role: user?.role || 'user',
    status: user?.status === 'active' ? 1 : 2,
    quota: Math.round(balance * QUOTA_PER_UNIT),
    used_quota: Math.round(usedQuota * QUOTA_PER_UNIT),
    request_count: totalRequests,
    aff_quota: 0,
    aff_history_quota: 0,
    aff_count: 0,
    commission_rate: 0,
    default_commission_rate: 0,
    concurrency: Number(user?.concurrency || 0),
  };
}
