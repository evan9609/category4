import OPTIONS from './options.js'

// const createTemplate = (el) => {
//   const { TEMPLATE } = OPTIONS;
//   console.log(TEMPLATE);
//   const { childDom } = el;
//   const container = document.createElement('div');
//   container.innerHTML = TEMPLATE;

//   const content = container.querySelector('.category-wrapper');

//   [...childDom].forEach((child) => {
//     content.append(child);
//   });

//   return container.children[0];
// }

class Category4 extends HTMLElement {
  constructor() {
    super();
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
    // this.#create();
    this.responsive();
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
  allItems= this.querySelectorAll('li')

  // copy from modal4
  // #create() {

  //   this.__events__ = {};

  //   this.#mount();
  // }

  // #mount() {
  //   // this.childDom = this.childNodes;
  //   this.template = createTemplate(this);

  //   this.innerHTML = '';
  //   this.append(this.template);

  //   this.responsive();
  // }



  slidable() {
    this.setAttribute('slidable','');
    this.getValue();
    this.detectOffset();
    this.event();
    this.resize();
  }
  destroy() {
    console.log('destroy');
    this.removeAttribute('slidable');
  }
  responsive() {
    const self = this;
    const breakpoint = this.getAttribute('breakpoint') || 0;
    if(!breakpoint){
      this.slidable();
    } else if ( window.innerWidth <= breakpoint) {
      this.setAttribute('slidable','');
      this.slidable();
    } else {
      window.addEventListener('resize',function() {
        if ( window.innerWidth <= breakpoint ){
          if(self.getAttribute('slidable') == null)
          self.slidable()
        }else{
          if(self.getAttribute('slidable') == '')
          self.destroy();
        }
      })
    }
  }
  getValue() {
    const val = this.val
    val.wrapWidth = this.offsetWidth;
    val.listWidth = this.querySelector('ul').offsetWidth;
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
  transform(e) {
    const val = this.val;

    // 計算距離 & 實際偏移量
    val.distance = val.clientStart - e.clientX;
    val.offset = val.distance + val.clientEnd;

    this.detectOffset();

    this.scrollTo(val.offset,0)
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
  activeChange() {
    this.allItems.forEach((el)=>{el.classList.remove('active')});
    this.clickItem.classList.add('active');
    this.scrollTo({
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
        self.scrollX = this.offsetLeft - (self.val.wrapWidth - this.offsetWidth)/2;
      })
    })
    this.addEventListener('mousedown',function(e){
      if(this.getAttribute('slidable') === null) {
        this.setAttribute('offset','');
        return;
      }
      val.clientStart = e.clientX;
      this.setAttribute('state','mousedown');
    })
    this.addEventListener('mousemove',function(e) {
      const state = self.getAttribute('state');
      if(state == 'mousedown' || state == 'mousemove')
        self.transform(e);
    })
    window.addEventListener('mouseup',function(e) {
      const state = self.getAttribute('state');
      if(state == 'mousedown'){
        self.activeChange();
      }else if(state == 'mousemove'){
        self.mouseUp();
      }
    })
    this.addEventListener('scroll',function(e) {
      const state = self.getAttribute('state');
      clearTimeout(timer);
      if(state == 'mousemove') return;
      this.setAttribute('state','touchmove');
      if(this.scrollLeft == 0){
        this.setAttribute('offset','isStart');
      } else if(this.scrollLeft >= val.scrollMax) {
        this.setAttribute('offset','isEnd');
      } else {
        this.setAttribute('offset',this.scrollLeft);
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
}

if(!customElements.get('category-el')){
  customElements.define('category-el', Category4)
}

export default Category4;