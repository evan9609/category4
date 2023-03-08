import OPTIONS from './options.js'

const createTemplate = (el) => {
  const { TEMPLATE, SETTINGS } = OPTIONS;

  const { childDom } = el;
  const container = document.createElement('div');
  container.innerHTML = TEMPLATE;

  const content = container.querySelector('.category-list');
  const dropdown = container.querySelector('dropdown-el');
  // const arrow_left = `<svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
  // <path opacity="0.8" d="M7 1L2 6L7 11" stroke="black" stroke-width="2"/>
  // </svg>`;
  // const arrow_right = `<svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
  // <path opacity="0.8" d="M1 1L6 6L1 11" stroke="black" stroke-width="2"/>
  // </svg>`;

  [...childDom].forEach((child) => {
    content.append(child);
  });

  [...el.allItems].forEach((child) => {
    const li = document.createElement('li')
    li.innerHTML = child.innerHTML
    dropdown.append(li)
  });

  container.querySelector('.category-left').innerHTML = SETTINGS.arrow_left;
  container.querySelector('.category-right').innerHTML = SETTINGS.arrow_right;

  // if(el.hasAttribute('dropdown-aaa')){
  //   [...childDom].forEach((child) => {
  //     dropdown.append(child);
      
  //   });
  //   console.log('dddd')

  // }

  return container.children[0];
}

class Category4 extends HTMLElement {
  constructor() {
    super();
    this.allItems = this.querySelectorAll('li');
    this.$El = {};
    this.val = {
      clientStart: 0,
      clientEnd: 0,
      distance: 0,
      offset: 0,
      scrollX: 0,
      clickItem: null,
    };
  };
  connectedCallback() {
    this.#init();
    // this.responsive();
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

    this.responsive();
  }

  #queryEl() {
    this.$El.scrollContent = this.querySelector('.category-scroll');
    this.$El.scrollList = this.querySelector('.category-list');
    this.$El.arrowLeft = this.querySelector('.category-left');
    this.$El.arrowRight = this.querySelector('.category-right');
    console.log(new Array(this))
  }

  slideControl() {
    this.setAttribute('slidable','');
    this.getValue();
    this.detectOffset();
    this.event();
    this.resize();
    this.arrowEvent();
  }
  destroy() {
    console.log('destroy');
    this.removeAttribute('slidable');
  }
  responsive() {
    const self = this;
    const breakpoint = this.getAttribute('breakpoint') || 0;
    if(!breakpoint){
      this.slideControl();
    } else if ( window.innerWidth <= breakpoint) {
      this.setAttribute('slidable','');
      this.slideControl();
    } else {
      window.addEventListener('resize',function() {
        if ( window.innerWidth <= breakpoint ){
          if(self.getAttribute('slidable') == null)
          self.slideControl()
        }else{
          if(self.getAttribute('slidable') == '')
          self.destroy();
        }
      })
    }
  }
  getValue() {
    const val = this.val
    val.wrapWidth = this.$El.scrollContent.offsetWidth;
    val.listWidth = this.$El.scrollList.offsetWidth;
    val.scrollMax = this.calcMax();
  }
  // 計算滑動最大值
  calcMax() {
    const val = this.val
    return Number(val.listWidth - val.wrapWidth)
  }
  // 顯示偏移量
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

  itemOffset(e) {
    this.scrollX = e.offsetLeft - (this.val.wrapWidth - e.offsetWidth)/2;
  }
  transform(e) {
    const val = this.val;

    // 計算距離 & 實際偏移量
    val.distance = val.clientStart - e.clientX;
    val.offset = val.distance + val.clientEnd;

    this.detectOffset();

    this.$El.scrollContent.scrollTo(val.offset,0)
    this.setAttribute('state','mousemove');
  }
  mouseUp() {
    const val = this.val;
    val.clientEnd = val.offset;
    this.setAttribute('state','');
  }
  debounce(func, delay) {
    let timeout = null;
    return function() {
      let a = this;
      let args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function() {
        func.apply(a,args)
      },delay)
    }
  }
  activeChange(clickItem) {
    this.allItems.forEach((el)=>{el.classList.remove('active')});
    clickItem.classList.add('active');
    console.log(clickItem);
    this.$El.scrollContent.scrollTo({
      top: 0,
      left: this.scrollX,
      behavior: 'smooth',
    })
  }
  event() {
    const self = this;
    const val = this.val;
    let timer;
    this.allItems.forEach((el)=>{
      el.addEventListener('mousedown',function() {
        self.clickItem = this;
        self.itemOffset(el);
      })
    })
    this.$El.scrollList.addEventListener('mousedown',function(e){
      if(self.getAttribute('slidable') === null) {
        self.setAttribute('offset','');
        return;
      }
      val.clientStart = e.clientX;
      self.setAttribute('state','mousedown');
    })
    this.$El.scrollContent.addEventListener('mousemove',function(e) {
      const state = self.getAttribute('state');
      if(state == 'mousedown' || state == 'mousemove')
        self.transform(e);
    })

    window.addEventListener('mouseup',function(e) {
      const state = self.getAttribute('state');
      if(state == 'mousedown'){
        self.activeChange(self.clickItem);
        self.setAttribute('state','');
      }else if(state == 'mousemove'){
        e.stopPropagation();
        self.mouseUp();
      }
    })
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
      }
      val.clientEnd = this.scrollLeft;
      timer = setTimeout(function() {
        self.setAttribute('state','');
      },100)
    })
  }
  resize() {
    const self = this;
    window.addEventListener('resize',function() {
      self.getValue();
    })
  }
  arrowLock() {
    
  }
  arrowEvent() {
    const { arrowLeft, arrowRight } = this.$El;
    const self = this;
    arrowLeft.addEventListener('click',function() {
      const target = self.clickItem.previousElementSibling == null ? self.clickItem : self.clickItem.previousElementSibling;
      self.itemOffset(target);
      self.activeChange(target);
      self.clickItem = target;
      if(self.clickItem.previousElementSibling == null){
        this.classList.add('lock')
      }else{
        this.classList.remove('lock');
        arrowRight.classList.remove('lock');
      }
    })
    arrowRight.addEventListener('click',function() {
      const target = self.clickItem.nextElementSibling == null ? self.clickItem : self.clickItem.nextElementSibling;
      if(target == self.clickItem){
        this.classList.add('lock')
      }else{
        this.classList.remove('lock')
      }
      self.itemOffset(target);
      self.activeChange(target);
      self.clickItem = target;
      if(self.clickItem.nextElementSibling == null){
        this.classList.add('lock')
      }else{
        this.classList.remove('lock');
        arrowLeft.classList.remove('lock');
      }
    })


  }
}

if(!customElements.get('category-el')){
  customElements.define('category-el', Category4)
}

export default Category4;