export function formatPrice(price) {
  let parts = price.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  if (parts[1]) {
    return parts[0] + '.' + parts[1];
  }
  return parts[0];
}