module.exports = {
  animations: {
    idle: {
      frames: [
        192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205,
        206, 207, 208, 209, 210, 211, 212, 213, 214, 215,
      ],
      frameRate: 6,
    },
  },
  spriteSheets: {
    tq_frederic: {
      fileName: "NPC_Frederic.png",
      frameDimensions: {
        width: 32,
        height: 32,
      },
    },
  },
  events: {
    onMapDidLoad: (self) => {
      self.sprite.alpha = 0.75;
    },
  },
  properties: {
    sprite: {
      defaultFrameIndex: 192,
      spriteSheet: "tq_frederic",
      layers: [],
    },
    idleAnimations: {
      animations: {
        idle: 100,
      },
      minIdleTime: 2000,
      maxIdleTime: 5000,
    },
  },
};
