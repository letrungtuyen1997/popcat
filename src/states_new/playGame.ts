import { Board } from "../objects_new/board";
import { Sound } from "phaser-ce";

export default class playGame extends Phaser.State {
    bg: Phaser.Image
    btn_start: Phaser.Image
    btn_leaderboard: Phaser.Image
    popcat: Phaser.Image
    sound_Playgame: Phaser.Sound
    Sound_bg: Phaser.Sound
    constructor() {
        super()

    }
    create() {
        this.Sound_bg = this.game.add.audio('bg_sound', 1, true)
        this.Sound_bg.play()
        this.sound_Playgame = this.game.add.audio('sound_Playgame', 2)
        //this.bg = new Board(this.game, 0, 0)
        this.bg = this.game.add.image(0, 0, 'bg')
        this.bg.scale.setTo(0.8, 1.1)
        this.btn_start = this.game.add.image(0, 0, 'btn_start')
        this.btn_leaderboard = this.game.add.image(0, 0, 'btn_leaderboard')
        this.btn_start.scale.setTo(1.2, 1.2)
        this.btn_start.anchor.set(0.5, 0.5)
        this.btn_leaderboard.anchor.set(0.5, 0.5)
        this.btn_leaderboard.scale.setTo(1.2, 1.2)
        this.btn_start.x = this.game.world.centerX
        this.btn_start.y = this.game.world.centerY + this.btn_start.height
        this.btn_leaderboard.x = this.game.world.centerX
        this.btn_leaderboard.y = this.game.world.centerY + (this.btn_leaderboard.height * 4)
        this.popcat = this.game.add.image(0, 0, 'popcat')
        this.popcat.scale.setTo(1.5, 1.5)
        this.popcat.x = this.game.world.centerX - (this.popcat.width / 2)
        this.popcat.y = this.game.world.top + this.popcat.height / 2
        let tween = this.game.add.tween(this.popcat).to({ y: this.popcat.y + 100 }, 1000, "Linear", true, 0, 100, true).start()
        this.btn_start.inputEnabled = true
        this.btn_start.events.onInputDown.add(e => {
            this.sound_Playgame.play()
            this.Sound_bg.stop()
            this.game.add.tween(this.btn_start.scale).to({ x: 0.8, y: 0.8 }, 300, Phaser.Easing.Linear.None, true, 0, 0, true).start().onComplete.addOnce(e => {
                this.starGame()
            })
            // this.starGame()
        }, this)
        this.btn_leaderboard.inputEnabled = true
        this.btn_leaderboard.events.onInputDown.add(e => {
            this.sound_Playgame.play()
            this.Sound_bg.stop()
            this.game.add.tween(this.btn_leaderboard.scale).to({ x: 0.8, y: 0.8 }, 300, Phaser.Easing.Linear.None, true, 0, 0, true).start().onComplete.addOnce(e => {
                this.Gameover()
            })

        }, this)


    }
    starGame() {
        this.game.state.start('main', true, false)
    }
    Gameover() {
        this.game.state.start('GameOver', true, false)
    }
}