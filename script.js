document.addEventListener('DOMContentLoaded', () => {

    // --- AUTH LOGIC ---
    const authBtn = document.getElementById('headerAuthBtn');
    const isAuth = localStorage.getItem('vedimaq_auth') === 'true';
    if (authBtn) {
        if (isAuth) {
            authBtn.innerHTML = '<i class="fa-solid fa-user"></i> Mi Dashboard';
            authBtn.href = 'dashboard.html';
        } else {
            authBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Iniciar Sesión';
            authBtn.href = 'login.html';
        }
    }

    // Protect Routes
    const path = window.location.pathname;
    if ((path.includes('index1.html') || path.includes('index3.html')) && !isAuth) {
        window.location.href = 'login.html';
        return;
    }

    // --- LOGIN SIMULATION ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            localStorage.setItem('vedimaq_auth', 'true');
            window.location.href = 'dashboard.html';
        });
    }

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
       QUOTE MODAL LOGIC (REFACOR VEDIMAQ PREMIUM)
       ========================================================================== */
    
    // Chile Locations Data
    const chileData = {
        "Región de Valparaíso": ["Valparaíso", "Viña del Mar", "Concón", "Quilpué", "Villa Alemana", "San Antonio"],
        "Región Metropolitana": ["Santiago", "Las Condes", "Maipú", "Puente Alto", "Quilicura", "Colina"],
        "Región de Antofagasta": ["Antofagasta", "Calama", "Tocopilla", "Mejillones"],
        "Región del Biobío": ["Concepción", "Talcahuano", "Coronel", "Hualpén"]
    };

    const quoteOverlay = document.getElementById('quoteOverlay');
    const quoteDrawer = document.getElementById('quoteDrawer');
    const closeDrawerBtn = document.getElementById('closeDrawer');
    const btnCancelDrawer = document.getElementById('btnCancelDrawer');
    const modalTitle = document.getElementById('modalTitle');
    
    // Step Containers
    const steps = [
        document.getElementById('step1Content'),
        document.getElementById('step2Content'),
        document.getElementById('step3Content')
    ];
    const stepIndicators = [
        document.getElementById('stepIndicator1'),
        document.getElementById('stepIndicator2'),
        document.getElementById('stepIndicator3')
    ];

    // Form Inputs & Controls
    const tabCompra = document.getElementById('tabCompra');
    const tabArriendo = document.getElementById('tabArriendo');
    const arriendoFields = document.getElementById('arriendoFields');
    const formType = document.getElementById('formType'); // 'compra' or 'arriendo'
    
    const inRegion = document.getElementById('inRegion');
    const inComuna = document.getElementById('inComuna');
    const inFechaIni = document.getElementById('inFechaIni');
    const inFechaFin = document.getElementById('inFechaFin');
    const durationBadge = document.getElementById('durationBadge');
    const daysCount = document.getElementById('daysCount');

    // Review Elements
    const rvModeBadge = document.getElementById('rvModeBadge');
    const rvNombre = document.getElementById('rvNombre');
    const rvEmail = document.getElementById('rvEmail');
    const rvTel = document.getElementById('rvTel');
    const rvRut = document.getElementById('rvRut');
    const rvArriendoSection = document.getElementById('rvArriendoSection');
    const rvUbicacion = document.getElementById('rvUbicacion');
    const rvFechas = document.getElementById('rvFechas');
    const rvDuracion = document.getElementById('rvDuracion');
    const rvEquipo = document.getElementById('rvEquipo');
    const rvPrecio = document.getElementById('rvPrecio');

    const csSubtotal = document.getElementById('csSubtotal');
    const csIva = document.getElementById('csIva');
    const csTotal = document.getElementById('csTotal');

    // Showcase Elements
    const mainReviewImg = document.getElementById('mainReviewImg');
    const reviewThumbs = document.getElementById('reviewThumbs');
    
    // Step 1 Summary Card Elements
    const dCategory = document.getElementById('dCategory');
    const dProductName = document.getElementById('dProductName');
    const dProductPrice = document.getElementById('dProductPrice');
    const sImage = document.getElementById('sImage');
    const sThumbs = document.getElementById('sThumbs');
    const sServiceBadge = document.getElementById('sServiceBadge');
    const sServiceType = document.getElementById('sServiceType'); // Fallback for old refs

    // State
    let currentStep = 1;
    let selectedProduct = {
        name: '',
        category: '',
        price: 0,
        priceStr: '',
        img: '',
        thumbs: []
    };

    // Initialize Regions
    if (inRegion) {
        Object.keys(chileData).forEach(reg => {
            const opt = document.createElement('option');
            opt.value = reg;
            opt.textContent = reg;
            inRegion.appendChild(opt);
        });

        inRegion.addEventListener('change', () => {
            inComuna.innerHTML = '<option value="">Selecciona Comuna</option>';
            if (inRegion.value) {
                inComuna.disabled = false;
                chileData[inRegion.value].forEach(com => {
                    const opt = document.createElement('option');
                    opt.value = com;
                    opt.textContent = com;
                    inComuna.appendChild(opt);
                });
            } else {
                inComuna.disabled = true;
            }
        });
    }

    const setMode = (mode) => {
        if (mode === 'arriendo') {
            if (tabArriendo) tabArriendo.classList.add('active');
            if (tabCompra) tabCompra.classList.remove('active');
            if (arriendoFields) arriendoFields.classList.remove('hidden');
            if (formType && formType.tagName !== 'SELECT') formType.value = 'arriendo';
            if (sServiceBadge) sServiceBadge.textContent = 'SERVICIO: ARRIENDO';
            if (sServiceType) sServiceType.textContent = 'SERVICIO: ARRIENDO';
        } else {
            if (tabCompra) tabCompra.classList.add('active');
            if (tabArriendo) tabArriendo.classList.remove('active');
            if (arriendoFields) arriendoFields.classList.add('hidden');
            if (formType && formType.tagName !== 'SELECT') formType.value = 'compra';
            if (sServiceBadge) sServiceBadge.textContent = 'SERVICIO: COMPRA';
            if (sServiceType) sServiceType.textContent = 'SERVICIO: COMPRA';
        }
    };

    if (tabCompra) tabCompra.addEventListener('click', () => setMode('compra'));
    if (tabArriendo) tabArriendo.addEventListener('click', () => setMode('arriendo'));
    
    if (formType && formType.tagName === 'SELECT') {
        formType.addEventListener('change', (e) => setMode(e.target.value));
        // Initialize
        setTimeout(() => setMode(formType.value), 100);
    }

    // Date Logic
    const updateDuration = () => {
        if (inFechaIni.value && inFechaFin.value) {
            const start = new Date(inFechaIni.value);
            const end = new Date(inFechaFin.value);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            
            if (end >= start) {
                durationBadge.classList.remove('hidden');
                daysCount.textContent = diffDays;
            } else {
                durationBadge.classList.add('hidden');
            }
        }
    };
    if (inFechaIni) inFechaIni.addEventListener('change', updateDuration);
    if (inFechaFin) inFechaFin.addEventListener('change', updateDuration);

    // Modal Navigation
    const goToStep = (n) => {
        currentStep = n;
        steps.forEach((s, i) => {
            if (s) {
                if (i === n - 1) {
                    s.classList.add('active');
                    s.classList.remove('hidden');
                    s.style.display = '';
                } else {
                    s.classList.remove('active');
                    s.classList.add('hidden');
                    s.style.display = 'none';
                }
            }
        });
        stepIndicators.forEach((ind, i) => {
            if (ind) {
                ind.classList.toggle('active', i === n - 1);
                ind.classList.toggle('completed', i < n - 1);
            }
        });

        if (n === 2) populateReview();
        if (n === 1 && modalTitle) modalTitle.textContent = "COTIZACIÓN -PASOS 1/3";
        if (n === 2 && modalTitle) modalTitle.textContent = "COTIZACIÓN -PASOS 2/3";
        if (n === 3 && modalTitle) modalTitle.textContent = "COTIZACIÓN -PASOS 3/3";
    };

    const populateReview = () => {
        if (rvNombre && document.getElementById('inNombre')) rvNombre.textContent = document.getElementById('inNombre').value;
        if (rvEmail && document.getElementById('inEmail')) rvEmail.textContent = document.getElementById('inEmail').value;
        if (rvTel && document.getElementById('inTel')) rvTel.textContent = document.getElementById('inTel').value;
        if (rvRut && document.getElementById('inRut')) rvRut.textContent = document.getElementById('inRut').value;
        if (rvEquipo) rvEquipo.textContent = selectedProduct.name;
        if (rvPrecio) rvPrecio.textContent = selectedProduct.priceStr;
        
        if (formType) {
            const isArriendo = formType.value === 'arriendo';
            if (rvModeBadge) rvModeBadge.textContent = isArriendo ? 'MODO: ARRIENDO' : 'MODO: COMPRA';
            if (rvArriendoSection) rvArriendoSection.classList.toggle('hidden', !isArriendo);

            if (isArriendo) {
                if (rvUbicacion && inComuna && inRegion && document.getElementById('inDireccion')) {
                    rvUbicacion.textContent = `${inComuna.value}, ${inRegion.value} - ${document.getElementById('inDireccion').value}`;
                }
                if (rvFechas && inFechaIni && inFechaFin) rvFechas.textContent = `${inFechaIni.value} al ${inFechaFin.value}`;
                if (rvDuracion && daysCount) rvDuracion.textContent = `${daysCount.textContent} días de faena`;
            }
        }

        // Costs
        const formatCLP = (v) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(v);
        const sub = selectedProduct.price;
        const iva = sub * 0.19;
        const total = sub + iva;

        if (csSubtotal) csSubtotal.textContent = sub > 0 ? formatCLP(sub) : 'A convenir';
        if (csIva) csIva.textContent = sub > 0 ? formatCLP(iva) : '---';
        if (csTotal) csTotal.textContent = sub > 0 ? formatCLP(total) : 'A convenir';

        // Gallery
        if (mainReviewImg) mainReviewImg.src = selectedProduct.img;
        if (reviewThumbs) {
            reviewThumbs.innerHTML = '';
            const allPhotos = [selectedProduct.img, ...selectedProduct.thumbs];
            allPhotos.forEach((src, idx) => {
                if (src && !src.includes('undefined')) {
                    const thumb = document.createElement('div');
                    thumb.className = `thumb-item ${idx === 0 ? 'active' : ''}`;
                    thumb.innerHTML = `<img src="${src}" alt="Thumb">`;
                    thumb.onclick = () => {
                        if (mainReviewImg) mainReviewImg.src = src;
                        document.querySelectorAll('.thumb-item').forEach(t => t.classList.remove('active'));
                        thumb.classList.add('active');
                    };
                    reviewThumbs.appendChild(thumb);
                }
            });
        }
    };

    // Form Validation
    const validateStep1 = () => {
        const required = ['inNombre', 'inRut', 'inEmail', 'inTel'];
        if (formType && formType.value === 'arriendo') {
            required.push('inRegion', 'inComuna', 'inDireccion', 'inFechaIni', 'inFechaFin');
        }
        
        for (const id of required) {
            const el = document.getElementById(id);
            if (el && !el.value) {
                alert(`Por favor, completa todos los campos obligatorios.`);
                el.focus();
                return false;
            }
        }
        return true;
    };

    // Public API for opening
    window.openQuoteModal = (product) => {
        selectedProduct = {
            ...product,
            thumbs: product.thumbs || ['img-vedimaq/grid-bg.png', 'img-vedimaq/maquinaria-dibujo.png', 'img-vedimaq/vedimaq-favicon.png'] // Mock thumbs
        };

        // Populate Step 1 Card
        if (dCategory) dCategory.textContent = product.category || "EQUIPO INDUSTRIAL";
        if (dProductName) dProductName.textContent = product.name;
        if (dProductPrice) dProductPrice.textContent = product.priceStr;
        if (sImage) sImage.src = product.img;

        // Step 1 Thumbs
        if (sThumbs) {
            sThumbs.innerHTML = '';
            const allPhotos = [product.img, ...selectedProduct.thumbs];
            allPhotos.forEach((src, idx) => {
                if (src && !src.includes('undefined')) {
                    const img = document.createElement('img');
                    img.src = src;
                    img.className = `qpc-thumb ${idx === 0 ? 'active' : ''}`;
                    img.onclick = () => {
                        if (sImage) sImage.src = src;
                        sThumbs.querySelectorAll('.qpc-thumb').forEach(t => t.classList.remove('active'));
                        img.classList.add('active');
                    };
                    sThumbs.appendChild(img);
                }
            });
        }

        goToStep(1);
        quoteOverlay.classList.add('active');
        quoteDrawer.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeQuoteModal = () => {
        quoteOverlay.classList.remove('active');
        quoteDrawer.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (closeDrawerBtn) closeDrawerBtn.onclick = closeQuoteModal;
    if (quoteOverlay) quoteOverlay.onclick = closeQuoteModal;
    if (btnCancelDrawer) btnCancelDrawer.onclick = closeQuoteModal;

    if (document.getElementById('btnNextStep')) {
        document.getElementById('btnNextStep').onclick = () => {
            if (validateStep1()) goToStep(2);
        };
    }
    if (document.getElementById('btnPrevStep')) {
        document.getElementById('btnPrevStep').onclick = () => goToStep(1);
    }
    if (document.getElementById('btnSubmitFinal')) {
        document.getElementById('btnSubmitFinal').onclick = () => {
            document.getElementById('btnSubmitFinal').innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Procesando...';
            setTimeout(() => {
                const sEmail = document.getElementById('sEmail');
                const inEmail = document.getElementById('inEmail');
                if (sEmail && inEmail) sEmail.textContent = inEmail.value;

                goToStep(3);
                document.getElementById('btnSubmitFinal').innerHTML = 'Confirmar y Enviar <i class="fa-solid fa-paper-plane"></i>';
                
                // Configurar WhatsApp Button
                const btnWhatsApp = document.getElementById('btnWhatsApp');
                if (btnWhatsApp) {
                    btnWhatsApp.style.display = 'flex';
                    const mode = formType.value;
                    const phone = '56998272162';
                    const userName = document.getElementById('inNombre').value;
                    const equipo = selectedProduct.name;
                    const price = csTotal ? csTotal.textContent : '';
                    const text = encodeURIComponent(`Hola Vedimaq, soy ${userName}. Me gustaría cotizar la ${mode} del equipo: ${equipo}. El valor estimado arrojado es de ${price}. Por favor, contáctenme.`);
                    
                    btnWhatsApp.onclick = () => window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
                }
            }, 1200);
        };
    }
    
    // PDF Simulation
    const btnDownloadPdf = document.getElementById('btnDownloadPdf');
    if (btnDownloadPdf) {
        btnDownloadPdf.onclick = () => {
            const originalText = btnDownloadPdf.innerHTML;
            btnDownloadPdf.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Generando PDF...';
            setTimeout(() => {
                btnDownloadPdf.innerHTML = '<i class="fa-solid fa-check"></i> Descarga Completa';
                setTimeout(() => { btnDownloadPdf.innerHTML = originalText; }, 2000);
            }, 1500);
        };
    }
    if (document.getElementById('btnFinishModal')) {
        document.getElementById('btnFinishModal').onclick = closeQuoteModal;
    }

    // Global selector for cotizar buttons
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-cotizar-small, .btn-cotizar');
        if (btn) {
            e.preventDefault();
            const card = btn.closest('.product-card') || btn.closest('.hero-content');
            if (card) {
                const name = card.querySelector('h3, h1')?.textContent || 'Equipo Vedimaq';
                const priceStr = card.querySelector('.price-main, .price-value')?.textContent || 'A convenir';
                const price = extractNumber(priceStr);
                const img = card.querySelector('img')?.src || 'img-vedimaq/grid-bg.png';
                
                window.openQuoteModal({ name, price, priceStr, img });
            }
        }
    });

    const extractNumber = (str) => {
        const num = str.replace(/[^0-9]/g, '');
        return num ? parseInt(num, 10) : 0;
    };

    /* ==========================================================================
       MAINTENANCE FORM LOGIC (INDEX3.HTML)
       ========================================================================== */
    const maintForm = document.getElementById('maintForm');
    if (maintForm) {
        maintForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Recopilar datos del formulario
            const inputs = maintForm.querySelectorAll('input, select');
            const tipoText = inputs[0].options[inputs[0].selectedIndex].text;
            const marca = inputs[1].value;
            const modelo = inputs[2].value;
            const fecha = inputs[3].value;
            const hora = inputs[4].value;
            const lugarText = inputs[5].options[inputs[5].selectedIndex].text;
            
            // Simular envío
            const submitBtn = maintForm.querySelector('.btn-maint-submit');
            const originalContent = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> ENVIANDO CORREO...';
            
            setTimeout(() => {
                // Guardar datos en sesión para el dashboard
                const maintData = {
                    tipo: tipoText,
                    marca: marca,
                    modelo: modelo,
                    fecha: fecha,
                    hora: hora,
                    lugar: lugarText,
                    estado: 'Pendiente'
                };
                localStorage.setItem('vedimaq_maint_data', JSON.stringify(maintData));
                localStorage.setItem('vedimaq_has_maint', 'true');
                
                // Mostrar mensaje en consola simulando envío de correo
                console.log(`[SIMULACIÓN] Correo enviado al usuario con los detalles:\nServicio: ${tipoText}\nEquipo: ${marca} ${modelo}\nAgendado para: ${fecha} a las ${hora}\nLugar: ${lugarText}`);
                
                // Ocultar form y mostrar éxito
                maintForm.style.display = 'none';
                const infoList = document.getElementById('maint-info-list');
                if(infoList) infoList.style.display = 'none';
                
                const successScreen = document.getElementById('maint-success-screen');
                if (successScreen) {
                    successScreen.style.display = 'block';
                    
                    // Configurar botón WhatsApp
                    const mensajeWa = `Hola Vedimaq, he solicitado un mantenimiento. Detalles:%0A- Tipo: ${tipoText}%0A- Equipo: ${marca} ${modelo}%0A- Fecha: ${fecha} a las ${hora}%0A- Lugar: ${lugarText}`;
                    const waBtn = document.getElementById('maint-whatsapp-btn');
                    if (waBtn) {
                        waBtn.href = `https://wa.me/56998272162?text=${mensajeWa}`;
                    }
                }
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

// Password Visibility Toggle
function togglePasswordVisibility(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    if (input && icon) {
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }
}

// Global Auth Logic
document.addEventListener('DOMContentLoaded', () => {
    const headerAuthBtn = document.getElementById('headerAuthBtn');
    if (headerAuthBtn) {
        const isLoggedIn = localStorage.getItem('vedimaq_auth') === 'true';
        if (isLoggedIn) {
            const userNameFull = localStorage.getItem('vedimaq_user_name') || 'Usuario';
            const firstName = userNameFull.split(' ')[0];
            const initial = firstName.charAt(0).toUpperCase();

            // Replace headerAuthBtn with dropdown structure
            const dropdownHTML = `
                <div class="header-user-dropdown" id="headerUserDropdown">
                    <button class="header-user-btn" id="headerUserBtn">
                        <div class="hu-avatar">${initial}</div>
                        <span class="hu-name">${firstName}</span>
                        <i class="fa-solid fa-chevron-down hu-icon"></i>
                    </button>
                    <div class="hu-menu" id="huMenu">
                        <div class="hu-menu-header">
                            <strong>${firstName}</strong>
                        </div>
                        <div class="hu-menu-divider"></div>
                        <a href="dashboard.html" class="hu-menu-item">
                            <i class="fa-regular fa-clipboard" style="color: var(--yellow);"></i> Mis publicaciones
                        </a>
                        <div class="hu-menu-divider"></div>
                        <a href="#" class="hu-menu-item hu-logout" id="huLogoutBtn">
                            <i class="fa-solid fa-arrow-right-from-bracket"></i> Cerrar sesión
                        </a>
                    </div>
                </div>
            `;
            headerAuthBtn.outerHTML = dropdownHTML;

            // Add event listeners for dropdown
            const btn = document.getElementById('headerUserBtn');
            const menu = document.getElementById('huMenu');
            if (btn && menu) {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    menu.classList.toggle('active');
                });
                document.addEventListener('click', (e) => {
                    if (!btn.contains(e.target) && !menu.contains(e.target)) {
                        menu.classList.remove('active');
                    }
                });
            }

            // Redirect 'Vender' / 'Publica tu máquina' to vender-auth.html for logged users
            const publishLinks = document.querySelectorAll('a[href="login.html"]');
            publishLinks.forEach(link => {
                link.href = 'vender-auth.html';
            });

            // Logout from header
            const logoutBtn = document.getElementById('huLogoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    localStorage.removeItem('vedimaq_auth');
                    localStorage.removeItem('vedimaq_user_name');
                    localStorage.removeItem('vedimaq_user_email');
                    window.location.href = 'index.html';
                });
            }

        } else {
            headerAuthBtn.innerHTML = '<i class="fa-regular fa-user"></i> Ingresar';
            headerAuthBtn.href = 'login.html';
        }
    }
});

// Smooth Scrolling and Hash Navigation Logic
document.addEventListener('DOMContentLoaded', () => {
    // 1. Cross-page navigation: Wait for load, then smooth scroll to hash
    if (window.location.hash) {
        // Prevent default native jump by scrolling to top initially
        window.scrollTo(0, 0);
        setTimeout(() => {
            const target = document.querySelector(window.location.hash);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    }

    // 2. Same-page smooth scroll for header links
    const hashLinks = document.querySelectorAll('a[href^="index.html#"], a[href^="#"]');
    hashLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            const targetId = href.includes('#') ? href.split('#')[1] : null;
            
            if (targetId) {
                const targetElement = document.getElementById(targetId);
                // Si estamos en la misma página (ej. en el Home) y el elemento existe
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    history.pushState(null, null, '#' + targetId);
                }
                // Si no existe (estamos en otra página), navegaremos normalmente a index.html#id
            }
        });
    });
});
