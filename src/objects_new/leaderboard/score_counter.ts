export class ScoreCounter extends Phaser.BitmapText {
	tween:Phaser.Tween
	timer:Phaser.Timer
	count:number = 0
	sndScore:Phaser.Sound

	constructor(game:Phaser.Game, x:number, y:number, key:string, text:string, size:number, align:string){ //time in second
		super(game, x, y, key, text, size, align)
		game.add.existing(this)
		this.anchor.setTo(0.5,0.5)
		this.tween = new Phaser.Tween(this.scale, game, this.game.tweens)
    	.to({x:1.2, y:1.2}, 500, "Linear", false, 0,0,true)
		this.timer = new Phaser.Timer(game, false)
		game.time.add(this.timer)
		this.anchor.setTo(0.5, 0.5)
	//	this.sndScore = game.add.audio('sndScore')
	//	this.sndScore.allowMultiple = true
	}

	increaseScore(delta:number){
		this.count = parseInt(this.text)
		this.tween.start()
		this.timer.repeat(50/delta, delta, this.onTick, this)
		this.timer.start()
	}

	onTick(){
		//this.sndScore.play()
		this.text = '' + (++this.count)
	}
}