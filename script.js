// Minimal interaction + download using html2canvas
document.addEventListener('DOMContentLoaded', ()=> {
  const envelope = document.getElementById('envelope');
  const cardInner = document.getElementById('cardInner');
  const flipBtn = document.getElementById('flipBtn');
  const flipBtnEn = document.getElementById('flipBtnEn');
  const downloadBtn = document.getElementById('downloadBtn');
  const downloadBtnEn = document.getElementById('downloadBtnEn');
  const hebrewFace = document.getElementById('hebrewFace');
  const englishFace = document.getElementById('englishFace');

  // Open envelope on click or Enter/Space
  envelope.addEventListener('click', () => envelope.classList.add('open'));
  envelope.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); envelope.classList.add('open'); }
  });

  // Flip to other language
  function flipTo(lang){
    if(lang === 'en'){
      cardInner.classList.add('flipped');
      hebrewFace.setAttribute('aria-hidden','true');
      englishFace.setAttribute('aria-hidden','false');
    } else {
      cardInner.classList.remove('flipped');
      hebrewFace.setAttribute('aria-hidden','false');
      englishFace.setAttribute('aria-hidden','true');
    }
  }
  flipBtn?.addEventListener('click', (e)=>{ e.stopPropagation(); flipTo('en'); });
  flipBtnEn?.addEventListener('click', (e)=>{ e.stopPropagation(); flipTo('he'); });

  // Download visible face as an image
  async function downloadFace(faceEl, filename){
    // ensure face is visible; create a copy to get nicer export without controls or with styling applied
    const clone = faceEl.cloneNode(true);
    clone.style.width = getComputedStyle(faceEl).width;
    clone.style.height = getComputedStyle(faceEl).height;
    // optionally hide control buttons in clone:
    clone.querySelectorAll('.controls')?.forEach(c=>c.remove());
    const wrapper = document.createElement('div');
    wrapper.style.position = 'fixed';
    wrapper.style.left = '-9999px';
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);
    try{
      const canvas = await html2canvas(clone, {scale: 2, backgroundColor: null});
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }catch(err){
      console.error('Export failed', err);
      alert('Export failed: ' + err.message);
    }finally{
      wrapper.remove();
    }
  }

  downloadBtn?.addEventListener('click', (e)=>{ e.stopPropagation(); downloadFace(hebrewFace, 'invitation_he.png'); });
  downloadBtnEn?.addEventListener('click', (e)=>{ e.stopPropagation(); downloadFace(englishFace, 'invitation_en.png'); });
});