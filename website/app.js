const app = document.querySelector('#app');

const pages = {
  '/': ['Systems that answer.', 'IronWake helps service businesses see and repair leaks across inquiry, booking, follow-up, and reception workflows.', 'Request a Business Leak Audit'],
  '/about': ['Truth before theatre.', 'IronWake is an agency-led systems practice. Demonstrations are labelled; results are verified before they are claimed.', 'Request an audit'],
  '/systems': ['The operating layer.', 'Explore the categories IronWake can map and improve without assuming a provider connection or live outcome.', 'Start with an audit'],
  '/work': ['Demonstrations, not claims.', 'Selected capability demonstrations remain clearly labelled until independent proof exists.', 'Request proof status'],
  '/process': ['Map. Fix. Test. Document.', 'A small, reviewable process for turning missed inquiries and follow-up gaps into visible operating work.', 'Request scope'],
  '/privacy': ['Privacy is a draft gate.', 'This private prototype does not collect or transmit personal data. A reviewed policy requires a real entity, retention policy, and processor list.', 'Back home'],
  '/terms': ['Terms are a review gate.', 'Commercial, tax, refund, and contracting terms are not active in this prototype.', 'Back home'],
  '/404': ['Path unowned.', 'This prototype route does not exist yet.', 'Return home']
};

function route() { return location.hash.slice(1) || '/'; }
function link(path, label) { return `<a class="button" href="#${path}">${label}</a>`; }
function signalRail() { return `<div class="signal-rail" aria-label="IronWake operating path"><span>INQUIRY</span><i aria-hidden="true"></i><span>OWNER</span><i aria-hidden="true"></i><span>NEXT ACTION</span></div>`; }
function render() {
  const path = route();
  if (path === '/audit' || path === '/audit/request') return renderAudit(path === '/audit/request');
  const page = pages[path] || pages['/404'];
  const rail = path === '/' ? signalRail() : '';
  app.innerHTML = `<span class="eyebrow">IronWake / ${path === '/' ? 'home' : path.slice(1)}</span><h1>${page[0]}</h1><p>${page[1]}</p>${link(path === '/' ? '/audit' : '/', page[2])}${rail}<section class="grid"><article class="card card-primary"><span class="card-label">01 / visibility</span><h3>Missed inquiries</h3><p>Make the leak visible before adding complexity.</p></article><article class="card"><span class="card-label">02 / ownership</span><h3>Booking control</h3><p>Map the handoff from interest to next action.</p></article><article class="card"><span class="card-label">03 / timing</span><h3>Follow-up discipline</h3><p>Keep ownership and timing explicit.</p></article></section>`;
}
function renderAudit(request) {
  app.innerHTML = `<span class="eyebrow">IronWake / business leak audit</span><h1>Find the leak before you scale it.</h1><p>Tell us where inquiry, booking, or follow-up feels fragile. This private prototype does not send or store submissions.</p><form id="audit-form"><label>Business name<input name="business" required></label><label>Work email<input name="email" type="email" required></label><label>Where is the leak?<textarea name="leak" required></textarea></label><label><input name="consent" type="checkbox" required> I agree to be contacted about this request.</label><button class="button" type="submit">Request a Business Leak Audit</button><p id="form-status" class="notice" hidden></p></form>`;
  document.querySelector('#audit-form').addEventListener('submit', event => { event.preventDefault(); const status = document.querySelector('#form-status'); status.hidden = false; status.textContent = 'Prototype only — no request was sent or stored.'; });
}
window.addEventListener('hashchange', render);
render();
