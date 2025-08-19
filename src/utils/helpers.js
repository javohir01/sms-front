export function formatPrice(price) {
  let parts = price.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  if (parts[1]) {
    return parts[0] + '.' + parts[1];
  }
  return parts[0];
}

export function formatDateToIso(date) {
  try {
    if (!date) return null;
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      return null;
    }
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error("Date conversion error:", error);
    return null;
  }
}

