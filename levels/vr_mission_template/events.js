module.exports = function (event, world) {
  if (event.name === "mapDidLoad") {
    const { game } = world.__internals.level;

    const projectiles = game.add.group();
    projectiles.enableBody = true;
    projectiles.physicsBodyType = Phaser.Physics.ARCADE;

    projectiles.createMultiple(50, "TwilioQuestTileset", 5025);
    projectiles.setAll("checkWorldBounds", true);
    projectiles.setAll("outOfBoundsKill", true);
    projectiles.setAll("anchor", { x: 0.5, y: 0.5 });

    const targets = [];
    world.forEachEntities("target", (target) => {
      targets.push(target);
    });

    game.input.onTap.add(({ x, y }) => {
      const { player } = world.__internals.level;
      const projectile = projectiles.getFirstDead();
      projectile.reset(
        player.sprite.x + player.sprite.width / 2,
        player.sprite.y + player.sprite.height / 2
      );

      const radAngleToPointer = game.physics.arcade.angleToPointer(projectile);
      const ninetyDegreeOffsetInRad = game.math.degToRad(90);
      projectile.rotation = radAngleToPointer + ninetyDegreeOffsetInRad;

      game.physics.arcade.moveToPointer(projectile, 300);

      projectile.update = function () {
        targets.forEach((target) => {
          game.physics.arcade.collide(
            projectile,
            target.sprite,
            (projectileSprite, targetSprite) => {
              projectileSprite.kill();

              targetSprite.alpha = 0;

              // are all targets hit
              if (targets.every((target) => target.sprite.alpha === 0)) {
                // targets.forEach((target) => (target.activated = false));
                // console.log("all targets hit", targets);
                world.forEachEntities("cannon", (cannon) => {
                  cannon.activated = false;
                });
              }
            }
          );
        });

        game.physics.arcade.collide(
          projectile,
          world.entityService.getGroup("objects"),
          (proj, target) => {
            proj.kill();
          }
        );

        world.__internals.TiledService.getLayers(
          (layer) => layer.properties.collision
        ).forEach((collisionLayer) => {
          game.physics.arcade.collide(
            projectile,
            collisionLayer.instance,
            (proj, target) => {
              proj.kill();
            }
          );
        });
      };
    });
  }
};
