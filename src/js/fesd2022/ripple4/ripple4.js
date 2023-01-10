import OPTIONS from './option.js';

function createRipple(e,r4){
  const button = r4
  const { color, opacity, duration } = r4.s.options

  // 可以更改點擊時生成效果樣式的結構
  let ripples = document.createElement('span');
  
  //偵測滑鼠點擊位置
  let x = e.pageX - $(r4).offset().left;
  let y = e.pageY - $(r4).offset().top;

  ripples.style.cssText = `background: ${color};left: ${x}px;top: ${y}px;opacity: ${opacity};animation-duration: ${duration}ms`
  
  ripples.classList.add("circle");
  
  // 生成
  button.appendChild(ripples);
}
function hoverEnter(e) {

}

class Ripple4 extends HTMLElement {
  constructor() {
    super();
  };

  connectedCallback() {
    this.#create()
  };

  #create() {
    this.s = {};
    this.s.eventEffect = this.getAttribute('r4-hover') === 'true' ? true : OPTIONS.SETTINGS.hover;
    const options = {
      color: this.getAttribute('r4-color') || OPTIONS.SETTINGS.color,
      opacity: this.getAttribute('r4-opacity') || OPTIONS.SETTINGS.opacity,
      duration: this.getAttribute('r4-duration') || OPTIONS.SETTINGS.duration,
      hover: this.getAttribute('r4-hover') || OPTIONS.SETTINGS.hover,
      click: this.getAttribute('r4-hover-click') || OPTIONS.SETTINGS.click,
    };
    
    this.s.options = options;
    if(this.s.eventEffect){
      this.classList.add('hover-btn')
    }
    this.#init();
  };

  #init() {
    this.#ball();
    this.#event();
  }
  #ball() {
    const ball = document.createElement('i');
    ball.classList.add('hover-ball');
    ball.style.width =  '0px';
    ball.style.height = '0px';
    this.appendChild(ball);
  }
  #event() {
    const ball = this.querySelector('i');
    const button = this;

    button.addEventListener('click',function(e){
      if(button.s.options.click === true){
        createRipple(e,button)
      }
    });
    
    button.addEventListener('mouseenter',function(e){
      // console.log('hover')
      // console.log(ball,'ball')
      if(button.s.options.hover){
        const posX = e.clientX - button.getBoundingClientRect().left;
        const posY = e.clientY - button.getBoundingClientRect().top;
        ball.style.width = button.offsetWidth * 2.1 + 'px';
        ball.style.height = button.offsetWidth * 2.1 + 'px';
        ball.style.left = posX + 'px';
        ball.style.top = posY + 'px';

      }
      // const posX = e.clientX - button.getBoundingClientRect().left;
      //   const posY = e.clientY - button.getBoundingClientRect().top;
      //   ball.style.width = button.offsetWidth * 2.1 + 'px';
      //   ball.style.height = button.offsetWidth * 2.1 + 'px';
      //   ball.style.left = posX + 'px';
      //   ball.style.top = posY + 'px';
    });
  };

  #hover() {
    const targets = document.querySelectorAll('.hover-btn:not(.btn-init)');
    const { click } = this.s.options
    if (!targets.length) return;
    targets.forEach((el) => {
      // const self = el;
      // const width = self.offsetWidth * 2.1;
      // const ball = document.createElement('i');
      // ball.classList.add('hover-ball');
      // ball.style.width = width + 'px';
      // ball.style.height = width + 'px';
      // self.appendChild(ball);
      // self.addEventListener('mouseenter', function (e) {
      //   const posX = e.clientX - el.getBoundingClientRect().left;
      //   const posY = e.clientY - el.getBoundingClientRect().top;
      //   ball.style.width = self.offsetWidth * 2.1 + 'px';
      //   ball.style.height = self.offsetWidth * 2.1 + 'px';
      //   ball.style.left = posX + 'px';
      //   ball.style.top = posY + 'px';
      // });
      // self.addEventListener('mouseleave', function (e) {
      //   const posX = e.clientX - el.getBoundingClientRect().left;
      //   const posY = e.clientY - el.getBoundingClientRect().top;
      //   ball.style.left = posX + 'px';
      //   ball.style.top = posY + 'px';
      // });
      // self.classList.add('hover-init');
    });
    
    if (click === true) {
      this.#event();
    }
  };
};

if (!customElements.get('ripple-btn')) {
  customElements.define('ripple-btn', Ripple4);
};

export default Ripple4;

