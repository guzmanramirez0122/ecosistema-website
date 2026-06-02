/* ============================================================
   CRM Form Widget — Fiscal & Legal
   Modal flotante global. Se inyecta en cualquier página con:
   <script src="form-widget.js"></script>
   ============================================================ */

(function () {
  'use strict';

  // ── Config ──────────────────────────────────────────────
  // El PAT de Airtable ya NO vive en el cliente. El sitio publico envia el
  // payload al backend (Velora en Railway) y este reenvia a Airtable usando
  // el secreto server-side. Puedes sobreescribir la URL definiendo
  // window.CRM_LEAD_ENDPOINT antes de cargar este script.
  var CRM_LEAD_ENDPOINT = (typeof window !== 'undefined' && window.CRM_LEAD_ENDPOINT)
    ? window.CRM_LEAD_ENDPOINT
    : 'https://velora-production-c072.up.railway.app/api/public/lead';

  // Detectar página de origen
  var paginaOrigen = (function () {
    var p = window.location.pathname.toLowerCase();
    if (p.includes('blog'))      return 'Blog';
    if (p.includes('servicio'))  return 'Servicios';
    if (p.includes('recurso'))   return 'Recursos';
    return 'Home';
  })();

  // ── CSS ─────────────────────────────────────────────────
  var css = `
    /* Botón flotante */
    #crm-fab {
      position: fixed;
      bottom: 28px;
      right: 28px;
      z-index: 9999;
      background: linear-gradient(105deg,#eceef4 0%,#c4c8d6 18%,#8090b0 42%,#b8bdd0 62%,#e8eaf2 82%,#c0c4d4 100%);
      color: #14110c;
      border: none;
      padding: 14px 24px;
      border-radius: 999px;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 600;
      letter-spacing: .3px;
      cursor: pointer;
      box-shadow: 0 8px 32px rgba(128,144,176,.35);
      transition: transform .2s, box-shadow .2s;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    #crm-fab:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 40px rgba(128,144,176,.45);
    }
    #crm-fab .crm-fab-dot {
      width: 8px; height: 8px;
      background: #493B2A;
      border-radius: 50%;
      animation: crm-pulse 2s infinite;
    }
    @keyframes crm-pulse {
      0%,100%{ opacity:1; transform:scale(1); }
      50%{ opacity:.6; transform:scale(1.3); }
    }

    /* Overlay */
    #crm-overlay {
      display: none;
      position: fixed;
      inset: 0;
      z-index: 10000;
      background: rgba(14,11,0,.62);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      overflow-y: auto;
      padding: 32px 16px 60px;
    }
    #crm-overlay.open { display: block; }

    /* Panel */
    #crm-panel {
      background: #fff;
      max-width: 560px;
      margin: 0 auto;
      border-radius: 20px;
      padding: clamp(28px,5vw,52px);
      box-shadow: 0 32px 96px rgba(0,0,0,.38);
      position: relative;
    }

    /* Cierre */
    #crm-close {
      position: absolute;
      top: 16px; right: 16px;
      width: 36px; height: 36px;
      border: 1px solid rgba(154,164,192,.3);
      background: rgba(246,245,242,.8);
      border-radius: 50%;
      cursor: pointer;
      font-size: 18px;
      color: #5c574f;
      display: flex; align-items: center; justify-content: center;
      transition: background .2s;
    }
    #crm-close:hover { background: #f0eee8; }

    /* Cabecera */
    .crm-header { margin-bottom: 24px; }
    .crm-header h2 {
      font-family: 'Playfair Display', serif;
      font-size: clamp(20px,3vw,26px);
      font-weight: 700;
      color: #14110c;
      margin: 0 0 6px;
    }
    .crm-header p {
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      color: #5c574f;
      margin: 0;
    }

    /* Divisor metálico */
    .crm-divider {
      height: 1px;
      background: linear-gradient(90deg,transparent,rgba(154,162,192,.5) 30%,rgba(154,162,192,.5) 70%,transparent);
      margin: 20px 0;
    }

    /* Toggle tipo */
    .crm-toggle {
      display: flex;
      gap: 10px;
      margin-bottom: 24px;
    }
    .crm-toggle-btn {
      flex: 1;
      padding: 14px;
      border: 2px solid rgba(154,162,192,.3);
      border-radius: 12px;
      background: #fafafa;
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      font-weight: 600;
      color: #5c574f;
      cursor: pointer;
      text-align: center;
      transition: all .2s;
    }
    .crm-toggle-btn.active {
      border-color: #9AA4C0;
      background: linear-gradient(135deg,#f0f2f8,#e4e8f2);
      color: #14110c;
      box-shadow: 0 4px 16px rgba(154,162,192,.25);
    }
    .crm-toggle-btn .crm-btn-icon { font-size: 20px; display: block; margin-bottom: 4px; }

    /* Campos */
    .crm-fields { display: none; }
    .crm-fields.visible { display: block; }

    .crm-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 12px;
    }
    @media (max-width: 480px) { .crm-row { grid-template-columns: 1fr; } }

    .crm-field { margin-bottom: 12px; }
    .crm-field label {
      display: block;
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      font-weight: 600;
      color: #493B2A;
      margin-bottom: 5px;
      letter-spacing: .3px;
      text-transform: uppercase;
    }
    .crm-field input,
    .crm-field select,
    .crm-field textarea {
      width: 100%;
      padding: 11px 14px;
      border: 1.5px solid rgba(154,162,192,.35);
      border-radius: 10px;
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      color: #14110c;
      background: #fafafa;
      box-sizing: border-box;
      transition: border-color .2s, box-shadow .2s;
      outline: none;
    }
    .crm-field input:focus,
    .crm-field select:focus,
    .crm-field textarea:focus {
      border-color: #9AA4C0;
      box-shadow: 0 0 0 3px rgba(154,162,192,.15);
      background: #fff;
    }
    .crm-field textarea { resize: vertical; min-height: 88px; }
    .crm-field .crm-optional {
      font-size: 10px;
      font-weight: 400;
      color: #9a958c;
      text-transform: none;
      letter-spacing: 0;
      margin-left: 4px;
    }

    /* Botón submit */
    .crm-submit {
      width: 100%;
      padding: 15px;
      margin-top: 8px;
      border: none;
      border-radius: 12px;
      background: linear-gradient(105deg,#eceef4 0%,#c4c8d6 18%,#8090b0 42%,#b8bdd0 62%,#e8eaf2 82%,#c0c4d4 100%);
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 700;
      color: #14110c;
      cursor: pointer;
      letter-spacing: .5px;
      box-shadow: 0 6px 24px rgba(128,144,176,.3);
      transition: transform .2s, box-shadow .2s;
    }
    .crm-submit:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 10px 32px rgba(128,144,176,.4);
    }
    .crm-submit:disabled { opacity: .65; cursor: not-allowed; }

    /* Éxito */
    #crm-success {
      display: none;
      text-align: center;
      padding: 40px 0 16px;
    }
    #crm-success.is-visible {
      display: block;
      animation: crmMsgAppear .5s cubic-bezier(.22,.68,0,1) both;
    }
    #crm-success svg {
      width: 92px; height: 92px;
      margin: 0 auto 22px;
      display: block;
      animation: crmCheckPop .6s cubic-bezier(.34,1.56,.64,1) both;
    }
    #crm-success svg circle {
      stroke-dasharray: 151;
      stroke-dashoffset: 151;
      animation: crmDrawCircle .6s ease-out .05s forwards;
    }
    #crm-success svg path {
      stroke-dasharray: 40;
      stroke-dashoffset: 40;
      animation: crmDrawCheck .35s ease-out .5s forwards;
    }
    #crm-success h3 {
      font-family: 'Playfair Display', serif;
      font-size: 24px;
      color: #2B8A3E;
      margin: 0 0 10px;
      animation: crmTextRise .5s ease-out .65s both;
    }
    #crm-success p {
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      color: #51CF66;
      font-weight: 500;
      margin: 0;
      line-height: 1.6;
      animation: crmTextRise .5s ease-out .8s both;
    }
    @keyframes crmMsgAppear { from{opacity:0} to{opacity:1} }
    @keyframes crmCheckPop {
      0% { transform: scale(.4); opacity: 0; }
      60% { transform: scale(1.08); opacity: 1; }
      100% { transform: scale(1); opacity: 1; }
    }
    @keyframes crmDrawCircle { to { stroke-dashoffset: 0; } }
    @keyframes crmDrawCheck { to { stroke-dashoffset: 0; } }
    @keyframes crmTextRise {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Error */
    #crm-error {
      display: none;
      background: #fff1f1;
      border: 1px solid #fca5a5;
      border-radius: 10px;
      padding: 12px 16px;
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      color: #b91c1c;
      margin-top: 12px;
    }
  `;

  // ── HTML ─────────────────────────────────────────────────
  var html = `
    <button id="crm-fab" aria-label="Abrir formulario de contacto">
      <span class="crm-fab-dot"></span>
      ¿Hablamos? →
    </button>

    <div id="crm-overlay" role="dialog" aria-modal="true" aria-labelledby="crm-title">
      <div id="crm-panel">
        <button id="crm-close" aria-label="Cerrar">✕</button>

        <div id="crm-form-view">
          <div class="crm-header">
            <h2 id="crm-title">Cuéntanos sobre ti</h2>
            <p>Selecciona tu perfil para mostrarte los campos correctos.</p>
          </div>
          <div class="crm-divider"></div>

          <!-- Step 1: Tipo -->
          <div class="crm-toggle">
            <button class="crm-toggle-btn" data-tipo="estudiante" type="button">
              <span class="crm-btn-icon">🎓</span>
              Estudiante
            </button>
            <button class="crm-toggle-btn" data-tipo="corporativo" type="button">
              <span class="crm-btn-icon">🏢</span>
              Cliente Corporativo
            </button>
          </div>

          <!-- Step 2A: Estudiante -->
          <div class="crm-fields" id="crm-fields-estudiante">
            <form id="crm-form-estudiante" novalidate>
              <div class="crm-row">
                <div class="crm-field">
                  <label>Nombre completo <span style="color:#b91c1c">*</span></label>
                  <input type="text" name="nombre" placeholder="Tu nombre" required />
                </div>
                <div class="crm-field">
                  <label>Correo electrónico <span style="color:#b91c1c">*</span></label>
                  <input type="email" name="correo" placeholder="correo@ejemplo.com" required />
                </div>
              </div>
              <div class="crm-row">
                <div class="crm-field">
                  <label>Teléfono <span class="crm-optional">(opcional)</span></label>
                  <input type="tel" name="telefono" placeholder="+52 000 000 0000" />
                </div>
                <div class="crm-field">
                  <label>Modalidad preferida</label>
                  <select name="modalidad">
                    <option value="">Selecciona…</option>
                    <option value="En linea">En línea</option>
                    <option value="Presencial">Presencial</option>
                    <option value="In-company">In-company</option>
                    <option value="Indiferente">Indiferente</option>
                  </select>
                </div>
              </div>
              <div class="crm-field">
                <label>Tema de interés <span class="crm-optional">(opcional)</span></label>
                <textarea name="tema" placeholder="¿Qué área fiscal o legal te interesa aprender?"></textarea>
              </div>
              <button type="submit" class="crm-submit">Enviar solicitud →</button>
              <div id="crm-error-est" class="crm-error" id="crm-error"></div>
            </form>
          </div>

          <!-- Step 2B: Corporativo -->
          <div class="crm-fields" id="crm-fields-corporativo">
            <form id="crm-form-corporativo" novalidate>
              <div class="crm-row">
                <div class="crm-field">
                  <label>Nombre completo <span style="color:#b91c1c">*</span></label>
                  <input type="text" name="nombre" placeholder="Tu nombre" required />
                </div>
                <div class="crm-field">
                  <label>Nombre de empresa <span style="color:#b91c1c">*</span></label>
                  <input type="text" name="empresa" placeholder="Empresa S.A. de C.V." required />
                </div>
              </div>
              <div class="crm-row">
                <div class="crm-field">
                  <label>Correo electrónico <span style="color:#b91c1c">*</span></label>
                  <input type="email" name="correo" placeholder="correo@empresa.com" required />
                </div>
                <div class="crm-field">
                  <label>WhatsApp <span class="crm-optional">(opcional)</span></label>
                  <input type="tel" name="whatsapp" placeholder="+52 000 000 0000" />
                </div>
              </div>
              <div class="crm-row">
                <div class="crm-field">
                  <label>Sitio web <span class="crm-optional">(opcional — análisis IA)</span></label>
                  <input type="url" name="url" placeholder="https://tuempresa.com" />
                </div>
                <div class="crm-field">
                  <label>Presupuesto estimado</label>
                  <select name="presupuesto">
                    <option value="">Selecciona…</option>
                    <option value="Menos de $10k">Menos de $10,000 MXN/mes</option>
                    <option value="$10k - $50k">$10,000 – $50,000 MXN/mes</option>
                    <option value="$50k - $200k">$50,000 – $200,000 MXN/mes</option>
                    <option value="Mas de $200k">Más de $200,000 MXN/mes</option>
                  </select>
                </div>
              </div>
              <div class="crm-field">
                <label>Servicio de interés</label>
                <select name="servicio">
                  <option value="">¿En qué podemos ayudarte?</option>
                  <option value="Asesoria">Asesoría fiscal / legal</option>
                  <option value="Planeacion">Planeación fiscal</option>
                  <option value="Cumplimiento">Cumplimiento fiscal</option>
                  <option value="Contabilidad">Contabilidad</option>
                  <option value="Defensa Fiscal">Defensa fiscal</option>
                  <option value="Inmobiliario">Fiscal inmobiliario</option>
                  <option value="Cursos">Cursos / Capacitación</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              <div class="crm-field">
                <label>Cuéntanos más <span class="crm-optional">(opcional)</span></label>
                <textarea name="mensaje" placeholder="Describe brevemente tu situación o necesidad…"></textarea>
              </div>
              <button type="submit" class="crm-submit">Enviar solicitud →</button>
              <div id="crm-error-corp" style="display:none;background:#fff1f1;border:1px solid #fca5a5;border-radius:10px;padding:12px 16px;font-family:'Inter',sans-serif;font-size:13px;color:#b91c1c;margin-top:12px;"></div>
            </form>
          </div>
        </div>

        <!-- Éxito -->
        <div id="crm-success">
          <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="26" cy="26" r="24" stroke="#51CF66" stroke-width="3"/>
            <path d="M14 27l8 8 18-18" stroke="#51CF66" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <h3>¡Solicitud recibida!</h3>
          <p>Te contactaremos en máximo <strong>24 horas hábiles</strong>.<br>Revisamos tu información y te respondemos de manera personalizada.</p>
        </div>

      </div>
    </div>
  `;

  // ── Init ─────────────────────────────────────────────────
  function init() {
    // Inyectar CSS
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    // Inyectar HTML
    var wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    document.body.appendChild(wrapper);

    bindEvents();
  }

  // ── Eventos ──────────────────────────────────────────────
  function bindEvents() {
    var fab     = document.getElementById('crm-fab');
    var overlay = document.getElementById('crm-overlay');
    var closeBtn = document.getElementById('crm-close');
    var toggleBtns = document.querySelectorAll('.crm-toggle-btn');

    fab.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });

    // Toggle estudiante / corporativo
    toggleBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        toggleBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var tipo = btn.getAttribute('data-tipo');
        document.getElementById('crm-fields-estudiante').classList.toggle('visible', tipo === 'estudiante');
        document.getElementById('crm-fields-corporativo').classList.toggle('visible', tipo === 'corporativo');
      });
    });

    // Formulario estudiante
    document.getElementById('crm-form-estudiante').addEventListener('submit', function (e) {
      e.preventDefault();
      submitForm('estudiante', this);
    });

    // Formulario corporativo
    document.getElementById('crm-form-corporativo').addEventListener('submit', function (e) {
      e.preventDefault();
      submitForm('corporativo', this);
    });
  }

  function openModal() {
    document.getElementById('crm-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    document.getElementById('crm-overlay').classList.remove('open');
    document.body.style.overflow = '';
  }

  // ── Submit → Backend (que reenvia a Airtable) ───────────
  function submitForm(tipo, form) {
    var btn = form.querySelector('.crm-submit');
    var errorEl = form.querySelector('[id^="crm-error"]');

    // Validación básica
    var nombre = form.querySelector('[name="nombre"]').value.trim();
    var correo = form.querySelector('[name="correo"]').value.trim();
    if (!nombre || !correo) {
      showError(errorEl, 'Por favor completa los campos obligatorios (*).');
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Enviando…';
    if (errorEl) errorEl.style.display = 'none';

    var payload;

    if (tipo === 'estudiante') {
      payload = {
        tipo:      'estudiante',
        nombre:    nombre,
        correo:    correo,
        telefono:  form.querySelector('[name="telefono"]').value.trim(),
        modalidad: form.querySelector('[name="modalidad"]').value,
        tema:      form.querySelector('[name="tema"]').value.trim(),
        origen:    paginaOrigen
      };
    } else {
      var empresa = form.querySelector('[name="empresa"]').value.trim();
      if (!empresa) {
        showError(errorEl, 'Por favor ingresa el nombre de tu empresa.');
        btn.disabled = false;
        btn.textContent = 'Enviar solicitud →';
        return;
      }
      payload = {
        tipo:        'corporativo',
        nombre:      nombre,
        empresa:     empresa,
        correo:      correo,
        whatsapp:    form.querySelector('[name="whatsapp"]').value.trim(),
        url:         form.querySelector('[name="url"]').value.trim(),
        presupuesto: form.querySelector('[name="presupuesto"]').value,
        servicio:    form.querySelector('[name="servicio"]').value,
        mensaje:     form.querySelector('[name="mensaje"]').value.trim(),
        origen:      paginaOrigen
      };
    }

    fetch(CRM_LEAD_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(function (res) {
      return res.json().then(function (data) { return { ok: res.ok, data: data }; });
    })
    .then(function (result) {
      if (result.ok && result.data && result.data.ok) {
        // Éxito — ocultar form, mostrar success con animación
        document.getElementById('crm-form-view').style.display = 'none';
        var successEl = document.getElementById('crm-success');
        successEl.style.display = 'block';
        void successEl.offsetWidth; // force reflow so animation runs
        successEl.classList.add('is-visible');
      } else {
        throw new Error((result.data && result.data.error) || 'Error desconocido');
      }
    })
    .catch(function (err) {
      showError(errorEl, 'Ocurrió un error al enviar. Por favor intenta de nuevo o escríbenos directamente.');
      btn.disabled = false;
      btn.textContent = 'Enviar solicitud →';
      console.error('[CRM Widget]', err);
    });
  }

  function showError(el, msg) {
    if (!el) return;
    el.style.display = 'block';
    el.textContent = msg;
  }

  // ── Arrancar cuando el DOM esté listo ───────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
