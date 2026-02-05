import SlideNav from "./slide.js";

const slide = new SlideNav(".slide", ".slide-wrapper");
slide.init();

// Adiciona as setas
slide.addArrow(".prev", ".next");

// ADICIONE ESTA LINHA: Conecta as miniaturas
slide.addCustomControl(".custom-control");
