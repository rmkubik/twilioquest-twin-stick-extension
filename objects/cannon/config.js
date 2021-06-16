function shoot(self, projectiles, game, target, world) {
  const projectile = projectiles.getFirstDead();
  projectile.reset(
    self.sprite.x + self.sprite.width / 2,
    self.sprite.y + self.sprite.height / 2
  );

  projectile.update = () => {
    game.physics.arcade.collide(
      projectile,
      target,
      (projectileSprite, targetSprite) => {
        projectileSprite.kill();
        targetSprite.kill();

        world.screenShake(10);

        setTimeout(() => {
          world.setContext({
            currentLevel: {
              levelName: "fog_owl",
              playerEntryPoint: "player_entry2",
            },
          });
        }, 1500);
      }
    );
  };

  game.physics.arcade.moveToObject(projectile, target, 100);
}

const intervals = [];

const clearAllIntervals = () =>
  intervals.forEach((interval) => clearInterval(interval));

module.exports = {
  animations: {
    deactivated: { frames: [4963], frameRate: 1 },
  },
  spriteSheets: {
    tq_cannon_bullet: {
      fileName: "bullet.png",
      frameDimensions: {
        width: 16,
        height: 16,
      },
    },
  },
  events: {
    onMapDidLoad: (self, event, world) => {
      const { game } = world.__internals.level;

      const projectiles = game.add.group();
      projectiles.enableBody = true;
      projectiles.physicsBodyType = Phaser.Physics.ARCADE;

      projectiles.createMultiple(50, "tq_cannon_bullet", 0);
      projectiles.setAll("checkWorldBounds", true);
      projectiles.setAll("outOfBoundsKill", true);
      projectiles.setAll("anchor", { x: 0.5, y: 0.5 });

      const interval = setInterval(() => {
        if (self.activated) {
          shoot(
            self,
            projectiles,
            game,
            world.__internals.level.player.sprite,
            world
          );
        } else {
          clearInterval(interval);
          self.playAnimation("deactivated");
          // projectiles.killAll();
        }
      }, 2000);

      intervals.push(interval);
    },
    onLevelWillUnload: () => {
      clearAllIntervals();
    },
  },
  properties: {
    sprite: {
      defaultFrameIndex: 4962,
      spriteSheet: "TwilioQuestTileset",
      layers: [],
    },
  },
};
