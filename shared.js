export const currentMonth = new Date().toLocaleString("en-us", {
  month: "short",
  year: "numeric",
});

export const formatCurrency = (amnt) =>
  Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amnt);

export const generateCategoryId = () => Math.floor(Math.random() * 90 + 10);
