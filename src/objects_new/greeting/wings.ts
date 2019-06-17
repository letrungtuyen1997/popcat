export class Wings extends Phaser.Group {
	_left: Phaser.Image
	_right: Phaser.Image
	constructor(parent:any, x: number, y: number){
		super(parent.game)
		parent.addChild(this)
		this.x = x
		this.y = y
		this.render()
	}

	render(){
		this._left = new Phaser.Image(this.game, -90, 0, 'wing')
		this._left.anchor.setTo(0, 0)
		this._left.scale.x = -1

		this._right = new Phaser.Image(this.game, 90, 0, 'wing')
		this._right.anchor.setTo(0, 0)

		this.addChild(this._left)
		this.addChild(this._right)
		this.alpha = 0
	}

	animation() : Promise<any> {
		this.alpha = 1
		return new Promise<any> ( (resolve, reject) => {
			this.game.add.tween(this._left).to({angle: 90}, 300, 'Linear', true, 0, 0, false)
			this.game.add.tween(this._right).to({angle: -90}, 300, 'Linear', true, 0, 0, false)
			.onComplete.add( () => {
				resolve('wing animation complete')
			})
		})
	}

	close() : Promise<any> {
		return new Promise<any> ( (resolve, reject) => {
			this.game.add.tween(this).to({alpha: 0}, 300, 'Linear', true, 0, 0, false)
			this.game.add.tween(this._left).to({angle: 0}, 300, 'Linear', true, 0, 0, false)
			this.game.add.tween(this._right).to({angle: 0}, 300, 'Linear', true, 0, 0, false)
			.onComplete.add( () => {
				resolve('wing animation complete')
			})
		})
	}
}