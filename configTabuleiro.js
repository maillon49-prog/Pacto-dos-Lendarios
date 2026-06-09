window.CONFIG_TABULEIRO = {
  largura: 1600,
  altura: 900,
  imagem: "assets/board/campo.jpeg",
  slots: {
    oponente: {
      heroi: { x: 248, y: 36, w: 188, h: 278 },
      pactos: [
        { x: 514, y: 48, w: 178, h: 250 },
        { x: 704, y: 42, w: 192, h: 260 },
        { x: 908, y: 48, w: 178, h: 250 }
      ],
      reino: { x: 1100, y: 92, w: 118, h: 166 },
      primordial: { x: 1236, y: 44, w: 176, h: 254 },
      deck: { x: 64, y: 344, w: 64, h: 64 },
      abismo: { x: 64, y: 480, w: 64, h: 64 },
      dominio: { x: 1456, y: 344, w: 80, h: 80 },
      recursos: { x: 450, y: 314, w: 724, h: 34 }
    },
    jogador: {
      heroi: { x: 248, y: 438, w: 188, h: 280 },
      pactos: [
        { x: 514, y: 458, w: 178, h: 250 },
        { x: 704, y: 452, w: 192, h: 260 },
        { x: 908, y: 458, w: 178, h: 250 }
      ],
      reino: { x: 1100, y: 540, w: 118, h: 166 },
      primordial: { x: 1236, y: 446, w: 176, h: 258 },
      deck: { x: 1456, y: 480, w: 80, h: 80 },
      abismo: { x: 1456, y: 625, w: 80, h: 80 },
      dominio: { x: 1456, y: 706, w: 80, h: 80 },
      recursos: { x: 450, y: 704, w: 724, h: 30 },
      mao: { x: 258, y: 730, w: 900, h: 158 }
    },
    interface: {
      barraTurno: { x: 260, y: 392, w: 990, h: 44 }
    }
  }
};
