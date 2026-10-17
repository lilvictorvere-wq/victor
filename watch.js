const assembly = document.querySelector('.assembly');
const watch = document.querySelector('.assembly-watch');
const chapters = [...document.querySelectorAll('.chapter-copy')];
const parts = ['movement','bridges','dial','case'].map(name => watch.querySelector(`.${name}`));
const links = [...document.querySelectorAll('.chapter-steps a')];
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const narrow = matchMedia('(max-width: 650px)');
const clamp = (v, lo=0, hi=1) => Math.min(hi, Math.max(lo, v));
const ease = v => v * v * (3 - 2 * v);
let current = 0, target = 0, frame = 0;
function progress() {
  const rect = assembly.getBoundingClientRect();
  return clamp(-rect.top / Math.max(1, assembly.offsetHeight - innerHeight)) * 3.75;
}
function paint(p) {
  const chapter = Math.min(3, Math.floor(p + .15));
  document.querySelector('.chapter-count').textContent = `0${chapter+1} / 04`;
  document.querySelector('.assembly-percent').textContent = `${String(Math.round(clamp(p/3.65)*100)).padStart(2,'0')}%`;
  links.forEach((link,i) => { link.classList.toggle('active',i===chapter); if(i===chapter) link.setAttribute('aria-current','step'); else link.removeAttribute('aria-current'); });
  const slot = clamp(p,0,3);
  const base = Math.floor(slot), blend = ease(slot-base);
  const places = [64,36,64,36];
  watch.style.left = `${places[base]+((places[Math.min(3,base+1)]-places[base])*blend)}%`;
  chapters.forEach((copy,i) => {
    const enter = i===0 ? 1 : ease(clamp((p-i+.2)/.35));
    const leave = i===3 ? 1 : 1-ease(clamp((p-i-.55)/.35));
    const opacity = enter*leave;
    copy.style.opacity = opacity;
    copy.style.visibility = opacity<.02 ? 'hidden' : 'visible';
    copy.setAttribute('aria-hidden',opacity<.5 ? 'true':'false');
    copy.style.transform = `translateY(${narrow.matches?0:-50}%) translateY(${(1-enter)*24-(1-leave)*18}px)`;
  });
  parts.forEach((part,i) => {
    const t = i===0 ? 1 : ease(clamp((p-i+.28)/.72));
    const direction = i%2 ? -1 : 1;
    part.style.opacity = t;
    part.style.transform = `translate(${(1-t)*direction*80}px,${(1-t)*-100}px) rotate(${(1-t)*direction*24}deg) scale(${1+(1-t)*.2})`;
  });
}
function tick(){
  target=progress(); current += (target-current)*.095;
  if(Math.abs(target-current)<.001) current=target;
  paint(current);
  if(Math.abs(target-current)>.001) frame=requestAnimationFrame(tick); else frame=0;
}
function update(){if(reduced.matches)return; if(!frame)frame=requestAnimationFrame(tick);}
addEventListener('scroll',update,{passive:true}); addEventListener('resize',update);
reduced.addEventListener('change',()=>{if(reduced.matches){cancelAnimationFrame(frame);frame=0;chapters.forEach(el=>el.removeAttribute('aria-hidden'));}else update();});
links.forEach((link,i)=>link.addEventListener('click',e=>{e.preventDefault();const top=assembly.getBoundingClientRect().top+scrollY;scrollTo({top:top+((i===0?0:i+.5)/3.75)*(assembly.offsetHeight-innerHeight),behavior:reduced.matches?'instant':'smooth'});}));
if(!reduced.matches){current=progress();paint(current);}
const menu = document.querySelector('.mobile-menu');
const mobileNav = document.querySelector('.mobile-nav');
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));mobileNav.hidden=!open;});
mobileNav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{mobileNav.hidden=true;menu.setAttribute('aria-expanded','false');}));
const dialog=document.querySelector('#edition-dialog');
document.querySelectorAll('[data-details]').forEach(button=>button.addEventListener('click',()=>dialog.showModal()));
document.querySelectorAll('.dialog-close,.dialog-return').forEach(button=>button.addEventListener('click',()=>dialog.close()));
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
document.querySelector('#year').textContent=new Date().getFullYear();
