const Phaser = window.Phaser;
const Scene = Phaser.Scene;
import random from 'lodash/random';

const staticTime = 15;
var redWidth = 135;
var startX = [
    [0 + redWidth / 2, 250 - redWidth / 2],
    [250 + redWidth / 2, 500 - redWidth / 2],
    [500 + redWidth / 2, 750 - redWidth / 2]
];

function activatePocket(pocket) {
    pocket
        .setActive(true)
        .setVisible(true)
        .setFrame(random(0, 4))
        .setRotation(random(-1, 1));
}

function addPocket() {
    var [x1, x2] = startX[random(0, 2)];
    var initX = random(x1, x2);
    var pocket = this.group.get(initX, 160);

    if (!pocket) return; // None free

    activatePocket(pocket);
}

function wait(ms) {
    let id = null;
    return {
        set: () => {
            return new Promise(resolve => {
                id = setTimeout(resolve, ms);
            });
        },
        clear: () => {
            clearTimeout(id);
        }
    };
}

export default class game extends Scene {
    constructor() {
        super({ key: 'game' });
        this.countdownTime = staticTime;
        this.group = null;
        this.clickTimes = 0;
    }
    preload() {
        this.load.spritesheet(
            'pocket',
            require('@/assets/RedpocketRain/redpocket.png'),
            {
                frameWidth: 133,
                frameHeight: 165
            }
        );
        this.load.image('BG', require('@/assets/RedpocketRain/redrain_bg.png'));
        this.load.image(
            'countdown1',
            require('@/assets/RedpocketRain/redrain_countdown1.png')
        );
        this.load.image(
            'countdown2',
            require('@/assets/RedpocketRain/redrain_countdown2.png')
        );
        this.load.image(
            'countdown3',
            require('@/assets/RedpocketRain/redrain_countdown3.png')
        );
        this.load.image(
            'footer',
            require('@/assets/RedpocketRain/redrain_footer.png')
        );
        this.load.image(
            'cheerDuck',
            require('@/assets/RedpocketRain/redrain_open.png')
        );
        this.load.image(
            'clock',
            require('@/assets/RedpocketRain/redrain_clock.png')
        );
        this.load.image(
            'moveline',
            require('@/assets/RedpocketRain/redrain_countdown_move.png')
        );
    }

    async create() {
        var y = 750 / (window.innerWidth / window.innerHeight);

        this.countdown1 = this.add
            .image(750, 1650, 'countdown1', 0)
            .setPosition(375, y / 2)
            .setVisible(false);
        this.countdown2 = this.add
            .image(750, 1650, 'countdown2', 0)
            .setPosition(375, y / 2)
            .setVisible(false);
        this.countdown3 = this.add
            .image(750, 1650, 'countdown3', 0)
            .setPosition(375, y / 2)
            .setVisible(true);

        this.bg = this.add
            .image(750, 1650, 'BG', 0)
            .setPosition(375, y / 2)
            .setVisible(false);
        this.footer = this.add
            .image(750, 161, 'footer', 0)
            .setPosition(375, y - 161 / 2)
            .setDepth(1)
            .setVisible(false);

        this.cheerDuck = this.add.image(134, 209, 'cheerDuck', 1);
        this.cheerDuck.setVisible(false);

        this.group = this.add.group({
            defaultKey: 'pocket',
            maxSize: 50,
            createCallback: pocket => {
                pocket.setName('pocket' + this.group.getLength());
                var clickE = pocket.setInteractive();
                clickE.on('pointerdown', pointer => {
                    clearTimeout(this.t1);
                    this.group.killAndHide(pocket);
                    var { x, y } = pointer.position;
                    this.cheerDuck
                        .setVisible(true)
                        .setPosition(x, y)
                        .setRotation(pocket.angle);
                    this.clickTimes++;
                    this.clickText && this.clickText.destroy();
                    this.clickText = this.add
                        .text(618, 200, this.clickTimes, {
                            fontSize: '34px',
                            color: '#a04e00',
                            stroke: '#a04e00',
                            strokeThickness: 2
                        })
                        .setOrigin(0, 1)
                        .setDepth(2);
                    this.t1 = setTimeout(() => {
                        this.cheerDuck.setVisible(false);
                    }, 300);
                });
            }
        });

        //开始倒计时
        this.t1 = wait(1000);
        await this.t1.set();
        this.countdown3.setVisible(false);
        this.countdown2.setVisible(true);
        this.t2 = wait(1000);
        await this.t2.set();
        this.countdown2.setVisible(false);
        this.countdown1.setVisible(true);
        this.t3 = wait(1000);
        await this.t3.set();
        this.countdown1.setVisible(false);
        this.bg.setVisible(true);
        this.footer.setVisible(true);
        this.addpocketTimer = this.time.addEvent({
            delay: 250,
            loop: true,
            callback: addPocket.bind(this)
        });
        this.t1 && this.t1.clear();
        this.t2 && this.t2.clear();
        this.t3 && this.t3.clear();

        this.add
            .image(129, 133, 'clock', 0)
            .setPosition(100, 100)
            .setDepth(1);

        this.moveline = this.add
            .image(534, 34, 'moveline', 0)
            .setPosition(180, 118)
            .setOrigin(0, 1)
            .setDepth(2);

        this.tweens.timeline({
            targets: this.moveline,
            ease: 'Linear',
            duration: staticTime * 1000,
            tweens: [
                {
                    scaleX: 0
                }
            ]
        });
        this.countText = this.add
            .text(100, 100, staticTime, {
                fontSize: '50px',
                color: '#79512a',
                stroke: '#79512a',
                strokeThickness: 2,
                align: 'center'
            })
            .setOrigin(0.5)
            .setDepth(2);
        this.countdowntimer = this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {
                this.countdownTime--;
                this.countText && this.countText.destroy();
                this.countText = this.add
                    .text(100, 100, this.countdownTime, {
                        fontSize: '50px',
                        color: '#79512a',
                        stroke: '#79512a',
                        strokeThickness: 2,
                        align: 'center'
                    })
                    .setOrigin(0.5)
                    .setDepth(2);
                if (this.countdownTime === 0) {
                    this.countdowntimer.destroy();
                    this.addpocketTimer.destroy();
                    this.moveline.setVisible(false);
                    if (typeof this.game.finishCallback === 'function') {
                        this.game.finishCallback(this.clickTimes);
                    }
                    return;
                }
            }
        });

    }

    update() {
        Phaser.Actions.IncY(this.group.getChildren(), 10);
        this.group.children.iterate(pocket => {
            if (pocket.y > 750 / (window.innerWidth / window.innerHeight)) {
                this.group.killAndHide(pocket);
            }
        });
    }
}
