(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const ui = {
    start: $('startBtn'), intro: $('introCard'), wrap: $('dialogueWrap'), speaker: $('speaker'), kicker: $('chapterKicker'),
    text: $('dialogueText'), next: $('nextBtn'), nextLabel: $('nextLabel'), choices: $('choices'),
    progressText: $('progressText'), progressBar: $('progressBar'), chapter: $('chapterLabel'),
    tag: $('sceneTag'), character: $('character'), stage: $('stage'), rain: $('rain'),
    modal: $('modalBackdrop'), modalBody: $('modalBody'), modalTitle: $('modalTitle'), toast: $('toast')
  };
  const SAVE_KEY = 'afterHours.lastTrain.v1';
  const chapters = { prologue: 'PROLOGUE', midnight: 'THE MIDNIGHT LINE', platform: 'THE LAST STOP', dawn: 'BEFORE THE FIRST LIGHT' };
  const scenes = {
    start: { who:'NARRATOR', chapter:'PROLOGUE · 11:11 PM', tag:'NORTHBOUND · 11:11 PM', text:'The city blurs into ribbons of gold. You have the last carriage to yourself—or so you think.', next:'seat' },
    seat: { who:'NARRATOR', chapter:'PROLOGUE', text:'At the far end, someone sits beside the rain-streaked window. A familiar red scarf. A face you haven’t seen in three years.', next:'recognition' },
    recognition: { who:'MARA', chapter:'PROLOGUE', text:'“I wondered if you’d still take the late train.” Her smile is soft, and a little afraid.', next:'first-choice' },
    'first-choice': { who:'YOU', chapter:'PROLOGUE', choices:[
      {label:'“I wasn’t sure you’d want me to.”', detail:'Let the silence soften.', effect:{warmth:1}, next:'quiet'},
      {label:'“You still remember my schedule?”', detail:'Keep your guard up.', effect:{guard:1}, next:'guarded'}
    ]},
    quiet: { who:'MARA', chapter:'PROLOGUE', text:'“I remember more than I mean to.” She looks back out at the city. “That’s sort of the problem.”', next:'midnight-1' },
    guarded: { who:'MARA', chapter:'PROLOGUE', text:'“Some things stick.” She tucks her hands into her coat sleeves. “Even when you try not to let them.”', next:'midnight-1' },
    'midnight-1': { who:'NARRATOR', chapter:'THE MIDNIGHT LINE', tag:'OLD TOWN · 11:24 PM', chapterKey:'midnight', text:'The train rocks through a curve. Somewhere overhead, the lights flicker, then settle into a honey-colored glow.', next:'question' },
    question: { who:'MARA', chapter:'THE MIDNIGHT LINE', text:'“I got your letter.” The words land between you. “The one you never sent.”', next:'letter-choice' },
    'letter-choice': { who:'YOU', chapter:'THE MIDNIGHT LINE', choices:[
      {label:'“You found it?”', detail:'Ask what happened.', effect:{truth:1}, next:'found'},
      {label:'“I wrote a lot of things I couldn’t say.”', detail:'Tell her what it meant.', effect:{warmth:1}, next:'meaning'},
      {label:'“I’m sorry you had to read it.”', detail:'Protect yourself from the answer.', effect:{guard:1}, next:'sorry'}
    ]},
    found: { who:'MARA', chapter:'THE MIDNIGHT LINE', text:'“Your sister gave it to me last week. She said you were finally ready.” Mara’s thumb traces a crease in the envelope. “Were you?”', next:'ready-choice' },
    meaning: { who:'MARA', chapter:'THE MIDNIGHT LINE', text:'“I know.” She draws a folded envelope from her pocket, its edges worn soft. “I’ve read it enough times to hear your voice.”', next:'ready-choice' },
    sorry: { who:'MARA', chapter:'THE MIDNIGHT LINE', text:'“Don’t be. It was the first honest thing either of us had said in a long time.” She looks at you at last.', next:'ready-choice' },
    'ready-choice': { who:'YOU', chapter:'THE MIDNIGHT LINE', text:'The train hums around you, carrying all the words you put away.', choices:[
      {label:'“I’m ready now. I think.”', detail:'Leave room for hope.', effect:{warmth:2}, next:'memory'},
      {label:'“I don’t know. But I’m here.”', detail:'Choose honesty over certainty.', effect:{truth:2}, next:'memory'},
      {label:'“I thought it was better to leave it behind.”', detail:'Name the distance.', effect:{guard:2}, next:'memory'}
    ]},
    memory: { who:'MARA', chapter:'THE MIDNIGHT LINE', text:'“Do you remember the observatory?” A small laugh escapes her. “We said we’d come back when the whole city was ours to look at.”', next:'memory-choice' },
    'memory-choice': { who:'YOU', chapter:'THE MIDNIGHT LINE', choices:[
      {label:'“I kept the star map.”', detail:'Share the thing you saved.', effect:{warmth:1, star:true}, next:'promise'},
      {label:'“I remember the rain that night.”', detail:'Remember it as it was.', effect:{truth:1}, next:'promise'},
      {label:'“I remember what we promised.”', detail:'Say what still matters.', effect:{warmth:1}, next:'promise'}
    ]},
    promise: { who:'MARA', chapter:'THE MIDNIGHT LINE', text:'“We were so sure we could promise forever.” She turns the envelope over in her hands. “Maybe we can promise one small thing instead.”', next:'stop' },
    stop: { who:'NARRATOR', chapter:'THE LAST STOP', chapterKey:'platform', tag:'HARBOR END · 11:47 PM', text:'The train brakes with a sigh. Beyond the glass: the old harbor, dark water, and the hilltop observatory. Your stop. Her stop, too.', next:'platform-choice' },
    'platform-choice': { who:'MARA', chapter:'THE LAST STOP', text:'“Walk with me?” she asks. “No big promises. Just to the hill. We can decide the rest when we get there.”', choices:[
      {label:'Take her hand.', detail:'A small promise, kept together.', effect:{warmth:2}, next:'walk-together'},
      {label:'“I’ll walk beside you.”', detail:'Careful, but still here.', effect:{truth:1}, next:'walk-beside'},
      {label:'“I need to make this last stop alone.”', detail:'Some paths need solitude.', effect:{guard:2}, next:'walk-alone'}
    ]},
    'walk-together': { who:'MARA', chapter:'BEFORE THE FIRST LIGHT', chapterKey:'dawn', tag:'THE HILL · 12:06 AM', text:'Her fingers fit into yours like a memory finding its way home. The hill is steep, but neither of you lets go.', next:'observatory' },
    'walk-beside': { who:'MARA', chapter:'BEFORE THE FIRST LIGHT', chapterKey:'dawn', tag:'THE HILL · 12:06 AM', text:'She nods, and you walk side by side. The space between your shoulders is small enough to cross whenever you’re ready.', next:'observatory' },
    'walk-alone': { who:'NARRATOR', chapter:'BEFORE THE FIRST LIGHT', chapterKey:'dawn', tag:'THE HILL · 12:06 AM', text:'Mara watches you go, then walks the other way toward the harbor. The night is big enough for both of you to find your own horizon.', next:'ending-alone' },
    observatory: { who:'NARRATOR', chapter:'BEFORE THE FIRST LIGHT', tag:'THE OBSERVATORY · 12:31 AM', text:'At the summit, the observatory doors are unlocked. Through its old brass telescope, the stars are clearer than you remember.', next:'final-choice' },
    'final-choice': { who:'MARA', chapter:'BEFORE THE FIRST LIGHT', text:'“So,” she says, looking up at the open sky. “What do you want to do now?”', choices:[
      {label:'“Let’s find out. Together.”', detail:'Start again, one day at a time.', effect:{warmth:2}, next:'ending-together'},
      {label:'“Tell me about your life. All of it.”', detail:'Begin with the truth.', effect:{truth:2}, next:'ending-truth'},
      {label:'“I think I just needed to say goodbye.”', detail:'Let the night be enough.', effect:{guard:2}, next:'ending-goodbye'}
    ]},
    'ending-alone': {who:'NARRATOR', chapter:'AN ENDING', ending:'The Quiet Horizon', text:'At the harbor, the first hint of dawn loosens the dark. You take the old star map from your coat and unfold it in the sea wind. Some journeys are only yours to make. On the way home, the city feels a little less like something you left behind.'},
    'ending-together': {who:'NARRATOR',chapter:'AN ENDING',ending:'A Small Promise',text:'Mara laughs—a sound you had almost forgotten, and somehow never lost. The night gives way to a pale gold morning. No forever, no guarantees. Just two cups of terrible station coffee, and a promise to meet again tomorrow.'},
    'ending-truth': {who:'NARRATOR',chapter:'AN ENDING',ending:'Under the Same Sky',text:'You talk until the sky pales: of the years apart, the people you became, and the things that still hurt. The stars fade one by one, but neither of you looks away. This time, the silence between you feels like room to breathe.'},
    'ending-goodbye': {who:'NARRATOR',chapter:'AN ENDING',ending:'The Last Train',text:'Mara’s eyes shine, but her smile stays. “Then I’m glad we got to say it.” You watch the first train of morning arrive. When the doors close, the ache is still there—only now it has somewhere to go.'}
  };
  let state = {node:null, warmth:0, guard:0, truth:0, star:false, visited:[], settings:{typewriter:false, ambient:true}};
  let typingTimer = null, typing = false, currentText = '', audioContext = null, tone = null;

  function save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (_) {} }
  function restore() { try { const s=JSON.parse(localStorage.getItem(SAVE_KEY)); if (s && s.node && scenes[s.node]) state={...state,...s,settings:{...state.settings,...(s.settings||{})}}; } catch (_) {} }
  function setSceneLook(node) {
    const n=scenes[node];
    if(n.tag) ui.tag.textContent=n.tag;
    if(node==='stop'||node==='observatory') ui.rain.classList.add('on');
    if(node==='walk-alone') ui.character.classList.add('hidden-char');
    else if(node==='walk-together'||node==='walk-beside') {ui.character.classList.remove('hidden-char');ui.character.classList.add('alt');}
    if(node==='observatory') {ui.rain.classList.remove('on');ui.stage.querySelector('.sky').style.background='linear-gradient(180deg,#0d1734 0%,#343657 54%,#9c6672 100%)';}
  }
  function progress(node) {
    const idx=state.visited.length; const pct=Math.min(100,Math.round(idx/24*100));
    ui.progressBar.style.width=pct+'%';
    if(node.startsWith('ending-')) {ui.progressText.textContent='ENDING';ui.progressBar.style.width='100%';}
    else ui.progressText.textContent=(scenes[node].chapterKey||'prologue').toUpperCase();
  }
  function go(id) {
    const n=scenes[id]; if(!n)return;
    state.node=id; if(!state.visited.includes(id))state.visited.push(id); save();
    if(typingTimer){clearInterval(typingTimer);typingTimer=null;} typing=false;
    ui.wrap.classList.remove('hidden');ui.intro.classList.add('hidden');ui.choices.classList.add('hidden');ui.choices.innerHTML='';
    ui.speaker.textContent=n.who;ui.kicker.textContent=n.chapter||''; if(n.tag)ui.tag.textContent=n.tag;
    if(n.chapterKey){ui.progressText.textContent=chapters[n.chapterKey];}
    else progress(id);
    setSceneLook(id);
    if(n.ending){ ui.nextLabel.textContent='PLAY AGAIN'; ui.next.setAttribute('aria-label','Play again'); ui.choices.innerHTML='<div class="end-mark">✦</div><div class="eyebrow">'+n.ending.toUpperCase()+'</div><p class="end-copy">'+n.text+'</p><button class="primary-btn replay-btn">Read another ending <span>↻</span></button>';ui.choices.classList.remove('hidden');ui.choices.querySelector('.replay-btn').addEventListener('click',resetStory);ui.text.textContent='';ui.next.classList.add('hidden');return; }
    ui.next.classList.remove('hidden');ui.nextLabel.textContent=n.choices?'CHOOSE WHAT YOU SAY':'TAP TO CONTINUE';ui.next.setAttribute('aria-label',n.choices?'Choose a response':'Continue dialogue');
    currentText=n.text||''; if(state.settings.typewriter) typeText(currentText); else ui.text.textContent=currentText;
    if(n.choices) { n.choices.forEach(choice=>{const b=document.createElement('button');b.className='choice-btn';b.innerHTML=escapeHTML(choice.label)+(choice.detail?'<span>'+escapeHTML(choice.detail)+'</span>':'');b.addEventListener('click',()=>choose(choice));ui.choices.appendChild(b);});ui.choices.classList.remove('hidden'); }
  }
  function typeText(text){ui.text.textContent='';typing=true;let i=0;typingTimer=setInterval(()=>{ui.text.textContent+=text[i++]||'';if(i>=text.length){clearInterval(typingTimer);typingTimer=null;typing=false;}},22);}
  function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function choose(choice){if(choice.effect){state.warmth+=choice.effect.warmth||0;state.guard+=choice.effect.guard||0;state.truth+=choice.effect.truth||0;if(choice.effect.star)state.star=true;} blip();go(choice.next);}
  function advance(){if(ui.modal.classList.contains('hidden')===false)return;if(!ui.wrap.classList.contains('hidden')){if(typing){clearInterval(typingTimer);typingTimer=null;typing=false;ui.text.textContent=currentText;return;}const n=scenes[state.node];if(n.ending){resetStory();return;}if(n.choices)return;if(n.next)go(n.next);}}
  function showToast(message){ui.toast.textContent=message;ui.toast.classList.add('show');setTimeout(()=>ui.toast.classList.remove('show'),2100);}
  function resetStory(){state={node:null,warmth:0,guard:0,truth:0,star:false,visited:[],settings:state.settings};save();ui.character.classList.remove('hidden-char','alt');ui.rain.classList.remove('on');ui.stage.querySelector('.sky').style.background='';ui.tag.textContent='NORTHBOUND · 11:11 PM';ui.wrap.classList.add('hidden');ui.intro.classList.remove('hidden');ui.progressText.textContent='PROLOGUE';ui.progressBar.style.width='0%';closeModal();}
  function openModal(kind='menu'){
    ui.modalTitle.textContent=kind==='settings'?'Settings':'Story menu';
    if(kind==='settings'){
      ui.modalBody.innerHTML='<label class="setting-row">Typewriter text <input type="checkbox" id="typeToggle"></label><label class="setting-row">Ambient tone <input type="checkbox" id="ambientToggle"></label><p style="color:#9da1af;font-size:11px;line-height:1.6">Your choices and progress save automatically on this device.</p>';
      $('typeToggle').checked=state.settings.typewriter;$('ambientToggle').checked=state.settings.ambient;
      $('typeToggle').addEventListener('change',e=>{state.settings.typewriter=e.target.checked;save();});$('ambientToggle').addEventListener('change',e=>{state.settings.ambient=e.target.checked;save();toggleSound(e.target.checked);});
    } else {
      ui.modalBody.innerHTML='<div class="menu-options"><button class="menu-option" id="resumeOption">Return to story<small>Pick up where you left off</small></button><button class="menu-option" id="restartOption">Start a new journey<small>Your current story progress will be reset</small></button><button class="menu-option" id="howOption">How to play<small>Tap or press Space to continue; choices shape your ending</small></button></div>';
      $('resumeOption').addEventListener('click',closeModal);$('restartOption').addEventListener('click',()=>{resetStory();showToast('A new journey begins.');});$('howOption').addEventListener('click',()=>showToast('Tap the dialogue or press Space. Your choices shape the ending.'));
    }
    ui.modal.classList.remove('hidden');$('modalClose').focus();
  }
  function closeModal(){ui.modal.classList.add('hidden');}
  function toggleSound(on){
    if(!on){if(tone){tone.stop();tone=null;}return;}
    try{audioContext=audioContext||new (window.AudioContext||window.webkitAudioContext)();if(audioContext.state==='suspended')audioContext.resume();if(tone)return;const osc=audioContext.createOscillator(),gain=audioContext.createGain();osc.type='sine';osc.frequency.value=110;gain.gain.value=.012;osc.connect(gain);gain.connect(audioContext.destination);osc.start();tone=osc;}catch(_){showToast('Ambient audio is unavailable in this browser.');}
  }
  function blip(){if(!state.settings.ambient)return;try{audioContext=audioContext||new (window.AudioContext||window.webkitAudioContext)();const o=audioContext.createOscillator(),g=audioContext.createGain();o.type='sine';o.frequency.value=620;g.gain.setValueAtTime(.035,audioContext.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+.12);o.connect(g);g.connect(audioContext.destination);o.start();o.stop(audioContext.currentTime+.13);}catch(_){}}

  restore();
  if(state.node){ui.intro.classList.add('hidden');go(state.node);showToast('Your saved journey is ready.');}
  ui.start.addEventListener('click',()=>{blip();toggleSound(state.settings.ambient);go('start');});
  ui.next.addEventListener('click',advance);
  ui.stage.addEventListener('click',e=>{if(e.target.closest('button'))return;if(!ui.intro.classList.contains('hidden'))return;advance();});
  $('menuBtn').addEventListener('click',()=>openModal('menu'));$('settingsBtn').addEventListener('click',()=>openModal('settings'));$('modalClose').addEventListener('click',closeModal);
  $('soundBtn').addEventListener('click',()=>{state.settings.ambient=!state.settings.ambient;save();toggleSound(state.settings.ambient);$('soundBtn').classList.toggle('sound-on',state.settings.ambient);showToast(state.settings.ambient?'Ambient tone on':'Ambient tone off');});
  $('brandHome').addEventListener('click',e=>{e.preventDefault();openModal('menu');});
  ui.modal.addEventListener('click',e=>{if(e.target===ui.modal)closeModal();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!ui.modal.classList.contains('hidden'))closeModal();else openModal('menu');}if(e.key===' '||e.key==='ArrowDown'){if(!e.target.closest('button,input')){e.preventDefault();advance();}}});
})();
