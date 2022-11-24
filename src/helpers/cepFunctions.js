const x = document.querySelector('.cep-input');
const span = document.querySelector('.cart__address');

export const getAddress = async () => {
  const cep1 = `https://cep.awesomeapi.com.br/json/${x.value}`;
  const cep2 = `https://brasilapi.com.br/api/cep/v2/${x.value}`;

  await Promise.any([fetch(cep1), fetch(cep2)])
    .then((response) => response.json()).then((data) => {
      const address = data.address || data.street;
      const bairro = data.district || data.neighborhood;
      span.innerHTML = `${address} - ${bairro} - ${data.city} - ${data.state}`;
    });
};

export const searchCep = () => {
  // alert(x.value);
  if (!Number(x.value)) {
    span.innerHTML = 'CEP não encontrado';
    return;
  }
  getAddress();
};
