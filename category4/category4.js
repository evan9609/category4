import OPTIONS from './options.js'

const createTemplate = (el) => {
  const { TEMPLATE, SETTINGS } = OPTIONS;

  const { childDom } = el;
  const container = document.createElement('div');
  container.innerHTML = TEMPLATE;

  const listWrapper = container.querySelector('.category-list');
  const dropdown = container.querySelector('dropdown-el');

  [...childDom].forEach((child) => {
    listWrapper.append(child);
  });

  //dropdown4
  // [...el.allItems].forEach((child) => {
  //   const li = document.createElement('li')
  //   li.innerHTML = child.innerHTML
  //   dropdown.append(li)
  // });

  // 是否有箭頭
  if(el.params.arrow == 'on'){
    container.querySelector('.category-left').innerHTML = SETTINGS.arrow_left;
    container.querySelector('.category-right').innerHTML = SETTINGS.arrow_right;
  }

  return container.children[0];
}

class Category4 extends HTMLElement {
  constructor() {
    super();
    this.params = {
      type: this.getAttribute('type'),
      arrow: this.getAttribute('arrow'),
      breakpoint: this.getAttribute('breakpoint'),
      dropdown: this.getAttribute('dropdown'),
    }
    this.$El = {};
    this.allItems = this.querySelectorAll('li');
    this.val = {
      clientStart: 0,
      clientEnd: 0,
      distance: 0,
      offset: 0,
      scrollX: 0,
      activeItem: null,
    };
  };
  connectedCallback() {
    this.#init();
  }
  static get observedAttributes() {
    return ['state','offset']
  }
  attributeChangedCallback(attr, oldVal, newVal) {
    switch(attr) {
      case 'state':
        break;
    }
  }
  
  #init() {
    this.#create();

    this.eventDrag();
    this.responsive();
    this.focusActiveItem();

    if(this.params.arrow == 'on'){
      this.arrowEvent();
    }

  }

  #create() {

    this.__events__ = {};

    this.#mount();

  }

  #mount() {

    this.childDom = this.childNodes;
    this.template = createTemplate(this);

    this.innerHTML = '';
    this.append(this.template);

    this.#queryEl();

    this.activeItem = this.querySelector('li.active');
  }

  // 抓取元素
  #queryEl() {
    const el = this.$El;

    el.scrollContent = this.querySelector('.category-scroll');
    el.scrollList = this.querySelector('.category-list');
    el.arrowLeft = this.querySelector('.category-left');
    el.arrowRight = this.querySelector('.category-right');
    console.log(new Array(this))
  }

  // 拖曳模式
  slideControl() {
    this.setAttribute('initialized','');

    this.getValue();
    this.detectOffset();
    
    this.findActive();
  }

  // 移除拖曳模式
  destroy() {
    if(this.hasAttribute('initialized')){
      console.log('destroy');
      this.removeAttribute('initialized');
    }
  }
  
  // 響應式判斷
  responsive() {
    const self = this;
    const { breakpoint } = this.params;
    // 第一次判斷
    if(!breakpoint || window.innerWidth <= breakpoint)
      this.slideControl();

    //如果有設斷點,需加resize判斷
    if(breakpoint){
      window.addEventListener('resize',function() {
        if ( window.innerWidth <= breakpoint){
          if(!self.hasAttribute('initialized')){
            self.slideControl()
          }
        }else{
          self.destroy();
        }
      })
    }
  }

  // 載入初始滑動至 active item
  findActive() {
    if(this.getAttribute('type') == 'category') {
      this.itemOffset(this.activeItem);
      this.activeChange(this.activeItem);
    }
  }

  // 取得各項數值,放入val
  getValue() {
    const val = this.val;
    val.wrapWidth = this.$El.scrollContent.offsetWidth;
    val.listWidth = this.$El.scrollList.offsetWidth;
    val.scrollMax = this.calcMax();
  }

  // 計算可拖曳最大值
  calcMax() {
    const val = this.val
    return Number(val.listWidth - val.wrapWidth)
  }

  // 顯示偏移狀態
  detectOffset() {
    const val = this.val;
    if(val.offset >=  val.scrollMax){
      val.offset =  val.scrollMax
      this.setAttribute('offset','isEnd');
    } else if(val.offset <=  0){
      val.offset = 0
      this.setAttribute('offset','isStart');
    } else {
      this.setAttribute('offset',val.offset);
    }
  }

  // 計算 li 置中的距離
  itemOffset(e) {
    this.scrollX = e.offsetLeft - (this.val.wrapWidth - e.offsetWidth)/2;
  }

  // 計算拖曳距離
  transform(e) {
    const val = this.val;

    // 計算距離 & 實際偏移量
    val.distance = val.clientStart - e.clientX;
    val.offset = val.distance + val.clientEnd;

    this.detectOffset();

    this.$El.scrollContent.scrollTo(this.val.offset,0)
    // this.setAttribute('state','mousemove');
  }

  // mouseup 時,狀態改變
  mouseUp() {
    const val = this.val;
    val.clientEnd = val.offset;
    this.setAttribute('state','');
  }

  // 延遲判斷
  debounce(func, delay) {
    let timer;
    return function() {
      if(timer) clearTimeout(timer);
      timer = setTimeout(func, delay);
    }
  }

  // 切換 active item
  activeChange(item) {
    this.allItems.forEach((el)=>{el.classList.remove('active')});
    item.classList.add('active');
    this.activeItem = item;
    this.itemOffset(item);
    this.$El.scrollContent.scrollTo({
      top: 0,
      left: this.scrollX,
      behavior: 'smooth',
    })

    // this.val.offset = this.$El.scrollContent.scrollLeft
    // console.log(this.val.offset,'active')

    // 判斷箭頭顯示與否
    this.arrowLock(item);
  }

  // 拖曳及點擊事件
  // 若滑鼠按下未移動，則判斷為 click 事件
  eventDrag() {
    const self = this;
    const val = this.val;
    let timer;

    this.$El.scrollList.addEventListener('mousedown',function(e){

      // 如果不是拖曳模式,不顯示 offset
      if(!self.hasAttribute('initialized')) {
        self.setAttribute('offset','');
      }

      // 只要滑鼠按下,就必須更新點擊位置
      val.clientStart = e.clientX;
      self.setAttribute('state','mousedown');
    })

    // 拖曳事件
    this.$El.scrollContent.addEventListener('mousemove',function(e) {
      const state = self.getAttribute('state');
      if(state == 'mousedown' || state == 'mousemove'){
        self.transform(e);
        self.setAttribute('state','mousemove');
      }
    })

    // 滑鼠放開,需判斷是 click or 位移
    window.addEventListener('mouseup',function(e) {
      const state = self.getAttribute('state');
      if(state == 'mousedown' && e.target.nodeName
      == 'LI'){
        self.activeChange(e.target);
      }
      self.mouseUp();
    })

    // 補充判斷 行動裝置 touch 即可拖曳
    // 但不會觸發mouse事件,仍需回傳數值
    this.$El.scrollContent.addEventListener('scroll',function(e) {
      const state = self.getAttribute('state');
      clearTimeout(timer);
      if(state == 'mousemove') return;
        self.setAttribute('state','touchmove');
      if(this.scrollLeft == 0){
        self.setAttribute('offset','isStart');
      } else if(this.scrollLeft >= val.scrollMax) {
        self.setAttribute('offset','isEnd');
      } else {
        self.setAttribute('offset',this.scrollLeft);
        self.val.offset = this.scrollLeft;
      }
      val.clientEnd = this.scrollLeft;
      timer = setTimeout(function() {
        self.setAttribute('state','');
      },100)
    })
  }

  // resize時 active item 維持在中間
  // 避免判斷太密集,需延遲 300
  focusActiveItem() {
    const self = this;
    window.addEventListener('resize',
      self.debounce(
        function(){
          self.getValue();
          self.activeChange(self.activeItem)}, 300)
    )
  }

  // active item 為第一個和最一個時,箭頭隱藏
  arrowLock(target) {
    const { arrowLeft, arrowRight } = this.$El;
    const allItems = this.allItems;
    if(target == allItems[0]){
      arrowLeft.classList.add('lock')
    }else{
      arrowLeft.classList.remove('lock');
      arrowRight.classList.remove('lock');
    }

    if(target == allItems[allItems.length - 1]){
      arrowRight.classList.add('lock')
    }else{
      arrowRight.classList.remove('lock')
    }
  }

  // 箭頭點擊事件
  arrowEvent() {
    const { arrowLeft, arrowRight } = this.$El;
    const self = this;
    arrowLeft.addEventListener('click',function() {
      const item = self.activeItem;
      const target = item.previousElementSibling == null ? item : item.previousElementSibling;
      self.activeChange(target);
    })
    arrowRight.addEventListener('click',function() {
      const item = self.activeItem;
      const target = item.nextElementSibling == null ? item : item.nextElementSibling;
      self.activeChange(target);
    })
  }
}

if(!customElements.get('category-el')){
  customElements.define('category-el', Category4)
}

export default Category4;