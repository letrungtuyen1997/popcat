import {Vs} from './vs'
export class PhotoFrame extends Phaser.Image{
	playerPhoto:Phaser.Image
	photoUrl:string
	loader:Phaser.Loader
	photoKey:string
	photoScale: number
//	sndAppear: Phaser.Sound
	constructor(game:Phaser.Game, x:number, y:number, frame_key:string, photo_key:string, photoScale: number){
		super(game, x, y, frame_key)
		this.anchor.setTo(0.5,0.5)
		this.loader = new Phaser.Loader(this.game)
		this.photoKey = photo_key //Math.random().toString(36).substring(7)
		this.photoScale = photoScale
	//	this.sndAppear = this.game.add.audio('sndAppear')
		this.renderPhoto()
	}

	renderPhoto(){
		this.playerPhoto = new Phaser.Image(this.game, 0, 0, this.photoKey)
		this.playerPhoto.x -= 38
		this.playerPhoto.y -= 38
		this.playerPhoto.scale.setTo(this.photoScale, this.photoScale)
		this.addChild(this.playerPhoto)
	}

	replaceImage(photo_key:string, afterEffect:Function, ctx:any){
		let ox = this.x
		let _x = this.x += 400
		this.game.add.tween(this).to({x:_x}, 500, Phaser.Easing.Back.In, true, 0, 0, false)
		.onComplete.add( () => {
			this.playerPhoto.loadTexture(photo_key)
			this.photoKey = photo_key
			this.angle = -5
			this.game.add.tween(this).to({x:ox}, 500, Phaser.Easing.Back.InOut, true, 0, 0, false)
			.onComplete.add( () => {
				this.game.add.tween(this).to({angle:0}, 100, Phaser.Easing.Back.InOut, true, 0, 0 , false)
				.onComplete.add( () => {
				//	this.sndAppear.play()
					this.game.add.tween(this.scale).to({x:1.2, y:1.2}, 280, Phaser.Easing.Back.InOut, true, 0, 0, true)
					.onComplete.add( () => {
						if (afterEffect)
							afterEffect.apply(ctx)
					})
				})
			})
		},)
	}
}