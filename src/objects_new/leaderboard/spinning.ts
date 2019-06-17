export class SpinCircle extends Phaser.Graphics {
	spining:boolean = true
	constructor(game:Phaser.Game, x, y){
		super(game, x, y)
		this.lineStyle(8, 0xFFCC00)
		this.beginFill(0xFFCC00)
		this.arc(0,0,50, Phaser.Math.degToRad(270), Phaser.Math.degToRad(270), true)
		game.add.existing(this)
	}

	update(){
		if (this.spining){
			this.rotation += 0.1
			this.arc(0,0,50, Phaser.Math.degToRad(270), Phaser.Math.degToRad(270), true)
		}
	}
}