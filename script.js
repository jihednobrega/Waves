//impedir o comportamento padrão dos links "a href=#"
document.querySelectorAll('a[href="#"]').forEach(link => {
  link.addEventListener('click', function(event) {
    event.preventDefault();
  });
});


//animação do header durante o mobile
document.addEventListener("DOMContentLoaded", function() {
  const header = document.querySelector('.header');
  const body = document.body;
  const headerHeight = 110;
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', function() {
    if (window.innerWidth < 1024) {
      const currentScrollY = window.scrollY;
      let scrollDifference = currentScrollY - lastScrollY;

      let proportionalTop = Math.min(Math.max(parseInt(header.style.top.replace('px', '') || 0) - scrollDifference, -headerHeight), 0);
      let proportionalPadding = Math.min(Math.max(parseInt(body.style.paddingTop.replace('px', '') || 0) - scrollDifference, 0), headerHeight);

      header.style.top = `${proportionalTop}px`;
      body.style.paddingTop = `${proportionalPadding}px`;

      lastScrollY = currentScrollY;
    }
  }, { passive: true });
});

// Botão do like ativado
document.addEventListener("DOMContentLoaded", function() {
  const favoriteButtons = document.querySelectorAll('.favoriteBtn');

  favoriteButtons.forEach(button => {
    button.addEventListener('click', function() {
      const img = this.querySelector('img');

      if (button.tooltip) {
        button.tooltip.remove();
        button.tooltip = null;
      }
      
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.style.position = 'absolute';
      tooltip.style.opacity = '0'; 

      if (img.src.includes('/actived-like-icon.svg')) {
        img.src = 'assets/icons/like-icon.svg';
        img.alt = 'Favoritar';
        img.classList.remove('active');
        tooltip.innerText = 'Removido dos Meus Favoritos';
      } else {
        img.src = 'assets/icons/actived-like-icon.svg';
        img.alt = 'Desfavoritar';
        img.classList.add('active');
        tooltip.innerText = 'Adicionado aos Meus Favoritos';
      }

      const updatePosition = () => {
        const rect = button.getBoundingClientRect();
        const tooltipWidth = tooltip.offsetWidth;
        let leftPos = rect.left + window.scrollX + (rect.width / 2) - (tooltipWidth / 2);
  
        if (leftPos + tooltipWidth > window.innerWidth) {
          leftPos = window.innerWidth - tooltipWidth - 5; 
        }
  
        if (leftPos < 5) {
          leftPos = 5;
        }
  
        tooltip.style.left = `${leftPos}px`;
        tooltip.style.top = `${rect.top + window.scrollY - tooltip.offsetHeight - 5}px`;
      };

      document.body.appendChild(tooltip);
      updatePosition();
      window.setTimeout(() => tooltip.style.opacity = '1', 10);

      window.addEventListener('scroll', updatePosition, { passive: true });

      button.tooltip = tooltip;

      window.setTimeout(() => {
        if (tooltip === button.tooltip) {
          tooltip.remove();
          button.tooltip = null;
          window.removeEventListener('scroll', updatePosition);
        }
      }, 1500);
    });
  });
});


// Animação de pressionar o botão menu
document.addEventListener("DOMContentLoaded", function() {
  const menuButton = document.querySelector('.mobile.menu');

  menuButton.addEventListener('click', function(event) {
    event.preventDefault();
    menuButton.classList.add('pressed');
    setTimeout(() => {
      menuButton.classList.remove('pressed');
    }, 200);
  });
});

// Animação para a abertura do menu
document.addEventListener("DOMContentLoaded", function() {
  const menuButton = document.querySelector('.mobile.menu');
  const navigation = document.querySelector('.headerNavigation');

  function toggleMenu(open) {
    if (open) {
      navigation.classList.add('open');
      navigation.style.maxHeight = navigation.scrollHeight + 'px';
    } else {
      navigation.style.maxHeight = null;
      setTimeout(() => navigation.classList.remove('open'), 500);
    }
  }

  menuButton.addEventListener('click', function(event) {
    event.preventDefault();
    const isOpen = navigation.classList.contains('open');
    toggleMenu(!isOpen);
  });

  document.addEventListener('click', function(event) {
    if (!navigation.contains(event.target) && !menuButton.contains(event.target)) {
      toggleMenu(false);
    }
  });
});

// Abertura do campo do input de busca para mobile
document.addEventListener("DOMContentLoaded", function() {
  const mediaQuery = window.matchMedia('(max-width: 767px)');

  function setupMobileSearch() {
    const searchIcon = document.querySelector('.searchIcon');
    const searchInput = document.querySelector('.searchInput');
    let backgroundOverlay = document.querySelector('.backgroundOverlay');
    if (!backgroundOverlay) {
      backgroundOverlay = document.createElement('div');
      backgroundOverlay.className = 'backgroundOverlay';
      document.body.appendChild(backgroundOverlay);
    }
    const inputExit = document.querySelector('.inputExit');

    function toggleSearchInput(isOpening) {
      if (isOpening) {
        searchInput.classList.add('open');
        backgroundOverlay.classList.add('open');
        inputExit.classList.add('active');
        document.body.style.overflow = 'hidden';
        searchInput.focus();
      } else {
        searchInput.classList.remove('open');
        backgroundOverlay.classList.remove('open');
        inputExit.classList.remove('active');
        document.body.style.overflow = '';
      }
    }

    searchIcon.addEventListener('click', (event) => {
      event.preventDefault();
      const isOpen = searchInput.classList.contains('open');
      toggleSearchInput(!isOpen);
    });

    backgroundOverlay.addEventListener('click', () => toggleSearchInput(false));
    inputExit.addEventListener('click', function(event) {
      event.preventDefault();
      toggleSearchInput(false);
    });
  }

  if (mediaQuery.matches) {
    setupMobileSearch();
  }
});

// ativa o input ao clicar no icon dentro do input (lupa)
document.addEventListener("DOMContentLoaded", function() {
  const mediaQuery = window.matchMedia('(min-width: 768px)');
  
  let eventHandler = null;

  function addEventHandler() {
    var searchIcon = document.querySelector('.searchIcon');
    if (searchIcon && !eventHandler) {
      eventHandler = function() {
        document.getElementById('filter').focus();
      };
      searchIcon.addEventListener('click', eventHandler);
    }
  }

  function removeEventHandler() {
    var searchIcon = document.querySelector('.searchIcon');
    if (searchIcon && eventHandler) {
      searchIcon.removeEventListener('click', eventHandler);
      eventHandler = null; 
    }
  }

  if (mediaQuery.matches) {
    addEventHandler();
  }

  mediaQuery.addListener(function(e) {
    if (e.matches) {
      addEventHandler();
    } else {
      removeEventHandler();
    }
  });
});

//controle dos botões de quantidade dos cards
document.addEventListener("DOMContentLoaded", function() {
  const inputGroups = document.querySelectorAll('.inputBuy');

  inputGroups.forEach(group => {
    const minusButton = group.querySelector('.inputMinus');
    const plusButton = group.querySelector('.inputPlus');
    const quantityInput = group.querySelector('input[type="text"]');

    if (quantityInput.value === "01") {
      minusButton.style.opacity = "0.5";
      minusButton.style.cursor = "not-allowed";
      minusButton.disabled = true;
    }

    minusButton.addEventListener('click', function() {
      let currentValue = parseInt(quantityInput.value, 10);
      if (currentValue > 1) {
        quantityInput.value = ("0" + (currentValue - 1)).slice(-2);
        if (quantityInput.value === "01") {
          minusButton.style.opacity = "0.5";
          minusButton.style.cursor = "not-allowed";
          minusButton.disabled = true;
        }
      }
    });

    plusButton.addEventListener('click', function() {
      let currentValue = parseInt(quantityInput.value, 10);
      quantityInput.value = ("0" + (currentValue + 1)).slice(-2);

      if (currentValue >= 1) {
        minusButton.style.opacity = "1";
        minusButton.style.cursor = "pointer";
        minusButton.disabled = false;
      }
    });
  });
});

//notificação no carrinho/sacola de compras conforme os itens forem adicionados
document.addEventListener("DOMContentLoaded", function() {
  const addToCartButtons = document.querySelectorAll('.addToCart');
  const desktopCartCount = document.querySelector('.shopCart .shopCount');
  const mobileCartCount = document.querySelector('.mobile.shopBag .shopCount'); 

  function updateCartCounts(additionalQuantity) {
    let desktopCurrentCount = parseInt(desktopCartCount.textContent) || 0;
    desktopCurrentCount += additionalQuantity;
    desktopCartCount.textContent = desktopCurrentCount;
    desktopCartCount.classList.toggle('show', desktopCurrentCount > 0);

    let mobileCurrentCount = parseInt(mobileCartCount.textContent) || 0;
    mobileCurrentCount += additionalQuantity;
    mobileCartCount.textContent = mobileCurrentCount;
    mobileCartCount.classList.toggle('show', mobileCurrentCount > 0);
  }

  addToCartButtons.forEach(button => {
    button.addEventListener('click', function() {
      const productCard = button.closest('.productBuy');
      const quantityInput = productCard.querySelector('input[type="text"]');
      const quantity = parseInt(quantityInput.value, 10);
      updateCartCounts(quantity);
    });
  });
});

// Setas laterais para o aside infos
document.addEventListener("DOMContentLoaded", function() {
  const container = document.querySelector('.infoContainer');
  let currentSlide = 1;
  const totalSlides = 2;
  const leftArrow = document.querySelector('.leftArrow');
  const rightArrow = document.querySelector('.rightArrow');

  function updateArrowState() {
    leftArrow.classList.toggle('active', currentSlide > 0);
    leftArrow.classList.toggle('disabled', currentSlide === 0);
    rightArrow.classList.toggle('active', currentSlide < totalSlides);
    rightArrow.classList.toggle('disabled', currentSlide === totalSlides);
  }

  function updateSlidePosition() {
    if (currentSlide === 1) {
      container.style.transform = null;
    }
    else if (currentSlide === 0) {
      container.style.transform = `translateX(130px)`;
    }
    else if (currentSlide === totalSlides) {
      container.style.transform = `translateX(-${currentSlide * 65}px)`;
    }
    updateArrowState();
  }

  leftArrow.addEventListener('click', function() {
    if (currentSlide > 0) {
      currentSlide--;
      updateSlidePosition();
    }
  });
  
  rightArrow.addEventListener('click', function() {
    if (currentSlide < totalSlides) { 
      currentSlide++;
      updateSlidePosition();
    }
  });

  updateSlidePosition();
});