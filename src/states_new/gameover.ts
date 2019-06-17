import { G } from '../app'
import { Vs } from '../objects_new/vs/vs'
import { LeaderBoard } from '../objects_new/leaderboard/leaderboard'
import { Board } from '../objects_new/board';

export default class GameOver extends Phaser.State {

	replayBtn: ReplayButton
	leaderBoard: LeaderBoard
	score: number
	Board: Board

	init(score: number) {
		this.score = score
	}

	preload() {

	}
	create() {
		//this.Board = new Board(this.game, 4,0)
		this.game.add.image(0,0,'bg2').scale.setTo(1.61,1.61)


		let t1 = this.game.add.image(350, 320, 'tee')
		t1.anchor.setTo(0.5, 0.5)
		t1.scale.setTo(1.6, 1.6)

		let t2 = this.game.add.image(730, 320, 'tee')
		t2.anchor.setTo(0.5, 0.5)
		t2.scale.setTo(-1.6, 1.6)

		let txt = this.game.add.bitmapText(540, 300, 'bubble', 'SCORE', 75)
		txt.anchor.setTo(0.5, 0.5)

		this.leaderBoard = new LeaderBoard(this.game, 540, 0, this.score)
		this.leaderBoard.animation(1)
			.then(e => {
				this.replayBtn = new ReplayButton(this.game, 540, 1300)
				this.replayBtn.onClick = { f: this.leaderBoard.animation, ctx: this.leaderBoard }
			})
			.then(e => (G.platform === 'facebook') ? this.leaderBoard.loadLeaderBoard() : undefined)
	}
}

interface Listener {
	f: Function
	ctx: any
}

class ReplayButton extends Phaser.Image {
	onClick: Listener
	sndClick: Phaser.Sound
	constructor(game: Phaser.Game, x: number, y: number) {
		super(game, x, y, 'replayBtn')
		this.anchor.setTo(0.5, 0.5)
		this.scale.setTo(0, 0)
		this.game.add.existing(this)

		this.inputEnabled = true
		this.events.onInputDown.add(this.clickHandler, this)

		//this.sndClick = this.game.add.audio('btn')
		this.game.add.tween(this.scale).to({ x: 1.5, y: 1.5 }, 300, Phaser.Easing.Back.Out, true, 0, 0, false)
	}

	clickHandler() {
		let close: Function = () => {
			//this.sndClick.play()
			this.game.add.tween(this.scale).to({ x: 0, y: 0 }, 300, Phaser.Easing.Back.In, true, 0, 0, false)
				.onComplete.add(() => {
					if (this.onClick)
						this.onClick.f.apply(this.onClick.ctx, [0]).then(e => {
							this.game.state.start('playGame', true, false)
						})
				}, this)
		}

		//close.apply(this)
			if (G.platform === 'facebook'){
				if (G.game.adsLoadCompleted != undefined){
					G.game.adsLoadCompleted.then(e => {
						G.game.showRewardAds().then(e => close.apply(this))
						.catch(e => {
							console.log(e)
							close.apply(this)
						})
					})
					.catch(e => close.apply(this))
				}
				else
					close.apply(this)
			}
			else
				close.apply(this)
		}
	
}