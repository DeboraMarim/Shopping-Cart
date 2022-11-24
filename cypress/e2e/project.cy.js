const fetchMock = require('../mocks/fetch');
const {results: products, pictures} = require('../mocks/computerCategory');
const { fetchProductsList, fetchProduct } = require('../../src/helpers/fetchFunctions');

const PROJECT_URL = 'localhost:5173';
const LOADING = '.loading';
const ERRO = '.error';
const PRODUCT_SELECTOR = '.product';
const PRODUCT_TITLE = '.product__title';
const ADD_CART_BUTTON = '.product__add';
const CART_PRODUCTS = '.cart__products';
const TOTAL_PRICE = '.total-price';
const CEP_INPUT = '.cep-input';
const CEP_BUTTON = '.cep-button';
const ADDRESS_TEXT = '.cart__address';

const { results } = products;

const addToCart = (index) => {
  cy.get(PRODUCT_SELECTOR)
    .should('exist')
    .eq(index)
    .children(ADD_CART_BUTTON)
    .click();
};

const countCart = (amount) => {
  cy.get(CART_PRODUCTS)
    .children()
    .should('have.length', amount);
};

const checkPrice = (results, indexes) => {
  let total = 0;
  indexes.forEach((index) => total += results[index].price);
  cy.get(TOTAL_PRICE)
    .should('contain', total.toString());
};

describe('Shopping Cart Project', () => {
  Cypress.on('window:before:load', (win) => {
    cy.stub(win, 'fetch').callsFake(fetchMock);
  });

  beforeEach(() => {
    cy.visit(PROJECT_URL);
    cy.clearLocalStorage();
  });

  describe('1 - Desenvolva testes para atingir cobertura de 50% das funções e linhas do arquivo fetchFunctions', () => {
    it('Verifica a cobertura de testes unitários', () => {
      cy.getCoverage().its('fetchFunctions.functions.pct', { timeout: 0 }).should('be.gte', 50.00);
      cy.getCoverage().its('fetchFunctions.lines.pct', { timeout: 0 }).should('be.gte', 50.00);
    });
  });

  describe('2 - Implemente a função fetchProductsList', () => {
    beforeEach(() => {
      cy.stub(global, 'fetch').callsFake(fetchMock);
    });

    it('fetchProductsList retorna um erro quando não é passado nenhum parâmetro', (done) => {
      fetchProductsList()
        .then(() => done(new Error('A função não retornou um erro')))
        .catch((err) => {
          expect(err.message).to.be.equal('Termo de busca não informado');
          done();
        });
    });

    it('fetch é chamado com o endpoint correto ao executar fetchProductsList', () => {
      fetchProductsList('computador');
      expect(fetch).to.be.calledWith('https://api.mercadolibre.com/sites/MLB/search?q=computador');
    });

    it('fetchProductsList retorna os results da API', () => {
      cy.wrap(fetchProductsList('computador')).should('be.deep.equal', results);
    });
  });

  describe('3 - Crie uma listagem de produtos', () => {
    it('Listagem de produtos', () => {
      cy.get(PRODUCT_SELECTOR)
        .should('exist')
        .should('have.length', results.length)
        .get(PRODUCT_TITLE)
        .each(($el, index) => {
          expect($el.text()).to.be.equal(results[index].title);
        });
    });
  });

  describe('4 - Adicione um texto de `carregando` durante uma requisição à API', () => {
    it('Adicionar um texto de "carregando" durante uma requisição à API', () => {
      cy.visit(PROJECT_URL, {
        onBeforeLoad(win) {
          win.fetch = (url) => (new Promise((resolve) => {
            setTimeout(() => {
              fetchMock(url).then(resolve);
            }, 1000);
          }));
        },
      });
      cy.get(LOADING)
        .should('be.visible')
        .wait(3000);

      cy.get(LOADING)
        .should('not.exist');
    });
  });

  describe('5 - Exiba um texto de `erro` caso a requisição à API falhe', () => {
    it('O texto não deve ser exibido caso a requisição à API seja bem sucedida', () => {
      cy.get(ERRO)
        .should('not.exist');
    });

    it('Exibir um texto de "erro" caso a requisição à API falhe', () => {
      cy.visit(PROJECT_URL, {
        onBeforeLoad(win) {
          win.fetch.callsFake(() => Promise.reject(new Error('API is down')));
        },
      });
      cy.get(ERRO)
        .should('be.visible');
    });
  });

  describe('6 - Desenvolva testes para atingir cobertura de 100% das funções e linhas do arquivo fetchFunctions', () => {
    it('Verifica a cobertura de testes unitários', () => {
      cy.getCoverage().its('fetchFunctions.functions.pct', { timeout: 0 }).should('be.gte', 100.00);
      cy.getCoverage().its('fetchFunctions.lines.pct', { timeout: 0 }).should('be.gte', 100.00);
    });
  });

  describe('7 - Implemente a função `fetchProduct`', () => {
    beforeEach(() => {
      cy.stub(global, 'fetch').callsFake(fetchMock);
    });

    it('fetchProduct retorna um erro quando não é passado nenhum parâmetro', (done) => {
      fetchProduct()
        .then(() => done(new Error('A função não retornou um erro')))
        .catch((err) => {
          expect(err.message).to.be.equal('ID não informado');
          done();
        });
    });

    it('fetch é chamado com o endpoint correto ao executar fetchProduct', () => {
      fetchProduct('MLB1405519561');
      expect(fetch).to.be.calledWith('https://api.mercadolibre.com/items/MLB1405519561');
    });

    it('fetchProduct retorna os dados do produto', () => {
      const expectedResult = results.find(({ id }) => id === 'MLB1405519561');
      cy.wrap(fetchProduct('MLB1405519561')).should('be.deep.equal', {...expectedResult, pictures});
    });
  });

  describe('8 - Adicione o produto ao carrinho de compras', () => {
    it('Adicione o produto ao carrinho de compras', () => {
      cy.wait(1000);
      addToCart(36);
      countCart(1);
      cy.get(CART_PRODUCTS)
        .children()
        .first()
        .should('contain', results[36].title);
    });
  });

  describe('9 - Carregue o carrinho de compras através do **LocalStorage** ao iniciar a página', () => {
    it('Carregue o carrinho de compras através do **LocalStorage** ao iniciar a página', () => {
      const first = 36;
      const last = 29;

      addToCart(first);

      countCart(1);

      cy.get(CART_PRODUCTS)
        .children()
        .first()
        .should('contain', results[36].title);

      addToCart(last);

      countCart(2);

      cy.get(CART_PRODUCTS)
        .children()
        .last()
        .should('contain', results[29].title);

      cy.reload();

      cy.get(CART_PRODUCTS)
        .children()
        .first()
        .should('contain', results[36].title);

      cy.get(CART_PRODUCTS)
        .children()
        .last()
        .should('contain', results[29].title);

      countCart(2);
    });
  });

  describe('10 - Calcule o valor total dos itens do carrinho de compras de forma assíncrona', () => {
    it('Calcule o valor total dos itens do carrinho de compras de forma assíncrona', () => {
      addToCart(5);
      checkPrice(results, [5]);

      addToCart(42);
      checkPrice(results, [5, 42]);

      addToCart(36);
      checkPrice(results, [5, 42, 36]);

      addToCart(15);
      checkPrice(results, [5, 42, 36, 15]);

      cy.get(CART_PRODUCTS)
        .children()
        .eq(1)
        .click();
      checkPrice(results, [5, 36, 15]);
    });

    it('Ao atualizar a página, o carrinho deve continuar o mesmo', () => {
      addToCart(15);
      checkPrice(results, [15]);

      addToCart(45);
      checkPrice(results, [15, 45]);

      cy.reload();

      checkPrice(results, [15, 45]);

      cy.get(CART_PRODUCTS)
        .children()
        .first()
        .click();

      checkPrice(results, [45]);

      cy.reload();

      checkPrice(results, [45]);
    });
  });

  describe('11 - Implemente a função `getAddress`', () => { 
    it('Verifica se o endereço é exibido após o CEP ser digitado', () => {
      cy.visit(PROJECT_URL, {
        onBeforeLoad(win) {
          cy.spy(win.Promise, 'any')
        },
      });

      cy.get(CEP_INPUT).type('01001000');
      cy.get(CEP_BUTTON).click();
      cy.get(ADDRESS_TEXT).should('have.text', 'Praça da Sé - Sé - São Paulo - SP');
      cy.window().its('Promise.any').should('be.called');
    });

    it('Verifica se a mensagem `CEP não encontrado` é exibida caso o CEP não exista', () => {
      cy.get(CEP_INPUT).type('00000000');
      cy.get(CEP_BUTTON).click();
      cy.get(ADDRESS_TEXT).should('have.text', 'CEP não encontrado');
    });
  });
});
