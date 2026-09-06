export type ReviewLabel = "pass" | "fail";
export type ReviewPair = { automated: ReviewLabel; human: ReviewLabel };

export function reviewerAgreement(reviews: ReviewPair[]) {
  if (reviews.length === 0) return { total: 0, agreements: 0, agreementRate: 0 };
  const agreements = reviews.filter(item => item.automated === item.human).length;
  return { total: reviews.length, agreements, agreementRate: Math.round((agreements / reviews.length) * 100) };
}
