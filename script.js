// Simple front-end CMS: store an array of items in localStorage under 'abg_blog_items'
const modal = document.getElementById('modal');
const openAdd = document.getElementById('openAdd');
const closeBtn = document.getElementById('close');
const addForm = document.getElementById('addForm');
const cardsEl = document.getElementById('cards');
const resetBtn = document.getElementById('reset');

function uid(){ return 'id-'+Math.random().toString(36).slice(2,9) }

function loadItems(){
  try {
    const raw = localStorage.getItem('abg_blog_items');
    return raw ? JSON.parse(raw) : [];
  } catch(e){ return [] }
}

function saveItems(items){ localStorage.setItem('abg_blog_items', JSON.stringify(items)) }

function render(){
  const items = loadItems();
  cardsEl.innerHTML = items.map(it => {
    if(it.type==='image') return `
      <div class="card">
        <h4>${escapeHtml(it.title)}</h4>
        <img src="${escapeHtml(it.content)}" alt="${escapeHtml(it.title)}" />
        <p>${escapeHtml(it.desc||'')}</p>
      </div>`;
    if(it.type==='video') return `
      <div class="card">
        <h4>${escapeHtml(it.title)}</h4>
        <div class="video-wrap">${escapeHtml(it.content)}</div>
        <p>${escapeHtml(it.desc||'')}</p>
      </div>`;
    if(it.type==='link') return `
      <div class="card">
        <h4>${escapeHtml(it.title)}</h4>
        <p>${escapeHtml(it.desc||'')}</p>
        <a href="${escapeHtml(it.content)}" target="_blank">${escapeHtml(it.content)}</a>
      </div>`;
    return `
      <div class="card">
        <h4>${escapeHtml(it.title)}</h4>
        <p>${escapeHtml(it.content)}</p>
        <p>${escapeHtml(it.desc||'')}</p>
      </div>`;
  }).join('') || '<p>لا يوجد محتوى بعد — اضف أول منشور لك من زر "أضف محتوى جديد".</p>';
}

function escapeHtml(s){ return String(s||'').replace(/[&<>"']/g, function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m] }) }

openAdd.onclick = ()=>{ modal.setAttribute('aria-hidden','false') }
closeBtn.onclick = ()=>{ modal.setAttribute('aria-hidden','true') }

addForm.addEventListener('submit', e=>{
  e.preventDefault();
  const data = new FormData(addForm);
  const item = {
    id: uid(),
    title: data.get('title'),
    type: data.get('type'),
    content: data.get('content'),
    desc: data.get('desc')
  };
  const items = loadItems();
  items.unshift(item);
  saveItems(items);
  addForm.reset();
  modal.setAttribute('aria-hidden','true');
  render();
});

resetBtn.addEventListener('click', ()=>{
  if(confirm('هل تريد حذف كل المحتوى المخزن محلياً؟')) {
    localStorage.removeItem('abg_blog_items');
    render();
  }
});

// initial seed (only when empty) - example item
(function seed(){
  const items = loadItems();
  if(items.length===0){
    items.push({
      id: uid(),
      title: 'مرحباً — هذه بطاقة توضيحية',
      type: 'text',
      content: 'يمكنك الضغط على "أضف محتوى جديد" لإضافة نص أو رابط أو صورة أو فيديو إلى هذه الصفحة.',
      desc: ''
    });
    saveItems(items);
  }
  render();
})();