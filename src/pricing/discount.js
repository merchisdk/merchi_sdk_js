import { roundHalfEven } from './round.js';

// Mirrors the server's discount_groups.get_discounted_price: pick the tier with
// the highest lowerLimit <= qty, apply price*(1 - amount/100), round to 3dp.
export function applyDiscount(price, qty, group) {
  if (!group || group.discounts.length === 0) {
    return roundHalfEven(price, 3);
  }
  const applicable = group.discounts
    .filter((d) => d.lowerLimit <= qty)
    .sort((a, b) => b.lowerLimit - a.lowerLimit);
  const amount = applicable.length ? applicable[0].amount : 0;
  return roundHalfEven(price * (1 - amount / 100), 3);
}
