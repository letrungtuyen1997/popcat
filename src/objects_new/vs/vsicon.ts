export class VsIcon extends Phaser.Image {
	koIcon: Phaser.Image
	sndKo: Phaser.Sound
	constructor(x:number, y:number, parent:any, afterEffect:Function, ctx:any){
		super(parent.game, x, y, 'vs')

		this.anchor.setTo(0.5,0.5)
		parent.addChild(this)

		this.koIcon = new Phaser.Image(this.game, 0, 0, 'ko')
		this.koIcon.anchor.setTo(0.5, 0.5)
		this.sndKo = this.game.add.sound('sndKo')
		this.addChild(this.koIcon)
		this.VsEffect(afterEffect, ctx)
	}

	VsEffect(afterEffect:Function, ctx:any){
		this.koIcon.alpha = 0
		this.alpha = 0
		this.scale.setTo(2,2)
		this.game.add.tween(this.scale).to({x:1, y:1}, 200, 'Linear', true, 0, 0, false)
		this.game.add.tween(this).to({alpha:1}, 200, 'Linear', true, 0, 0, false)
		.onComplete.add(() =>{
			if (afterEffect){
				afterEffect.apply(ctx)
			}
		}, this)
	}

	KOEffect(afterEffect:Function, ctx:any){
		this.sndKo.play()
		this.koIcon.alpha = 0
		this.koIcon.scale.setTo(2,2)
		this.game.add.tween(this.koIcon.scale).to({x:1, y:1}, 200, 'Linear', true, 0, 0, false)
		this.game.add.tween(this.koIcon).to({alpha:1}, 200, 'Linear', true, 0, 0, false)
		.onComplete.add(() =>{
			setTimeout(() => {this.VsEffect(null, null)}, 1000)
			if (afterEffect)
				afterEffect.apply(ctx)
		}, this)
	}
}