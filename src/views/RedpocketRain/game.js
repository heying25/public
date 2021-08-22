const Phaser = window.Phaser;

let gameIns = null;

const packSize = {
  width: 122,
  height: 165
};

function getNextX(min, max, prev) {
  if (!prev) {
    return Phaser.Math.Between(min, max);
  }
  let leftRange = [min, prev.x - packSize.width].sort((a, b) => a - b);
  let rightRange = [prev.x + packSize.width, max].sort((a, b) => a - b);
  if (leftRange[0] !== min) {
    leftRange = null;
  }
  if (rightRange[1] !== max) {
    rightRange = null;
  }
  const dropRange = [leftRange, rightRange]
    .filter(item => item !== null)
    .sort(() => {
      return Math.random() - 0.5;
    })[0];

  return Phaser.Math.Between(dropRange[0], dropRange[1]);
}

class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Main' });
  }

  preload() {
    this.load.image('pack', require('@/assets/RedpocketRain/pack.png'));
  }

  create(data) {
    if (data.paused) {
      this.scene.pause();
    }

    this.maxPackY = this.sys.canvas.height;

    this.packGroup = this.add.group({
      defaultKey: 'pack',
      maxSize: 20
    });

    this.packGroup.createMultiple({
      active: false,
      visible: false,
      key: this.packGroup.defaultKey,
      repeat: this.packGroup.maxSize - 1
    });

    // 保存上一个掉下去的红包，计算下一个的初始化 x, 尽量不重叠
    this.prevDropPack = null;

    this.time.addEvent({
      delay: 150,
      loop: true,
      callback: () => {
        const canvasWidth = this.sys.canvas.width;

        const dropX = getNextX(
          0 + packSize.width / 2,
          canvasWidth - packSize.width / 2,
          this.prevDropPack
        );
        const pack = this.packGroup.get(dropX, 0);
        if (pack) {
          pack.setActive(true).setVisible(true);
          this.prevDropPack = pack;
        }
      }
    });
    this.input
      .setHitArea(this.packGroup.getChildren())
      .on('gameobjectdown', (point, pack) => {
        if (pack._isFlying) {
          return;
        }
        pack._isFlying = true;
        this.tweens.add({
          targets: pack,
          x: 0,
          y: 0,
          duration: 300,
          onComplete: (tw, targets) => {
            pack._isFlying = false;
            this.packGroup.killAndHide(targets[0]);
          }
          // ease:
        });
      });
    this.input.enableDebug(this.packGroup.getChildren());
  }

  update() {
    Phaser.Actions.IncY(this.packGroup.getChildren(), 10);
    this.packGroup.children.iterate(item => {
      if (item.y > this.maxPackY) {
        this.packGroup.killAndHide(item);
      }
    });
  }
}

const game = {
  launch: ({ parent, width, height }) => {
    gameIns = new Phaser.Game({
      type: Phaser.CANVAS,
      parent: parent,
      transparent: true,
      width,
      height,
      scene: [MainScene]
    });

    gameIns.scene.start('Main', { paused: true });

    if (process.env.NODE_ENV === 'development') {
      window.gameIns = gameIns;
    }
  },
  pause: () => {
    gameIns.scene.getScene('Main').scene.pause();
  },
  restart: () => {
    gameIns.scene.getScene('Main').scene.restart({
      paused: false
    });
  },
  destroy: () => {
    gameIns.destroy(true);
  }
};

export default game;