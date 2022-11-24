export const fetchProduct = async (id) => {
  if (!id) {
    throw new Error('ID não informado');
  }
  const call = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const results = await call.json();
  return results;
};
export const fetchProductsList = async (info) => {
  if (!info) {
    throw new Error('Termo de busca não informado');
  }
  const call = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${info}`);
  const { results } = await call.json();
  return results;
};
