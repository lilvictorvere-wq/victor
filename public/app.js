const view = document.querySelector('#view');
const feedback = document.querySelector('#feedback');
const titles = {overview:'Privire de ansamblu',firme:'Firme',conversatii:'Conversații',clienti:'Clienți interesați',costuri:'Costuri',setari:'Setări'};
const metrics = `<div class="metrics"><div><span>Firme demonstrative</span><strong>03</strong><small>Exemple fictive</small></div><div><span>Conversații active</span><strong>00</strong><small>Fără conversații reale</small></div><div><span>Clienți interesați</span><strong>00</strong><small>Fără clienți reali</small></div><div><span>Costuri AI</span><strong>0 <em>lei</em></strong><small>Servicii neconectate</small></div></div>`;
const firms = [['Atelier Exemplu','Servicii','Oradea'],['Studio Demonstrativ','Design','Bihor'],['Firma Model','Construcții','Cluj-Napoca']];
const state = {stopped:false,limit:10};
function render() {
  const key = location.hash.slice(1) || 'overview';
  const page = Object.hasOwn(titles,key) ? key : 'overview';
  document.querySelector('#page-title').textContent = titles[page];
  document.querySelector('#breadcrumb').textContent = titles[page];
  document.title = `${titles[page]} — Victor AI · Demo`;
  document.querySelectorAll('.sidebar nav a').forEach(a => {
    if(a.hash === `#${page}`) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current');
  });
  feedback.textContent = '';
  if(page === 'overview') view.innerHTML = `${metrics}<div class="two-columns"><section class="list-panel"><h2>Activitate recentă <span class="badge">DEMO</span></h2><div class="list-row"><div><strong>Interfața este pregătită</strong><p>Explorează secțiunile din meniul lateral.</p></div><span class="activity-label">Demo</span></div><div class="list-row"><div><strong>Integrările sunt dezactivate</strong><p>Nicio operațiune AI sau Gmail nu este executată.</p></div><span class="activity-label">Demo</span></div><div class="list-row"><div><strong>Control manual</strong><p>Oprirea agentului se simulează doar în această pagină.</p></div><span class="activity-label">Demo</span></div></section><section class="list-panel"><h2>Starea sistemului</h2><div class="list-row"><strong>Agent</strong><span id="agent-status" class="badge">${state.stopped?'OPRIT':'NECONECTAT'}</span></div><div class="list-row"><strong>Gmail</strong><span class="muted">Neconectat</span></div><div class="list-row"><strong>Motor AI</strong><span class="muted">Neconectat</span></div><div class="list-row"><strong>Date</strong><span class="muted">Exclusiv demo</span></div></section></div>`;
  if(page === 'firme') {
    view.innerHTML = `<section class="list-panel"><div class="toolbar"><h2>Director firme · Demo</h2><label>Caută firma<input id="search" type="search" placeholder="Nume, domeniu sau localitate"></label></div><div class="table-scroll"><table><caption class="muted">Toate firmele de mai jos sunt fictive.</caption><thead><tr><th scope="col">Firmă</th><th scope="col">Domeniu</th><th scope="col">Localitate</th><th scope="col">Status</th></tr></thead><tbody id="firm-rows"></tbody></table></div><p id="search-result" role="status" class="activity-label"></p></section>`;
    const populate = query => {
      const matches = firms.filter(row=>row.join(' ').toLocaleLowerCase('ro').includes(query.toLocaleLowerCase('ro')));
      document.querySelector('#firm-rows').innerHTML = matches.map(row=>`<tr>${row.map(cell=>`<td>${cell}</td>`).join('')}<td><span class="badge">DEMO</span></td></tr>`).join('');
      document.querySelector('#search-result').textContent = `${matches.length} firme demonstrative găsite.`;
    };
    populate(''); document.querySelector('#search').addEventListener('input', e=>populate(e.target.value));
  }
  if(page === 'conversatii' || page === 'clienti') view.innerHTML = `<section class="list-panel empty"><p class="eyebrow">SPAȚIU DEMONSTRATIV</p><h3>${page==='conversatii'?'Nicio conversație activă':'Niciun client calificat'}</h3><p>${page==='conversatii'?'Conversațiile vor apărea aici după conectarea și autorizarea integrărilor.':'Interesul comercial va putea fi urmărit aici după conectarea aplicației.'} În acest demo nu sunt trimise sau primite mesaje.</p><a class="button" href="#overview">Înapoi la overview <svg class="arrow-icon" aria-hidden="true" viewBox="0 0 16 16"><path d="M3 13 13 3M3 3h10v10"/></svg></a></section>`;
  if(page === 'costuri') view.innerHTML = `<div class="metrics"><div><span>Consum demonstrativ</span><strong>0 <em>lei</em></strong><small>Fără API-uri conectate</small></div><div><span>Buget exemplu</span><strong>150 <em>lei</em></strong><small>Nu este o limită de facturare</small></div><div><span>Solicitări AI</span><strong>00</strong><small>Nicio solicitare executată</small></div><div><span>Estimare lunară</span><strong>—</strong><small>Necesită date reale</small></div></div><section class="list-panel"><h2>Buget · Demo</h2><p>0 din 150 lei · Exemplu de afișare</p><div class="meter" aria-hidden="true"><span></span></div><p class="activity-label">Această interfață nu monitorizează și nu limitează facturarea furnizorilor.</p></section>`;
  if(page === 'setari') {
    view.innerHTML = `<section class="list-panel"><h2>Preferințe demonstrative</h2><form id="settings" class="settings"><label>Limită zilnică de mesaje (demo)<input name="limit" type="number" min="1" max="10" required value="${state.limit}"></label><label>Fus orar<select name="timezone"><option>Europe/Bucharest</option></select></label><p class="activity-label">Preferințele sunt păstrate doar în memoria paginii. Nu configurează servicii reale.</p><button class="button primary" type="submit">Salvează în demo <svg class="arrow-icon" aria-hidden="true" viewBox="0 0 16 16"><path d="M3 13 13 3M3 3h10v10"/></svg></button></form></section>`;
    document.querySelector('#settings').addEventListener('submit',e=>{e.preventDefault(); state.limit = Number(new FormData(e.target).get('limit')); feedback.textContent = 'Preferințele demo au fost salvate pentru această sesiune de pagină.';});
  }
}
document.querySelector('#stop-agent').addEventListener('click',()=>{
  state.stopped = true;
  const status = document.querySelector('#agent-status'); if(status) status.textContent = 'OPRIT';
  feedback.textContent = 'Oprire simulată. Nu există un agent real conectat.';
  document.querySelector('#stop-agent').textContent = 'Agent oprit · Demo';
});
window.addEventListener('hashchange',render); render();
