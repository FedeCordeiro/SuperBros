//ANIMACIONES

export const createAnimations = (game) => {
  //propiedad de Phaser para crear animaciones
  game.anims.create({
    key: "mario-walk",
    frames: game.anims.generateFrameNumbers(
      "mario",
      //se debe indicar las posiciones para dicha animacion
      { start: 3, end: 2 }
    ),
    frameRate: 12,
    repeat: -1,
  });

  game.anims.create({
    key: "mario-idle",
    frames: [{ key: "mario", frame: 0 }],
  });

  game.anims.create({
    key: "mario-jump",
    frames: [{ key: "mario", frame: 5 }],
  });

  game.anims.create({
    key: "mario-dead",
    frames: [{ key: "mario", frame: 4 }],
  });
};
