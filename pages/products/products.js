import { setupFavoriteButtons } from '../../script.js';
document.addEventListener('DOMContentLoaded', setupFavoriteButtons);

//impedir o comportamento padrão dos links "a href=#"
document.querySelectorAll('a[href="#"]').forEach(link => {
  link.addEventListener('click', function(event) {
    event.preventDefault();
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id'); // Obtém o ID do produto a partir da URL

  fetch('../data.json')
  .then(response => response.json())
  .then(products => {
    const product = products.find(p => p.id === productId);
    if (product) {
      // Usar querySelector para selecionar a primeira ocorrência de cada classe

      document.title = product.nome;

      //carrega as imagens do produto correspondente ao seu id
      const imagesContainer = document.querySelector('.productImage');
      imagesContainer.innerHTML = ''; 
      imagesContainer.title = product.nome;
      product.imagens.forEach(image => {
        let img = document.createElement('img');
        img.src = image;
        img.alt = product.nome;
        img.title = product.nome;
        imagesContainer.appendChild(img);
      });

      //controle de tags
      const tagsContainer = document.querySelector('.productTags');
      tagsContainer.innerHTML = '';
      product.tags.forEach((tag, index, array) => {
        let a = document.createElement('a');
        a.href = "#";
        a.classList.add('productTag');
        a.textContent = tag;
        tagsContainer.appendChild(a);

        // Verifica se não é o último elemento
        if (index < array.length - 1) {
          let separator = document.createElement('span');
          separator.textContent = ' • ';
          tagsContainer.appendChild(separator);
        }
      });


      //controle de número da porcentagem do desconto quando houver
      const discountElement = document.querySelector('.discount');
      if (product.desconto && product.desconto.trim() !== "") {
        discountElement.textContent = `-${product.desconto}%`;
      } else {
        discountElement.textContent = '';
      }

      //controle de valor do preço antigo, no caso de produto com desconto, quando houver
      const oldPriceElement = document.querySelector('.oldprice');
      if (product.precoAnterior && product.desconto.trim() !== "") {
        oldPriceElement.textContent = `R$${product.precoAnterior}`;
      } else {
        oldPriceElement.textContent = '';
      }
      
      //adiciona a imagem do produto da página esteja selecionada
      const imageProductColor = document.querySelector('.imageProductColorOptions');
      imageProductColor.innerHTML = '';

      let thumbSelected = document.createElement('img');
      thumbSelected.src = product.imagens[0];
      thumbSelected.classList.add('colorThumbnail', 'active');
      thumbSelected.title = product.cor;
      imageProductColor.appendChild(thumbSelected);

      //adiciona as thumbails das outras opções de produtos
      product.variacoes.forEach(variacaoId => {
        const variacao = products.find(p => p.id === variacaoId);
        if (!variacao) {
          console.error('variação não encontrada para o ID:', variacaoId);
          return;
        }
        let thumbOptions = document.createElement('img');
        thumbOptions.src = variacao.imagens[0];
        thumbOptions.classList.add('colorThumbnail');
        thumbOptions.title = variacao.cor
        thumbOptions.addEventListener('click', () => {
          window.location.search = `?id=${variacaoId}`;
        });
        imageProductColor.appendChild(thumbOptions);
      })

      //carrega os detalhes do produto correspondente ao seu id
      const detailsContainer = document.querySelector('.productDetails');
      detailsContainer.innerHTML = ''; 
      product.detalhes.forEach(detail => {
        let detalhe = document.createElement('li');
        detalhe.textContent = detail;
        detailsContainer.appendChild(detalhe);
      });

      //carrega os tamanhos do produto correspondente ao seu id
      const sizesContainer = document.querySelector('.sizesProduct');
      sizesContainer.innerHTML = ''; 
      let selectedSizeOption = null; // Mantém a referência ao tamanho ativo
      let firstAvailableFound = false;
      
      product.tamanhos.forEach(size => {
        let sizeOption = document.createElement('div');
        sizeOption.textContent = size;
        sizeOption.classList.add('sizeOption');
        sizeOption.alt = product.tamanho;
        sizeOption.title = product.tamanho;
        
        if (product.tamanhosDisponiveis.includes(size)) {
          sizeOption.onclick = function() {
            if (selectedSizeOption) {
              selectedSizeOption.classList.remove('actived');
            }
            sizeOption.classList.add('actived');
            selectedSizeOption = sizeOption;
          };
          // Adiciona a classe 'actived' ao primeiro tamanho disponível e não indisponível encontrado
          if (!firstAvailableFound) {
            sizeOption.classList.add('actived');
            selectedSizeOption = sizeOption; // Atualiza a referência para o tamanho ativo
            firstAvailableFound = true; //Evita que múltiplos tamanhos recebam 'actived' inicialmente
          };
        } else {
          sizeOption.classList.add('unvailable');
          sizeOption.style.pointerEvents = 'none'
          sizeOption.style.opacity = '0.5'
        }
        
        sizesContainer.appendChild(sizeOption);
      });
      
      document.querySelector('.productName').textContent = product.nome;
      document.querySelector('.productName').title = product.nome;
      document.querySelector('.productColor').textContent = product.cor;

      document.querySelector('.priceReais').textContent = product.precoReais;
      document.querySelector('.priceCents').textContent = product.precoCentavos;
      document.querySelector('.maxInstallment').textContent = `${product.parcelamento}x`;
      document.querySelector('.installmentPrice').textContent = `R$ ${product.valorParcela}`;
      document.querySelector('.totalRatingQuantity').textContent = `(${product.avaliacoes})`;

      document.querySelector('.productBanner img').src = product.banner;

      document.querySelector('.descriptionImage').src = product.imagemDescricao;
      document.querySelector('.productDescription').textContent = product.descricao;

      document.querySelector('.detailsImage').src = product.imagemDetalhes;
    }
    else {
      document.title = "Produto não encontrado";
    }
  })

  .catch(error => {
    console.error('Erro ao carregar os dados do produto:', error);
    document.title = "Erro ao carregar o produto";
  });
});

  // Função para cálculo fictício do frete
document.addEventListener('DOMContentLoaded', function() {
  var zipCodeInput = document.getElementById('zipCode');
  var shippingResult = document.getElementById('shippingResult');

  // Adiciona um ouvinte de evento ao input de CEP
  zipCodeInput.addEventListener('input', function() {
    var zipCode = zipCodeInput.value.replace(/[^0-9]/g, ''); // Permite apenas números
    zipCodeInput.value = zipCode; // Atualiza o valor do campo com somente números

    if (zipCode.length === 8) {  // Verifica se o CEP tem 8 dígitos
      calculateShipping(zipCode);  // Chama a função de cálculo do frete
    } else if (zipCode.length === 0) {
      shippingResult.innerText = "Digite um CEP para ver o valor do frete."; 
    } else {
      shippingResult.innerText = "";  // Limpa qualquer mensagem anterior enquanto o usuário não termina de digitar
    }
  });

  //Função responsável pelo cálculo
  function calculateShipping(zipCode) {
    var lastDigit = parseInt(zipCode.charAt(zipCode.length - 1));
    var cost;

    if (lastDigit <= 3) {
      cost = 20;
    } else if (lastDigit <= 6) {
      cost = 30;
    } else {
      cost = 50;
    }

    if (zipCode === "12345678") {
      cost -= 5;
    }

    shippingResult.innerText = "Calculando frete...";

    setTimeout(() => {
      shippingResult.innerText = `Custo do Frete: R$${cost},00`;
    }, 1500); // Simula um atraso
  }
});

// Animação para abrir a tabela de tamanhos
document.querySelector('.sizeGuide').addEventListener('click', function() {
  const overlay = document.querySelector('.tableOverlay');
  const guide = document.querySelector('.tableSizesGuide');
  overlay.style.display = 'block';
  guide.style.display = 'block';
  setTimeout(() => {
      overlay.style.opacity = 1;
      guide.style.opacity = 1;
      guide.style.transform = 'translate(-50%, -50%)';
  }, 10);
});

document.querySelector('.tableOverlay').addEventListener('click', closeGuide);
document.querySelector('.tableClose').addEventListener('click', closeGuide);

function closeGuide() {
  const overlay = document.querySelector('.tableOverlay');
  const guide = document.querySelector('.tableSizesGuide');
  overlay.style.opacity = 0;
  guide.style.opacity = 0;
  guide.style.transform = 'translate(-50%, -50%)';

  setTimeout(() => {
    overlay.style.display = 'none';
    guide.style.display = 'none';
  }, 10);
}

//Função para animação da abertura e fechamento dos cards "description" e "details"
document.addEventListener('DOMContentLoaded', function() {
  const descriptionToggle = document.querySelector('.descriptionSection .descriptionTitle');
  const detailsToggle = document.querySelector('.detailsSection .detailsTitle');

  // Função para aplicar a classe 'actived' aos elementos
  function applyActivedClass() {
    setActivedClass('.descriptionWrapper .descriptionImage', '.descriptionWrapper .productDescription', '.descriptionTitle .buttonRotate');
    setActivedClass('.detailsWrapper .detailsImage', '.detailsWrapper .productDetails', '.detailsTitle .buttonRotate');
  }

  // Função para configurar a classe 'actived' baseada nos seletores
  function setActivedClass(imageSelector, contentSelector, buttonSelector) {
    const image = document.querySelector(imageSelector);
    const content = document.querySelector(contentSelector);
    const button = document.querySelector(buttonSelector);

    if (image && !image.classList.contains('actived')) {
      image.classList.add('actived');
    }
    if (content && !content.classList.contains('actived')) {
      content.classList.add('actived');
    }
    if (button && !button.classList.contains('actived')) {
      button.classList.add('actived');
    }
  }

  // Verifica se a largura da tela é igual ou maior que 1024px
  if (window.innerWidth >= 1024) {
    applyActivedClass();
  }

  descriptionToggle.addEventListener('click', function() {
    toggleClass(this, '.descriptionWrapper .descriptionImage', '.descriptionWrapper .productDescription', '.descriptionTitle .buttonRotate');
  });

  detailsToggle.addEventListener('click', function() {
    toggleClass(this, '.detailsWrapper .detailsImage', '.detailsWrapper .productDetails', '.detailsTitle .buttonRotate');
  });

  function toggleClass(toggleElement, imageSelector, contentSelector, buttonSelector) {
    toggleElement.classList.toggle('actived'); // Toggle para o título e botão
    const image = document.querySelector(imageSelector);
    const content = document.querySelector(contentSelector);
    const button = document.querySelector(buttonSelector);
    
    // Verifica se a imagem ou o conteúdo existem antes de tentar toggle
    if (image) {
      image.classList.toggle('actived');
    }
    if (content) {
      content.classList.toggle('actived');
    }
    if (button) {
      button.classList.toggle('actived');
    }
  }
});


// Controla o scroll 
document.addEventListener('DOMContentLoaded', function() {
  const productPage = document.querySelector('.productPage');
  let allowControlledScroll = true;

  function handleProductPageScroll(e) {
    if (!allowControlledScroll) return; // Só atua se o scroll controlado está permitido

    const atBottom = productPage.scrollTop + productPage.clientHeight >= productPage.scrollHeight;
    if (!atBottom) {
      e.preventDefault();
      productPage.scrollTop += e.deltaY;
      console.log('Controlando scroll em .productPage');
    } else {
      console.log('Chegou ao fim de .productPage, permitindo scroll padrão');
      allowControlledScroll = false;
    }
  }

  function checkWindowPosition() {
    const atTop = window.scrollY === 0;
    if (atTop && !allowControlledScroll) {
      allowControlledScroll = true;
      console.log('Window is at top, reactivating controlled scroll in .productPage');
      triggerScrollEvent();
    }
  }

  function triggerScrollEvent() {
    // Força um pequeno scroll para reativar o mecanismo interno de controle
    window.requestAnimationFrame(() => {
      productPage.scrollTop += 1;  // Faz um pequeno scroll para ativar
      productPage.scrollTop -= 1;  // Reverte imediatamente
    });
  }

  window.addEventListener('wheel', handleProductPageScroll, { passive: false });
  window.addEventListener('scroll', checkWindowPosition, { passive: true });
});





