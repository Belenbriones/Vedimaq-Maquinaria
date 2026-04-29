document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       MOBILE MENU LOGIC
       ========================================================================== */
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    /* ==========================================================================
       SEARCH BAR EXPAND LOGIC
       ========================================================================== */
    const searchContainer = document.getElementById('searchContainer');
    const searchIconBtn = document.getElementById('searchIconBtn');
    const searchInput = document.getElementById('searchInput');

    if (searchIconBtn && searchContainer && searchInput) {
        searchIconBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Evitar que cierre inmediatamente
            searchContainer.classList.toggle('active');
            if (searchContainer.classList.contains('active')) {
                searchInput.focus();
            }
        });

        // Click outside para cerrar
        document.addEventListener('click', (e) => {
            if (searchContainer.classList.contains('active') && !searchContainer.contains(e.target)) {
                if (searchInput.value.trim() === '') {
                    searchContainer.classList.remove('active');
                }
            }
        });
    }

    /* ==========================================================================
       URL FILTER LOGIC (INDEX2.HTML)
       ========================================================================== */
    const urlParams = new URLSearchParams(window.location.search);
    const filtro = urlParams.get('filtro');
    const transaccion = urlParams.get('transaccion');
    
    // Filtro por Categoría
    if (filtro) {
        const catCheckboxes = document.querySelectorAll('.cat-filter-checkbox');
        if (catCheckboxes.length > 0) {
            catCheckboxes.forEach(cb => cb.checked = false);
            const targetCb = document.querySelector(`.cat-filter-checkbox[value="${filtro}"]`);
            if (targetCb) targetCb.checked = true;
        }
    }

    // Filtro por Transacción
    if (transaccion) {
        const checkCompra = document.getElementById('filter-comprar');
        const checkArriendo = document.getElementById('filter-arrendar');
        if (checkCompra && checkArriendo) {
            if (transaccion === 'arriendo') {
                checkArriendo.checked = true;
                checkCompra.checked = false;
            } else if (transaccion === 'compra') {
                checkCompra.checked = true;
                checkArriendo.checked = false;
            }
        }
    }

    /* ==========================================================================
       QUOTE MODAL LOGIC (3 STEPS)
       ========================================================================== */
    const quoteOverlay = document.getElementById('quoteOverlay');
    const quoteDrawer = document.getElementById('quoteDrawer');
    const closeDrawerBtn = document.getElementById('closeDrawer');
    const btnCancelDrawer = document.getElementById('btnCancelDrawer');
    const modalTitle = document.getElementById('modalTitle');
    
    // Step Elements
    const step1Content = document.getElementById('step1Content');
    const step2Content = document.getElementById('step2Content');
    const step3Content = document.getElementById('step3Content');
    const stepInd1 = document.getElementById('stepIndicator1');
    const stepInd2 = document.getElementById('stepIndicator2');
    const stepInd3 = document.getElementById('stepIndicator3');

    // Buttons
    const btnNextStep = document.getElementById('btnNextStep');
    const btnPrevStep = document.getElementById('btnPrevStep');
    const btnSubmitFinal = document.getElementById('btnSubmitFinal');
    const btnFinishModal = document.getElementById('btnFinishModal');

    // Display Elements
    const dCategory = document.getElementById('dCategory');
    const dProductName = document.getElementById('dProductName');
    const dProductPrice = document.getElementById('dProductPrice');
    const sImage = document.getElementById('sImage');
    const sServiceType = document.getElementById('sServiceType');
    
    // Form Inputs
    const inNombre = document.getElementById('inNombre');
    const inRut = document.getElementById('inRut');
    const inEmail = document.getElementById('inEmail');
    const inTel = document.getElementById('inTel');
    const inUbicacion = document.getElementById('inUbicacion');
    const formType = document.getElementById('formType'); // 'compra' or 'arriendo'

    // Review Elements
    const rNombre = document.getElementById('rNombre');
    const rEmail = document.getElementById('rEmail');
    const rRut = document.getElementById('rRut');
    const rTel = document.getElementById('rTel');
    const rUbicacion = document.getElementById('rUbicacion');
    const rArriendoBox = document.getElementById('rArriendoBox');

    // Cost Elements
    const cSubtotal = document.getElementById('cSubtotal');
    const cIva = document.getElementById('cIva');
    const cTotal = document.getElementById('cTotal');

    // Success Elements
    const sEmail = document.getElementById('sEmail');
    const sFolio = document.getElementById('sFolio');

    let currentPriceValue = 0; // Guardaremos el valor numérico del precio

    // Helper: Formatear moneda (CLP)
    const formatCurrency = (val) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(val);

    // Helper: Extraer números de un string "$ 33.800.000" -> 33800000
    const extractNumber = (str) => {
        const num = str.replace(/[^0-9]/g, '');
        return num ? parseInt(num, 10) : 0;
    };

    // Open Modal Function
    function openDrawer(category, productName, priceStr, imgSrc) {
        if (dCategory) dCategory.textContent = category;
        if (dProductName) dProductName.textContent = productName;
        if (dProductPrice) dProductPrice.textContent = priceStr;
        if (sImage && imgSrc) sImage.src = imgSrc;
        
        currentPriceValue = extractNumber(priceStr);

        goToStep(1); // Siempre empezar en el paso 1
        
        if (quoteOverlay) quoteOverlay.classList.add('active');
        if (quoteDrawer) quoteDrawer.classList.add('active');
        document.body.style.overflow = 'hidden'; // Evitar scroll
    }

    // Close Modal Function
    function closeDrawer() {
        if (quoteOverlay) quoteOverlay.classList.remove('active');
        if (quoteDrawer) quoteDrawer.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Navegación de Pasos
    function goToStep(step) {
        // Ocultar todos los contenidos
        step1Content.style.display = 'none';
        step2Content.style.display = 'none';
        step3Content.style.display = 'none';

        // Resetear indicadores
        stepInd1.classList.remove('active', 'completed');
        stepInd2.classList.remove('active', 'completed');
        stepInd3.classList.remove('active', 'completed');

        if (step === 1) {
            modalTitle.textContent = "COTIZACIÓN · PASO 1/3";
            step1Content.style.display = 'block';
            stepInd1.classList.add('active');
        } else if (step === 2) {
            modalTitle.textContent = "COTIZACIÓN · PASO 2/3";
            step2Content.style.display = 'block';
            stepInd1.classList.add('completed');
            stepInd2.classList.add('active');
            
            // Poblar datos
            rNombre.textContent = inNombre.value || '---';
            rRut.textContent = inRut.value || '---';
            rEmail.textContent = inEmail.value || '---';
            rTel.textContent = inTel.value || '---';
            
            if (formType.value === 'arriendo') {
                rArriendoBox.style.display = 'block';
                rUbicacion.textContent = inUbicacion.value || '---';
            } else {
                rArriendoBox.style.display = 'none';
            }

            // Calcular costos
            const subtotal = currentPriceValue;
            const iva = subtotal * 0.19;
            const total = subtotal + iva;

            cSubtotal.textContent = subtotal > 0 ? formatCurrency(subtotal) : 'A convenir';
            cIva.textContent = subtotal > 0 ? formatCurrency(iva) : '---';
            cTotal.textContent = subtotal > 0 ? formatCurrency(total) : 'A convenir';

        } else if (step === 3) {
            modalTitle.textContent = "COTIZACIÓN · PASO 3/3";
            step3Content.style.display = 'block';
            stepInd1.classList.add('completed');
            stepInd2.classList.add('completed');
            stepInd3.classList.add('active');
            
            sEmail.textContent = inEmail.value || 'tu correo';
            sFolio.textContent = 'Folio #VM-' + (Math.floor(Math.random() * 900000) + 100000);
        }
    }

    // Event Listeners: Navigation
    if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
    if (btnCancelDrawer) btnCancelDrawer.addEventListener('click', closeDrawer);
    if (quoteOverlay) quoteOverlay.addEventListener('click', closeDrawer);

    if (btnNextStep) {
        btnNextStep.addEventListener('click', () => {
            // Validación muy básica (requeridos)
            if(!inNombre.value || !inRut.value || !inEmail.value || !inTel.value) {
                alert("Por favor, completa los campos requeridos (*)");
                return;
            }
            goToStep(2);
        });
    }

    if (btnPrevStep) {
        btnPrevStep.addEventListener('click', () => goToStep(1));
    }

    if (btnSubmitFinal) {
        btnSubmitFinal.addEventListener('click', () => {
            // Simulamos el envío
            btnSubmitFinal.innerHTML = 'Enviando...';
            setTimeout(() => {
                goToStep(3);
                btnSubmitFinal.innerHTML = 'Enviar Solicitud <i class="fa-solid fa-arrow-right"></i>';
            }, 800);
        });
    }

    if (btnFinishModal) {
        btnFinishModal.addEventListener('click', () => {
            closeDrawer();
            setTimeout(() => goToStep(1), 500);
        });
    }

    // Event Listeners for all "Cotizar" buttons and full cards
    const cotizarBtns = document.querySelectorAll('.btn-cotizar-small, .btn-cotizar');
    const productCards = document.querySelectorAll('.product-card');

    cotizarBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Evitar que el click en el botón active el click en la card
            
            const card = e.target.closest('.product-card') || e.target.closest('.product-info') || e.target.closest('.hero-content');
            handleQuoteClick(card, e.target);
        });
    });

    productCards.forEach(card => {
        card.style.cursor = 'pointer'; // Asegurar feedback visual
        card.addEventListener('click', (e) => {
            // Si el click no fue directamente en el botón (que ya tiene su stopPropagation)
            handleQuoteClick(card, card);
        });
    });

    function handleQuoteClick(card, triggerEl) {
        let category = "EQUIPO INDUSTRIAL";
        let productName = "Maquinaria Seleccionada";
        let priceStr = "Consultar precio";
        let imgSrc = "img-vedimaq/grid-bg.png"; // Fallback
        
        if (card) {
            const catEl = card.querySelector('.p-category');
            const nameEl = card.querySelector('h3') || card.querySelector('h1');
            const priceEl = card.querySelector('.price') || card.querySelector('.price-value') || card.querySelector('.price-main');
            const imgEl = card.querySelector('img');
            
            if (catEl) category = catEl.textContent;
            if (nameEl) productName = nameEl.textContent;
            if (priceEl) priceStr = priceEl.textContent;
            if (imgEl && imgEl.src) imgSrc = imgEl.src;
        }

        openDrawer(category, productName, priceStr, imgSrc);
    }

    /* ==========================================================================
       TABS LOGIC (COMPRA VS ARRIENDO)
       ========================================================================== */
    const tabCompra = document.getElementById('tabCompra');
    const tabArriendo = document.getElementById('tabArriendo');
    const arriendoFields = document.getElementById('arriendoFields');

    if (tabCompra && tabArriendo) {
        tabCompra.addEventListener('click', () => {
            tabCompra.classList.add('active');
            tabArriendo.classList.remove('active');
            
            if (arriendoFields) arriendoFields.style.display = 'none';
            if (sServiceType) sServiceType.textContent = 'SERVICIO: COMPRA';
            if (formType) formType.value = 'compra';
        });

        tabArriendo.addEventListener('click', () => {
            tabArriendo.classList.add('active');
            tabCompra.classList.remove('active');
            
            if (arriendoFields) arriendoFields.style.display = 'block';
            if (sServiceType) sServiceType.textContent = 'SERVICIO: ARRIENDO';
            if (formType) formType.value = 'arriendo';
        });
    }

    /* ==========================================================================
       MAINTENANCE FORM LOGIC (INDEX3.HTML)
       ========================================================================== */
    const maintForm = document.getElementById('maintForm');
    if (maintForm) {
        maintForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simular envío
            const submitBtn = maintForm.querySelector('.btn-maint-submit');
            const originalContent = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> ENVIANDO...';
            
            setTimeout(() => {
                alert('¡Solicitud de mantenimiento enviada con éxito! Un especialista se contactará con usted en menos de 2 horas.');
                maintForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalContent;
            }, 1500);
        });
    }

    /* ==========================================================================
       CATALOG DYNAMIC LOADING (INDEX2.HTML)
       ========================================================================== */
    const paginationLinks = document.querySelectorAll('.page-link:not(.page-next)');
    const productGrid = document.querySelector('.product-grid');
    const resultsCount = document.querySelector('.results-count strong');

    if (paginationLinks.length > 0 && productGrid) {
        paginationLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                if (link.classList.contains('active')) return;

                // Cambiar estado activo
                paginationLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                // Simular carga de nuevas filas
                loadMoreMachinery();
            });
        });
    }

    function loadMoreMachinery() {
        const existingCards = Array.from(productGrid.querySelectorAll('.product-card'));
        if (existingCards.length === 0) return;

        // Añadimos 6 tarjetas (2 filas)
        const cardsToCopy = 6;
        const firstNewCardIndex = existingCards.length;

        for (let i = 0; i < cardsToCopy; i++) {
            const randomCard = existingCards[Math.floor(Math.random() * existingCards.length)];
            const newCard = randomCard.cloneNode(true);
            newCard.classList.remove('card-entry'); 
            
            newCard.style.animationDelay = `${i * 0.15}s`;
            newCard.classList.add('card-entry');

            productGrid.appendChild(newCard);
        }

        if (resultsCount) {
            resultsCount.textContent = existingCards.length + cardsToCopy;
        }

        const newAddedCards = Array.from(productGrid.querySelectorAll('.product-card')).slice(firstNewCardIndex);
        newAddedCards.forEach(card => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.btn-cotizar-small, .btn-cotizar')) {
                    handleQuoteClick(card, card);
                }
            });

            const btn = card.querySelector('.btn-cotizar-small, .btn-cotizar');
            if (btn) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleQuoteClick(card, btn);
                });
            }
        });

        const firstNewCard = newAddedCards[0];
        if (firstNewCard) {
            setTimeout(() => {
                firstNewCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
        }
    }
});

/* ==========================================================================
   PUBLISH FLOW LOGIC (index1.html)
   ========================================================================== */
function showPbStep(stepNum) {
    const step1Content = document.getElementById('pbStep1');
    const step2Content = document.getElementById('pbStep2');
    const step3Content = document.getElementById('pbStep3');
    
    const tab1 = document.getElementById('pbStepTab1');
    const tab2 = document.getElementById('pbStepTab2');
    const tab3 = document.getElementById('pbStepTab3');
    
    const line1 = document.getElementById('pbStepLine1');
    const line2 = document.getElementById('pbStepLine2');

    if (!step1Content || !step2Content || !step3Content) return;

    // Ocultar todos los contenidos
    step1Content.style.display = 'none';
    step2Content.style.display = 'none';
    step3Content.style.display = 'none';

    // Limpiar estados de los pasos
    [tab1, tab2, tab3].forEach(t => {
        if(t) t.classList.remove('active', 'completed');
    });
    [line1, line2].forEach(l => {
        if(l) l.classList.remove('completed');
    });

    // Controlar visibilidad de descripciones (UX Focus)
    const descs = document.querySelectorAll('.step-desc');
    if (stepNum > 1) {
        descs.forEach(d => d.style.display = 'none');
    } else {
        descs.forEach(d => d.style.display = 'block');
    }

    if (stepNum === 1) {
        step1Content.style.display = 'block';
        if(tab1) tab1.classList.add('active');
    } else if (stepNum === 2) {
        step2Content.style.display = 'block';
        if(tab1) tab1.classList.add('completed');
        if(line1) line1.classList.add('completed');
        if(tab2) tab2.classList.add('active');
    } else if (stepNum === 3) {
        step3Content.style.display = 'block';
        if(tab1) tab1.classList.add('completed');
        if(line1) line1.classList.add('completed');
        if(tab2) tab2.classList.add('completed');
        if(line2) line2.classList.add('completed');
        if(tab3) tab3.classList.add('active');
    }
    
    // Scroll al inicio del formulario para mejor UX
    window.scrollTo({ top: document.querySelector('.pb-stepper-container').offsetTop - 100, behavior: 'smooth' });
}
