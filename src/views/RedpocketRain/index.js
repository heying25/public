import PlayScene from './PlayScene';
const Phaser = window.Phaser;

const ratio = window.innerWidth / window.innerHeight;

function launch(containerId) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    width: 750,
    height: 750 / ratio,
    parent: containerId,
    transparent: true,
    scene: [PlayScene]
  });
}

export default launch;
