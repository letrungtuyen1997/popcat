import {WaveCircle} from './wave_circle'
import {Wings} from './wings'

interface Listener {
	f:Function
	ctx:any
}

export class Greeting extends Phaser.Image{
	static assetPath:string

	//zoomFinish:Promise<any>
	//cupZoomFinish:Promise<any>

	cup:Phaser.Image
	wave:WaveCircle
	wings:Wings
	recordTxt:Phaser.Image
	banner:Phaser.Image
	closeBtn:Phaser.Image
	finishAnnimation: Promise<any>
	finishClose: Listener
	sndRecord:Phaser.Sound
	sndClick:Phaser.Sound

	constructor(game:Phaser.Game, x:number, y:number){
		super(game, x, y, 'greet')
		this.sndRecord = this.game.add.audio('sndRecord')
		this.sndClick = this.game.add.audio('greetClick')
		this.render()
	}

	render() {
		this.game.add.existing(this)
		this.anchor.setTo(0.5,0.5)
		this.scale.setTo(0,0)

		this.closeBtn = <Phaser.Image>this.addChild(new Phaser.Image(this.game, 250, -360, 'close'))
		this.closeBtn.anchor.setTo(0.5, 0.5)
		this.closeBtn.inputEnabled = true
		this.closeBtn.events.onInputDown.add(() => {
			this.close()
		}, this)

		this.wave = new WaveCircle(this, 0, 50)

		this.wings = new Wings(this, 0, 50)
		this.cup = <Phaser.Image>this.addChild(new Phaser.Image(this.game, 0, 150, 'cup'))
		this.cup.anchor.setTo(0.5, 0.5)
		this.cup.scale.setTo(0,0)

		this.recordTxt = <Phaser.Image>this.addChild(new Phaser.Image(this.game, 0, -150, 'record'))
		this.recordTxt.anchor.setTo(0.5, 0.5)
		this.recordTxt.scale.setTo(0,0)

		this.banner = <Phaser.Image>this.addChild(new Phaser.Image(this.game, 0, -280, 'banner'))
		this.banner.anchor.setTo(0.5, 0.5)
		this.banner.scale.setTo(0,0)

	}

	startAnimation(){
		this.zoom()
		.then(e => this.cupZoom())
		.then(e => {
			this.sndRecord.play()
			this.finishAnnimation = this.wave.animation()
			this.wings.animation()
		})
		.then(e => {
			this.textZoom()
			this.bannerZoom()
		})
	}

	zoom() : Promise<any> {
		return new Promise<any>((resolve, reject) => {
			this.game.add.tween(this.scale).to({x:1.4, y:1.4}, 200, Phaser.Easing.Linear.None, true, 0, 0, false)
			.onComplete.add( () => {
				resolve('frame zoom finish')
			}, this)
		})
	}

	cupZoom() : Promise<any> {
		return new Promise<any>((resolve, reject) => {
			this.game.add.tween(this.cup.scale).to({x:1.2, y:1.2}, 200, Phaser.Easing.Linear.None, true, 0, 0, false)
			.onComplete.add( () => {
				resolve('cup zoom finish')
			}, this)
		})

	}

	textZoom() : Promise<any> {
		return new Promise<any>( (resolve, reject) => {
			this.game.add.tween(this.recordTxt.scale).to({x:1.5, y:1.5}, 200, Phaser.Easing.Linear.None, true, 0, 0, false)
			.onComplete.add( () => {
				resolve('text zoom finish')
			}, this)

		})
	}

	bannerZoom() : Promise<any>{
		return new Promise<any>( (resolve, reject) => {
			this.game.add.tween(this.banner.scale).to({x:1, y:1}, 400, Phaser.Easing.Linear.None, true, 0, 0, false)
			.onComplete.add( () => {
				resolve('text zoom finish')
			}, this)

		})
	}

	close() : Promise<any> {
		return new Promise<any> ( (resolve, reject) => {
			this.sndClick.play()
			this.finishAnnimation.then(e => {
				this.wings.close().then(e => {
					this.game.add.tween(this.scale).to({x:0, y:0}, 300, Phaser.Easing.Quadratic.InOut, true, 0, 0, false)
					.onComplete.add( () => {
						this.destroy(true)
						this.finishClose.f.apply(this.finishClose.ctx, [200])
						resolve('finish closing')
					}, this)
				})
			})
		})
	}

	static loadAsset(loader:Phaser.State, path:string){
		loader.load.image('greet', path + '/greet.png')
		loader.load.image('cup', path + '/cup.png')
		loader.load.image('wave', path + '/wave.png')
		loader.load.image('wing', path + '/wing.png')
		loader.load.image('record', path + '/record.png')
		loader.load.image('banner', path + '/banner.png')
		loader.load.image('close', path + '/close.png')
		loader.load.audio('sndRecord', path + '/newRecord.mp3')
		loader.load.audio('greetClick', path + '/greet_btn.mp3')
	}
}