import './mocks/fetchSimulator';
import { fetchProduct } from '../helpers/fetchFunctions';
import product from './mocks/product';

// implemente seus testes aqui
describe('Teste a função fetchProduct', () => {
  it('Teste se "fetchProduct" é uma função', () => {
    expect(typeof fetchProduct).toBe('function');
  });

  it('Execute a função fetchProduct com o argumento do produto "MLB1405519561" e teste se fetch foi chamada', async () => {
    await fetchProduct('MLB1405519561');
    expect(fetch).toHaveBeenCalled();
  });

  it('Teste se, ao chamar a função fetchProduct com o argumento do produto "MLB1405519561", a função fetch utiliza o endpoint "https://api.mercadolibre.com/items/MLB1405519561"', async () => {
    await fetchProduct('MLB1405519561');
    expect(fetch).toHaveBeenCalledWith('https://api.mercadolibre.com/items/MLB1405519561');
  });

  it('Teste se o retorno da função "fetchProduct" com o argumento do produto "MLB1405519561" é uma estrutura de dados igual ao objeto "produto" que já está importado no arquivo.', async () => {
    const result = await fetchProduct('MLB1405519561');
    const send = product
    expect(result).toEqual(send);
  });

   it('Teste se, ao chamar a função fetchProduct sem argumento, retorna um erro com a mensagem: "ID não informado".', () => {
    expect(() => fetchProduct()).rejects.toThrow('ID não informado');
  });
});