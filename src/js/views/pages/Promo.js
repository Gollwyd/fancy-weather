// import '../css/promo.scss'

const Promo = {
 render: async () => {
  const view = /* html */`
    <div class="promo"> 
             <div class="promo__background"></div> 
             <div class="module__hello">Hello team!</div> 
        </div> 

          `;
  return view;
 },
 afterRender: async () => { },

};

export default Promo;
