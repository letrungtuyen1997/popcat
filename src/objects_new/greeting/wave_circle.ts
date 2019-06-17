export class WaveCircle extends Phaser.Group {
	w1 : Phaser.Image
	w2 : Phaser.Image
	w3 : Phaser.Image
	constructor(parent:any, x:number, y: number){
		super(parent.game)
		this.x = x
		this.y = y
		parent.addChild(this)
		this.render()
	}

	render(){
		this.scale.setTo(1.2,1.2)

		this.w1 = <Phaser.Image>(this.addChild(new Phaser.Image(this.game, 0, 0, 'wave')))
		this.w1.anchor.setTo(0.5,0.5)
		this.w1.scale.setTo(1.2,1.2)
		this.w1.alpha = 0

		this.w2 = <Phaser.Image>(this.addChild(new Phaser.Image(this.game, 0, 0, 'wave')))
		this.w2.anchor.setTo(0.5,0.5)
		this.w2.scale.setTo(1.2,1.2)
		this.w2.alpha = 0

		this.w3 = <Phaser.Image>(this.addChild(new Phaser.Image(this.game, 0, 0, 'wave')))
		this.w3.anchor.setTo(0.5,0.5)
		this.w3.scale.setTo(1.2,1.2)
		this.w3.alpha = 0
	}

	animation() : Promise<any>{
		return new Promise<any>((resolve, reject) => {
			this.wave(this.w1)
			setTimeout(() => this.wave(this.w2), 200)
			setTimeout(() => this.wave(this.w3), 400)
			setTimeout(() => resolve('wave complete'), 1000)
		})
	}

	wave(target:Phaser.Image) {
		target.alpha = 1
		return new Promise<any>((resolve, reject) => {
			this.game.add.tween(target.scale).to({x:4,y:4}, 600, 'Linear', true, 0, 0, false)
			this.game.add.tween(target).to({alpha:0}, 600, 'Linear', true, 0, 0, false)
		})
	}
}