import { searchCep } from './helpers/cepFunctions';
// import { search } from './helpers/shopFunctions';
import './style.css';
import { createProductElement, createCartProductElement } from './helpers/shopFunctions';
import { fetchProductsList, fetchProduct } from './helpers/fetchFunctions';
import { getSavedCartIDs } from './helpers/cartFunctions';

function loading() {
  const msgLoading = document.createElement('h1');
  msgLoading.innerHTML = 'carregando...';
  msgLoading.classList.add('loading');
  document.body.appendChild(msgLoading);
}

function rmvLoading() {
  document.querySelector('.loading').remove();
}

function erro() {
  const msgErro = document.createElement('h1');
  msgErro.innerHTML = 'Algum erro ocorreu, recarregue a página e tente novamente...';
  msgErro.classList.add('error');
  document.body.appendChild(msgErro);
}

const getProducts = async (parametro) => {
  try {
    loading();
    const resultado = await fetchProductsList(parametro);
    rmvLoading();
    resultado.forEach((element) => {
      const produto = createProductElement(element);
      document.querySelector('.products').appendChild(produto);
    });
  } catch (error) {
    return erro();
  }
};

const loadCart = async () => {
  const vetorzao = getSavedCartIDs().map(fetchProduct);
  const x = await Promise.all(vetorzao);
  const cart = document.querySelector('.cart__products');

  x.forEach(async (daVez) => {
    cart.appendChild(createCartProductElement(daVez));
  });
};

function loadLS() {
  const value = JSON.parse(localStorage.getItem('LStotalPrice'));
  document.querySelector('.total-price').innerHTML = value;
}
/*
function savePriceInLocalStorage(p) {
  localStorage.setItem('LStotalPrice', JSON.stringify(p));
  loadLS();
}
*/

const x = document.querySelector('.busca-input');

export const search = async () => {
  const elemento = document.querySelector('.products');
  while (elemento.firstChild) {
    elemento.removeChild(elemento.firstChild);
  }
  await getProducts(x.value);

  const entrada = x.value;
  localStorage.setItem('entradaLS', JSON.stringify(entrada));
};

document.querySelector('.busca-button').addEventListener('click', search);
document.querySelector('.cep-button').addEventListener('click', searchCep);

const first = async () => {
  const item = JSON.parse(localStorage.getItem('entradaLS'));
  if (item === null) {
    getProducts('computador');
  } else {
    await getProducts(item);
  }
};

window.onload = async () => {
  loadLS();
  loadCart();
  first();
};
