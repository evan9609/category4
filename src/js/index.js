
// import { Aost4, Modal4 } from './fesd2022/fesd';
// import Dropdown4 from './fesd2022/dropdown4/dropdown4';

import { Aost4 } from "./fesd2022/fesd";

window._g.modalOpen = () => {
  Modal4.open({
    target: 'work',
    route: './lightBox.html',
    on: {
      open() {
        _g.scrollLock();
        const aost = new Aost4('[data-modal-id="work"] [data-aost]',
          {
            scroller:'[data-modal-id="work"] .os-viewport',
          },
        );
        setTimeout(function() {
          Anchor4.run({
            target:'.modal-block.block2',
            container: '[data-modal-id="work"] .os-viewport',
            spacer: '[data-modal-id="work"] nav.nav_light_box',
            on: {
              afterScroll() {
                alert('block2!!!!')
              }
            }
            })
          },800)
        },
      close(modal) {
          modal.destroy();
          _g.scrollUnlock();
        },
      }
    })
  };

const $dropdown = $('dropdown-el');
$dropdown.each((i,el) => {
  el.on('change',function() {
    const key = String.fromCharCode(i+65)
    console.log('選單'+key)
  })
})

$(() => {
  _g.imagePreview('.upload-btn',{
    sizeLimit: 1,
    on:{
      changeAfter() {
        alert('上傳成功!');
        $('nav .text').removeClass('show')
      },
      overLimit() {
        alert('檔案超過限制!')
      }
    }
  });
  _g.categorySlider('.category-slider',{
    breakpoint: 1200,
  })
})


//category4

// let start;
// let end = 0;
// let val2 = 0;
// let trans = 0;
// let width = $('category-el').innerWidth();
// console.log(width);


// $('category-el').on('mousedown',function(e) {

//   console.log(e.detail,'eee');
//   start = e.clientX;
//   $(this).on('mousemove',function(e) {
//     trans = start - e.clientX;
//     val2 = trans + end;

//     $('category-el').scrollLeft(val2)
//   })
  
//   $(window).on('mouseup',function(e) {
//     e.stopPropagation();
//     e.preventDefault();
//     if(val2 >=  width) {
//       end = width;
//       console.log(end);
//     }else if(val2 <=  0) {
//       end = 0;
//       console.log(end);
//     }else{
//       end = val2;
//     }
//     console.log(end,'end')
//     $('category-el').off('mousemove');
//     $(window).off('mouseup');

//   })
// })

