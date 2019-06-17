import { Board } from '../objects_new/board'
import { peices } from '../objects_new/peices'
import { ScoreCounter } from '../objects_new/ScoreCounter'
import { G } from '../app'
import { Vs, PlayerInfo } from '../objects_new/vs/vs'
import { ScorePanel } from '../objects_new/vs/panel'
import { Peice } from '../objects_new/peice'
import { Greeting } from '../objects_new/greeting/greeting'




export default class main extends Phaser.State {

	board: Board
	peices: peices
	Peice: Peice
	scoreNumber: number = 0
	scoreGet: number = 0
	oldScoreNumber: number = 0
	score: ScoreCounter
	vs: Vs
	greet: Greeting
	scorePanel: ScorePanel
	sound_bg: Phaser.Sound
	sound_match: Phaser.Sound
	sound_match_many: Phaser.Sound
	sound_yeah: Phaser.Sound
	sound_fade: Phaser.Sound
	sound_clap: Phaser.Sound
	sound_yeah1: Phaser.Sound
	sound_over: Phaser.Sound
	frame_target: Phaser.Image
	level_complete: Phaser.Image
	target: number = 1000
	level: number = 1
	scoreTest: number = 0
	check: boolean = false
	bg: Phaser.Image
	bg1: Phaser.Image
	bg2: Phaser.Image
	bg3: Phaser.Image
	bg4: Phaser.Image
	bg5: Phaser.Sprite
	txt: Phaser.Text
	levelUp: Phaser.Image
	newPeice: number = 0
	check1: boolean = false
	countOfCat: number = 0
	shuffle: Phaser.Image
	block: Phaser.Image[] = []
	tween: Phaser.Tween




	constructor() {
		super()
	}



	create() {
		//////////////// target//////////////
		this.createTaget()

		////////////////////////////////////
		let by = 420
		let py = 1520
		let ty = 60
		let tdy = 0
		if (G.ratio > 1.5) {
			ty += 200
			by += 200
			py += 200
			tdy += 200
		}
		////////////////////// sound/////////////////////////
		this.sound_match = this.add.audio('sound_match', 1)
		this.sound_match_many = this.add.audio('sound_match_many', 1)
		this.sound_fade = this.add.audio('sound_fade', 1)
		this.sound_yeah = this.add.audio('sound_yeah', 1)
		this.sound_yeah1 = this.add.audio('sound_yeah1', 1)
		this.sound_clap = this.add.audio('sound_clap', 1)
		this.sound_over = this.add.audio('over', 1)
		

		//////////////////////////end sound///////////////////


		Vs.loaded.then(e => {

			this.vs = new Vs(this.game, 18, ty, { f: this.replay, ctx: this }, { f: () => { }, ctx: this }, this.scoreTest)
			//this.vs.y = this.game.world.centerY -(this.vs.height)

		})

		//let countOfCat = 0

		//let countOfCat = 0;
		switch (this.level) {
			case 1: {
				this.countOfCat = 4
				break;
			}
			case 2: case 3: {
				this.countOfCat = 5
				break
			}
			case 4: case 5: case 6: {
				this.countOfCat = 6
				break
			}
			case 7: case 8: case 9: {
				this.countOfCat = 7
				break
			}
			default: {
				this.newPeice = 7
				this.countOfCat = 7
				break;
			}
		}



		this.board = new Board(this.game, this.countOfCat, this.newPeice)
		if (this.level >= 2) {
			this.board.destroy()
			this.bg5 = this.game.add.sprite(0, 0, 'sprite_bg', Math.floor(Math.random() * 8))
			if (G.ratio > 1.9) {
				this.bg5.scale.setTo(0.8, 1.1)
			} else {
				this.bg5.scale.setTo(0.8, 0.87)

			}
		}
		if (G.ratio > 1.9) {
			setTimeout(() => {
				for (let i = 0; i < 10; i++) {
					for (let j = 0; j < 10; j++) {
						let block = this.game.add.image(0, 0, 'block')
						block.scale.set(0.25, 0.25)
						block.x = 103 * j + 30
						block.y = 103 * i + 1000
						this.block.push(block)
					}
				}
				this.peices = new peices(this.game, this.board)

			}, 1000)
		} else {
			setTimeout(() => {
				for (let i = 0; i < 10; i++) {
					for (let j = 0; j < 10; j++) {
						let block = this.game.add.image(0, 0, 'block')
						block.scale.set(0.25, 0.25)
						block.x = 103 * j + 30
						block.y = 103 * i + 800
						this.block.push(block)
					}
				}
				this.peices = new peices(this.game, this.board)

			}, 1000)
		}


		setTimeout(() => {
			this.peices.countScore = this.onMatch
			this.peices.context = this
			this.peices.soundMatch = this.soundMatch
			this.peices.context = this
			this.peices.onEndGame = this.boardDie
			this.peices.context = this
			this.peices.disableSkill = this.disableSkill
			this.peices.soundMatchEnd = this.soundMatchEnd
			this.peices.soundFade = this.soundFade
			this.peices.soundMatchDestroy = this.soundMatchStop
			this.peices.levelup = this.LevelUp
		}, 2200);
		////////////////////// changle ////////////////

		this.frame_target = this.game.add.image(0, 0, 'frame_target')
		if (G.ratio > 1.9) {
			this.frame_target.y = this.game.world.top + this.frame_target.height * 6
			console.log('xxx');

		} else {

			this.frame_target.y = this.game.world.top + this.frame_target.height * 5
			console.log('6,7,8');


		}


		this.frame_target.x = this.game.world.centerX - (this.frame_target.width / 2)
		this.frame_target.alpha = 0
		this.frame_target.scale.setTo(1, 1.5)
		setTimeout(() => {
			this.game.add.tween(this.frame_target).to({ y: this.frame_target.y + 100, alpha: 1 }, 1000, Phaser.Easing.Bounce.Out, true, 0, 0, false)
			setTimeout(() => {
				let style = { font: "65px Arial", fill: "#ffffff", align: "center" };
				//this.txt = this.add.bitmapText(0, 0, 'desyrel', 'Level:' + this.level, 70)
				this.txt = this.add.text(0, 0, 'level: ' + this.level, style)
				this.txt.stroke = "#de77ae";
				this.txt.strokeThickness = 16;
				//  Apply the shadow to the Stroke only
				this.txt.setShadow(2, 2, "#333333", 2, true, false);
				this.txt.x = this.game.world.centerX - this.txt.width / 2
				this.txt.y = this.frame_target.y + this.txt.height + 50
			}, 1200);
			this.skillShuffle()
		}, 2300);
		setTimeout(() => {
			let text = this.game.add.bitmapText(0, 0, 'score', '' + this.target, 20)
			text.x = this.game.world.centerX - text.width / 2
			text.y = this.frame_target.y + 40
		}, 3000);

		this.level_complete = this.game.add.image(0, 0, 'level_complete')
		this.level_complete.x = this.game.world.centerX - this.level_complete.width / 2
		this.level_complete.alpha = 0
		this.level_complete.scale.setTo(3, 3)


		//////////////////////////end ///////////////////
	}
	soundMatch(quantity: number) {
		for (let i = 0; i <= quantity; i++) {
			setTimeout(() => {
				if (quantity > 7) {
					this.sound_match_many.play()
				} else {
					this.sound_match.play()

				}
			}, 80 * i);
		}
	}
	LevelUp() {
		this.levelUp = this.add.image(0, 0, 'level_up')
		this.levelUp.scale.setTo(1.8, 1.8)
		this.levelUp.alpha = 0
		this.levelUp.x = this.game.world.centerX - this.levelUp.width / 2
		this.levelUp.y = this.game.world.bottom + this.levelUp.height
		this.game.add.tween(this.levelUp).to({ x: this.game.world.centerX - this.levelUp.width / 2, y: this.game.world.centerY - this.levelUp.height / 2, alpha: 1 }, 2000, Phaser.Easing.Bounce.Out, true, 0, 0, false).start()
		this.sound_clap.play()
	}
	soundMatchStop() {
		this.sound_match.destroy()
		this.sound_match_many.destroy()
	}
	soundMatchEnd() {
		this.sound_match.play()
	}
	soundFade() {
		this.sound_match_many.play()
	}
	skillShuffle() {
		this.shuffle = this.game.add.image(0, 0, 'shuffle')
		this.shuffle.x = this.frame_target.x + this.shuffle.width * 2 + 200
		this.shuffle.y = this.frame_target.y + 280
		this.shuffle.anchor.set(0.5, 0.5)
		var style = { font: "bold 50px Arial", fill: "#FF0000", boundsAlignH: "center", boundsAlignV: "middle" };
		let quantitySkillTxt = this.game.add.text(this.shuffle.x - 60, this.shuffle.y - 60, '3', style)
		this.shuffle.inputEnabled = true
		console.log('txt: ', this.peices.txt)
		this.shuffle.events.onInputDown.add(() => {
			this.game.add.tween(this.shuffle.scale).to({ x: 1.1, y: 1.1 }, 200, Phaser.Easing.Linear.None, true, 0, 0, true).start()
			console.log('board: ', this.board)
			for (let i = 0; i < 10; i++) {
				for (let j = 0; j < 10; j++) {
					if (this.peices.peice[i * 10 + j].peiceShape.alive) {
						this.board.arr[i][j] = Math.floor(Math.random() * this.countOfCat + this.newPeice)
					}
					else this.board.arr[i][j] = -1
				}
			}
			console.log('peices truoc: ', this.peices)
			for (let i = 0; i < this.peices.peice.length; i++) {
				this.peices.peice[i].Destroy()
			}

			console.log('board: ', this.board, ' board of peices: ', this.peices.board)

			this.peices = new peices(this.game, this.board)

			console.log('peices sau: ', this.peices, ' board of peices: ', this.peices.board)
			this.peices.countScore = this.onMatch
			this.peices.context = this
			this.peices.soundMatch = this.soundMatch
			this.peices.context = this
			this.peices.onEndGame = this.boardDie
			this.peices.context = this
			this.peices.soundMatchEnd = this.soundMatchEnd
			this.peices.soundFade = this.soundFade
			this.peices.soundMatchDestroy = this.soundMatchStop
			this.peices.levelup = this.LevelUp
			this.peices.disableSkill = this.disableSkill
			this.peices.context = this



		})

	}




	replay() {
		if (this.scoreTest != 0) {
			this.check1 = true
		} else {
			this.check1 = false
		}
		if (this.check1 == true) {
			this.scoreTest = 0
			this.level = 1
			this.target = 300
			this.state.start('main', true)
		}
	}
	onMatch(matchCount: number) {
		this.scoreTest += matchCount
		if (this.scoreTest > this.target) {
			if (this.check == false) {
				this.sound_yeah.play()
			}
			this.game.add.tween(this.level_complete.scale).to({ x: 1, y: 1 }, 600, 'Linear', true, 0, 0, false).start()
			this.tween = this.game.add.tween(this.level_complete).to({ y: this.frame_target.y - (this.frame_target.height * 2) + 40, alpha: 1 }, 2000, Phaser.Easing.Bounce.Out, true, 0, 0, false).start()
			this.tween.onComplete.addOnce(e => {
				this.game.add.tween(this.level_complete).to({ y: this.level_complete.y + 10 }, 1000, Phaser.Easing.Linear.None, true, 0, 100, true).start()

			})

			this.check = true
		}

		this.vs.increateScore(matchCount)
	}
	countScore(score: number) {
		this.scoreNumber += score
		this.scoreGet = score

	}
	boardDie(duration: number) {

		if (this.scoreTest >= this.target) {
			this.level++
			this.LevelUp()
			setTimeout(() => {
				this.destroySound()
				this.game.state.start('main', true, false)
			}, duration + 2700)
		}
		else {
			this.vs.disableInput()
			let score = this.vs.getPlayerScore()
			this.scoreTest = 0
			if (score > G.data.score) {
				setTimeout(() => {
					this.openNewRecord()
				}, 1500)
				G.data.score = score
				G.data.commit()
			}
			else {
				this.sound_over.play()
				this.startGameOver(1500)

			}
			this.sound_yeah1.play()
			setTimeout(() => {
				this.sound_clap.play()
			}, 200);
			this.target = 1
			this.level = 1
			this.newPeice = 0
		}

	}

	startGameOver(after: number) {
		setTimeout(() => { this.game.state.start('GameOver', true, false, [this.vs.getPlayerScore()]) }, after)
	}
	openNewRecord() {
		this.greet = new Greeting(this.game, 545, 900)
		this.greet.finishClose = { f: this.startGameOver, ctx: this }
		this.greet.startAnimation()
	}
	// desTroyEvens(){
	// 	this.desTroyEvens()
	// }
	destroySound() {
		this.soundMatchStop()
		this.sound.stopAll()
		this.txt.destroy(true)
		this.sound_clap.destroy(true)
		this.sound_fade.destroy(true)
		this.sound_match.destroy(true)
		this.sound_match_many.destroy(true)
		this.sound_yeah.destroy(true)
		this.sound_yeah1.destroy(true)
		this.board.destroy(true)
		this.frame_target.destroy(true)
		this.level_complete.destroy(true)
		this.vs.destroy(true)
		this.peices.events.destroy()
		this.peices.destroyPhase = true
		this.levelUp.destroy(true)
		for (let i = 0; i < this.block.length; i++) {
			this.block[i].destroy()
		}
		if (this.level > 2) {
			this.bg5.destroy(true)
		}


	}
	disableSkill() {
		this.shuffle.inputEnabled = false
		console.log('end roi ne')

	}

	update() {
		let scoreUpdate = 10
		if (this.oldScoreNumber < this.scoreNumber) {
			this.oldScoreNumber += scoreUpdate
			this.score.text = '' + Math.floor(this.oldScoreNumber)
		}

	}
	createTaget() {
		switch (this.level) {
			case 1: {
				this.target = 300
				break

			}
			case 2: {
				this.destroySound()
				this.check = false
				this.target += 300
				break;
			}
			case 3: {
				this.destroySound()
				this.check = false
				this.target += 300
				break;
			}
			case 4: {
				this.destroySound()
				this.check = false
				this.target += 400
				break;
			}
			case 5: {
				this.destroySound()
				this.check = false
				this.target += 400
				break;
			}
			case 6: {
				this.destroySound()
				this.check = false
				this.target += 500
				break;
			}
			case 7: {
				this.destroySound()
				this.check = false
				this.target += 600
				break;
			}
			case 8: {
				this.destroySound()
				this.check = false
				this.target += 700
				break;
			}
			case 9: {
				this.destroySound()
				this.check = false
				this.target += 800
				break;
			}
			case 10: {
				this.destroySound()
				this.check = false
				this.target += 900
				break;
			}

			default: {
				this.destroySound()
				this.check = false
				this.target += 1000
				break;
			}
		}
	}
}