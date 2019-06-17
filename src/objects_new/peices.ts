import { Board } from './board'
import { Peice } from './peice'
import { ScoreCounter } from './ScoreCounter'
import { BitmapText, Tween } from 'phaser-ce';
import { G } from '../app'

export class peices extends Phaser.Sprite {
	public board: Board
	public txt: Phaser.BitmapText
	

	game: Phaser.Game
	peice: Peice[] = []
	match: Peice[] = []
	matchEnd: Peice[] = []
	peicesEnd: Peice[] = []
	peice_hint1: Phaser.Sprite[] = []
	peice_hint2: Phaser.Image[] = []
	listHead: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	x: number
	y: number
	context: any
	disableSkill: Function
	countScore: Function
	soundMatch: Function
	soundMatchEnd: Function
	soundFade: Function
	soundMatchDestroy: Function
	score: number
	sound_detroy: Phaser.Sound
	flagClick: number = 0
	onEndGame: Function
	tween: any
	levelup: Function
	checkShuffle:boolean = false
	hammer: Phaser.Image
	skill: boolean = false

	constructor(game: Phaser.Game, board: Board) {
		super(game, 2, 3)
		//console.log('board dau: ', this.board)
		this.board = board
		//.log('board sau: ', this.board)

		this.game = game
		this.render(this.game);

	}

	render(game: Phaser.Game) {
		setTimeout(() => {
			this.hammer = this.game.add.image(0, 0, 'hammer')
			this.hammer.x = this.game.world.centerX + this.hammer.width +70
			if(G.ratio>1.9){
				this.hammer.y = this.game.world.top + this.hammer.width * 3 + 140
			}else{
				this.hammer.y = this.game.world.top + this.hammer.width * 3 +60
			}
			var style = { font: "bold 50px Arial", fill: "#FF0000", boundsAlignH: "center", boundsAlignV: "middle" };
			let quantitySkillTxt = this.game.add.text(this.hammer.x-60, this.hammer.y-60, '3', style)
			this.hammer.scale.setTo(0.8, 0.8)
			this.hammer.anchor.set(0.5,0.5)
			this.hammer.inputEnabled = true
			this.hammer.events.onInputDown.add(b => {
				this.game.add.tween(this.hammer.scale).to({ x: 1, y: 1 }, 200, Phaser.Easing.Linear.None, true, 0, 0, true).start()
				console.log('destroy one cat');
				this.skill = true
			})
		}, 1400);
		for (let i = 0; i < 10; i++) {
			for (let j = 0; j < 10; j++) {
				let peice1 = new Peice(game, j, i, this.board.getValueArr(i, j))
				//this.peice[i * 10 + j] = peice1
				peice1.onclick = this.onclick
				peice1.context = this
				this.peice.push(peice1)
			}
		}
		//start render board with effect
		let duration = 450
		for (let j = 9; j >= 0; j--) {

			for (let i = 9; i >= 0; i--) {

				let shape = this.peice[i * 10 + j].peiceShape
				let dx = i * 10 + j
				if (dx == 0) {
					dx = 110 / 100
				}
				shape.scale.setTo(0.3,0.3)
				setTimeout(() => {
					let tween = game.add.tween(shape.scale).to({x:1,y:1},500,Phaser.Easing.Sinusoidal.InOut,true,i*50,0,false).start()
					//let tween = game.add.tween(shape).to({ x: 100 * this.peice[i * 10 + j].y + 50, y: 100 * this.peice[i * 10 + j].x + 900 }, duration).start()
					duration += 10
					tween.onComplete.add(() => {
						tween.stop()
					})
				}, 100 / dx)


			}


		}
		//this.board.arr.splice(0, this.board.arr.length)
		//end render board with effect
	}
	onclick(x: number, y: number) {
		this.x = x
		this.y = y
		console.log('asdasd',x,y);
		if(this.skill==true){
			this.match.splice(0, this.match.length)
			this.checkMatch(this.x, this.y, this.getColorOfPeice(this.x, this.y), this.match)
			if (this.skill == true && this.match.length == 1) {
				let hammer = this.game.add.image(this.peice[this.x * 10 + this.y].peiceShape.x, this.peice[this.x * 10 + this.y].peiceShape.y, 'hammer')
				hammer.x = hammer.x + hammer.width + 20
				hammer.y = hammer.y + hammer.height / 2
				hammer.anchor.setTo(1, 1)
				let tween = this.game.add.tween(hammer).to({ angle: -35 }, 200, Phaser.Easing.Linear.None, true, 0, 0, true).start()
				tween.onComplete.add(e => {
					hammer.destroy()
					this.match.push(this.peice[this.x * 10 + this.y])
				})
				this.flagClick--
			}
		}
		

		//start ====================
		this.flagClick++

		if (this.flagClick % 2 == 0) {
			if (!this.checkElementOfMatch(x, y)) {
				for (let i = 0; i < this.match.length; i++) {
					this.match[i].peiceShape.tint = 0xffffff
				}
				this.match.splice(0, this.match.length)
				this.flagClick--
			}
			for (let i = 0; i < this.peice_hint1.length; i++) {
				this.peice_hint1[i].destroy()
			}
		
			this.peice_hint1.splice(0, this.peice_hint1.length)
		}



		if (this.flagClick % 2 == 1) {
			this.match.splice(0, this.match.length)
			this.checkMatch(this.x, this.y, this.getColorOfPeice(this.x, this.y), this.match)

			if (this.match.length >= 2) {
				for (let i = 0; i < this.match.length; i++) {
					//	let temp = new Peice(this.game, this.match[i].y, this.match[i].x,this.getColorOfPeice(this.x,this.y)).scale.setTo(2,2)
					//this.peice_hint.push(temp)
					//this.match[i].peiceShape.tint = 0xFEF889
					//this.match[i].peiceShape = temp 103*this.y + 30 , (103*this.x + 800
					if(G.ratio>1.9){
						let temp1 = this.game.add.sprite(this.match[i].y * 103 + 30, this.match[i].x * 103 + 1000, 'peices1', this.match[i].color)
						this.peice_hint1.push(temp1)
					}else{
						let temp1 = this.game.add.sprite(this.match[i].y * 103 + 30, this.match[i].x * 103 + 800, 'peices1', this.match[i].color)
						this.peice_hint1.push(temp1)
					}
				}

				return
			}
		}
		// end ====================

		console.log('match1: ', this.match)

		this.match.splice(0, this.match.length)
		this.checkMatch(this.x, this.y, this.getColorOfPeice(this.x, this.y), this.match)

		this.sortMatch1()
		this.sortMatch2()

		//console.log('match: ', this.match)

		if (this.match.length >= 2|| (this.match.length == 1 && this.skill == true)) {
			this.skill = false
			this.score = this.match.length * 1 * this.match.length
			console.log('this.countScore: ', this.countScore)
			this.countScore.apply(this.context, [this.score])
			for (let i = 0; i < this.match.length; i++) {
				if (this.match[i].x != 15) {
					this.peice[this.match[i].x * 10 + this.match[i].y].Destroy()
					let emitter = this.game.add.emitter(this.match[i].peiceShape.x, this.match[i].peiceShape.y)
					//let shape = this.game.add.sprite()
					emitter.makeParticles('peices', this.match[i].color)
					emitter.setScale(1, 0.1, 1, 0.1, 2000, Phaser.Easing.Quintic.Out);
					emitter.setAngle(180, 360, 0, 800)
					emitter.gravity.y = 350
					emitter.minParticleSpeed.setTo(-2000, -100);
					emitter.maxParticleSpeed.setTo(2000, 2000);
					emitter.start(false, 4000, 0, 5)
					setTimeout(() => {
						emitter.destroy()
					}, 500);


					var style = { font: "bold 50px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
					//	let tween =  this.game.add.text(this.match[i].peiceShape.x,this.match[i].peiceShape.y,'+10',style)
					let tween = this.game.add.bitmapText(this.match[i].peiceShape.x, this.match[i].peiceShape.y, 'desyrel', '+' + (this.score / this.match.length), 50)
					let temp = this.game.add.tween(tween.scale).to({ x: 1.2, y: 1.2 }, 200).start().onComplete.addOnce(b => {
						setTimeout(() => {
							let tween1 = this.game.add.tween(tween).to({ x: 220, y: 180 }, 1000).start().onComplete.addOnce(a => {
								this.game.add.tween(tween.scale).to({ x: 1.4, y: 1.4 }, 300).start().onComplete.addOnce(c => {
									setTimeout(() => {
										this.game.add.tween(tween).to({ alpha: 0 }, 10).start().onComplete.addOnce(e=>{
											this.checkShuffle =true
										})
					
									}, 100);
								})

							}, this)
						}, 300);

					}, this)
					

					//////////////////sound match////////////////////
					let a = this.match.length
					let b = this.soundMatch.apply(this.context, [a])

				}
			}








			for (let i = 0; i < this.match.length; i++) {
				this.moveRow(this.game, this.match[i].y, this.match[i].x, this.peice)
			}

			//start
			this.sortMatch3()

			for (let i = 0; i < this.match.length; i++) {
				if (this.checkEmptyCol(this.match[i].y, this.peice)) {
					this.moveCol(this.game, this.match[i].y, this.peice)
				}
			}
			//end
			//start checkEndGame
			if (!this.checkEndGame()) {
				this.disableSkill.apply(this.context)

				for (let i = 0; i < this.peice.length; i++) {
					if (this.peice[i].peiceShape.alive) {
						this.peicesEnd.push(this.peice[i])
						this.peice[i].peiceShape.tint = 0xB7B7B7

					}
				}
				if (this.peicesEnd.length == 0) {
					setTimeout(() => {
						this.onEndGame.apply(this.context, [2000])
					setTimeout(() => {
					this.soundMatchDestroy.apply(this.context)
					}, 2200);
					}, 1200);
					

				} else {
					let time = 0
					//let j = Math.floor(this.peicesEnd.length/2) + 1
					setTimeout(() => {
						let emitter

						for (let i = 0; i < this.peicesEnd.length; i++) {

							if (i <= this.peicesEnd.length / 2) {
								time = + i * 200;

								if (i != 0) {
									setTimeout(() => {
										emitter = this.game.add.emitter(this.peicesEnd[i].peiceShape.x, this.peicesEnd[i].peiceShape.y)
										emitter.makeParticles('peices', this.peicesEnd[i].color)
										emitter.setScale(1, 0.1, 1, 0.1, 3000, Phaser.Easing.Quintic.Out);
										emitter.setAngle(180, 360, 0, 800)
										emitter.minParticleSpeed.setTo(-2000, -100);
										emitter.maxParticleSpeed.setTo(2000, 2000);
										emitter.start(false, 1000, 1, 5, true)
										this.peicesEnd[i].Destroy()
										this.soundMatchEnd.apply(this.context)

									}, i * 200)

								}
								else {
									emitter = this.game.add.emitter(this.peicesEnd[i].peiceShape.x, this.peicesEnd[i].peiceShape.y)
									emitter.makeParticles('peices', this.peicesEnd[i].color)
									emitter.setScale(1, 0.1, 1, 0.1, 3000, Phaser.Easing.Quintic.Out);
									emitter.setAngle(180, 360, 0, 800)
									emitter.minParticleSpeed.setTo(-2000, -100);
									emitter.maxParticleSpeed.setTo(2000, 2000);
									emitter.start(false, 1000, 1, 5, true)
									this.peicesEnd[i].Destroy()

								}
							}
							else {
								setTimeout(() => {
									emitter = this.game.add.emitter(this.peicesEnd[i].peiceShape.x, this.peicesEnd[i].peiceShape.y)
									emitter.makeParticles('peices', this.peicesEnd[i].color)
									emitter.setScale(1, 0.1, 1, 0.1, 3000, Phaser.Easing.Quintic.Out);
									emitter.setAngle(180, 360, 0, 800)
									emitter.minParticleSpeed.setTo(-2000, -100);
									emitter.maxParticleSpeed.setTo(2000, 2000);
									emitter.start(false, 1000, 1, 5, true)
									this.peicesEnd[i].Destroy()
									this.soundFade.apply(this.context)

								}, time)

							}
						}
						setTimeout(() => {
							this.match.splice(0, this.match.length)
							this.matchEnd.splice(0, this.matchEnd.length)
							this.peicesEnd.splice(0, this.peicesEnd.length)
							this.peice.splice(0, this.peice.length)
							this.peice_hint1.splice(0, this.peice_hint1.length)
							console.log(emitter);

							emitter.destroy();
							this.soundMatchDestroy.apply(this.context)
							this.onEndGame.apply(this.context, [time])

						}, time + 1000)

					}, 1000)
				}


			}

			//end check Endgame


		}
	}
	//start =======================
	checkElementOfMatch(x: number, y: number) {
		for (let i = 0; i < this.match.length; i++) {
			if (this.peice[x * 10 + y] == this.match[i]) {
				return true
			}
		}
		return false
	}
	//end ========================

	//start
	moveColPerfect(game: Phaser.Game, i: number) {
		if (i == this.match.length)
			return
		if (this.checkEmptyCol(this.match[i].y, this.peice)) {
			this.moveCol(game, this.match[i].y, this.peice)
			setTimeout(() => {
				i = i + 1
				this.moveColPerfect(game, i)
			}, 1000)
		}
	}
	//end

	//start checkmatch
	checkMatch(x: number, y: number, color: number, match: Peice[]) {
		if (x < 0 || y < 0 || x > 9 || y > 9 || this.peice[x * 10 + y].peiceShape.alive == false) {
			return
		}

		if (this.peice[x * 10 + y].color == color && this.peice[x * 10 + y].peiceShape.alive != false) {
			for (let i = 0; i < match.length; i++) {
				if (match[i] == this.peice[x * 10 + y]) {
					return
				}
			}
			match.push(this.peice[x * 10 + y])
			this.checkMatch(x - 1, y, color, match)
			this.checkMatch(x, y - 1, color, match)
			this.checkMatch(x, y + 1, color, match)
			this.checkMatch(x + 1, y, color, match)
		}
	}
	//end check match

	getColorOfPeice(x: number, y: number) {
		return this.peice[x * 10 + y].getColor()
	}

	sortMatch1() {
		for (let i = 0; i < this.match.length - 1; i++) {
			for (let j = i + 1; j < this.match.length; j++) {
				if (this.match[i].x > this.match[j].x) {
					let temp = this.match[j]
					this.match[j] = this.match[i]
					this.match[i] = temp
				}
			}
		}
	}

	sortMatch2() {
		for (let i = 0; i < this.match.length - 1; i++) {
			for (let j = i + 1; j < this.match.length; j++) {
				if (this.match[i].y > this.match[j].y && this.match[i].x == this.match[j].x) {
					let temp = this.match[j]
					this.match[j] = this.match[i]
					this.match[i] = temp
				}
			}
		}
	}

	//start
	sortMatch3() {
		for (let i = 0; i < this.match.length - 1; i++) {
			for (let j = i + 1; j < this.match.length; j++) {
				if (this.match[i].y < this.match[j].y) {
					let temp = this.match[j]
					this.match[j] = this.match[i]
					this.match[i] = temp
				}
			}
		}
	}
	//end

	checkCountOfElement(x: number, y: number) {
		let dem: number = 0
		for (let i = 0; i < x; i++) {
			if (this.peice[i * 10 + y].color != -1) {
				dem++
			}
		}
		return dem
	}


	moveRow(game: Phaser.Game, col: number, position: number, peice: any) {

		let i, j, dem = 0
		i = position
		for (i; i >= 0; i--) {

			if (i == 0 || peice[(i - 1) * 10 + col].peiceShape.alive == false || peice[(i - 1) * 10 + col].peiceShape == undefined) {
				let peice_temp = new Peice(game, 15, 15, 5)
				peice[i * 10 + col] = peice_temp
				peice[i * 10 + col].Destroy()
				return
			}
			else {
				dem++

				peice[(i) * 10 + col] = peice[(i - 1) * 10 + col]
				peice[(i) * 10 + col].x++

				let shape = peice[(i - 1) * 10 + col].peiceShape
				shape.y = shape.y + 103
				//let tween1 = game.add.tween(shape).to({y: dy}, 300, 'Linear', true, 0, 0, false)
				let tween = game.add.tween(shape).to({ y: shape.y - 5 }, 300, Phaser.Easing.Bounce.Out, true, 0, 0, true)
			}
		}
	}

	moveCol(game: Phaser.Game, col: number, peice: any) {
		let flag = true
		for (let i = col; i < 9; i++) {
			for (let i1 = 0; i1 < 10; i1++) {
				if (this.peice[i1 * 10 + i + 1].peiceShape.alive != false) {
					flag = false
					break
				}
			}
			if (flag) {//flag = true, next col is destroyed
				for (let k = 0; k < 10; k++) {
					let temp = new Peice(game, 15, 15, 5)
					this.peice[k * 10 + i] = temp
					this.peice[k * 10 + i].Destroy()
				}
				return
			}
			//let dem = this.checkEmptyCol2()
			this.moveOneCol(game, i, peice)
			if (i == 8) {
				for (let j = 0; j < 10; j++) {
					let temp = new Peice(game, 15, 15, 5)
					this.peice[j * 10 + 9] = temp
					this.peice[j * 10 + 9].Destroy()
				}
			}
		}
		console.log('hoan thanh ')
	}

	moveOneCol(game: Phaser.Game, col: number, peice: any) {
		for (let i = 0; i < 10; i++) {

			peice[i * 10 + col] = peice[i * 10 + col + 1]
			peice[i * 10 + col].y = peice[i * 10 + col].y - 1
			peice[i * 10 + col + 1].peiceShape.x = peice[i * 10 + col + 1].peiceShape.x - 103

			let shape = peice[i * 10 + col + 1].peiceShape
			let tween = game.add.tween(shape).to({ x: shape.x + 5 }, 320, Phaser.Easing.Bounce.Out, true, 0, 0, true)





		}
	}

	checkEmptyCol(col: number, peice: any) {

		for (let i = 0; i < 10; i++) {
			if (peice[i * 10 + col].peiceShape.alive != false) {
				return false
			}
		}
		return true
	}


	checkEndGame() {
		for (let i = 0; i < 10; i++) {
			for (let j = 0; j < 10; j++) {
				if (this.peice[i * 10 + j].peiceShape.alive == false) {
					continue
				}
				this.checkMatch(i, j, this.peice[i * 10 + j].color, this.matchEnd)
				if (this.matchEnd.length >= 2) {
					this.matchEnd.splice(0, this.matchEnd.length)

					return true
				}
				this.matchEnd.splice(0, this.matchEnd.length)

			}
		}


		console.log('end game')
		return false
	}


}