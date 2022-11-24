const { BRASIL_API, AWESOME_API } = require('./cepMock');
const { results, pictures } = require('./computerCategory')

const fetch = (url) => Promise.resolve({
  status: 200,
  ok: true,
  json: () => {
    if (url.startsWith('https://api.mercadolibre.com/items/')) {
      const productId = url.split('items/')[1]
      const product = results.results.find(({ id }) => id === productId);
      if (!product) {
        return Promise.reject(new Error('Produto não encontrado'));
      }
      return Promise.resolve({ ...product, pictures });
    }

    if (url.startsWith('https://api.mercadolibre.com/sites/MLB/search?q=')) {
      return Promise.resolve(results);
    }

    if (url.startsWith('https://cep.awesomeapi.com.br/json/')) {
      const cep = url.split('json/')[1]
      if (cep === "01001000")
        return Promise.resolve(AWESOME_API);
    }

    if (url.startsWith('https://brasilapi.com.br/api/cep/v2/')) {
      const cep = url.split('v2/')[1]
      if (cep === "01001000")
        return Promise.resolve(BRASIL_API);
    }

    return Promise.reject(new Error('URL não mapeada'));
  }
});

module.exports = fetch;
