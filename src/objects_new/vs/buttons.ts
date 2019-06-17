export interface Listener {
	f:Function,
	ctx:any
}

export class Button extends Phaser.Image {
	constructor(game:Phaser.Game, x:number, y:number, key:string, handler:Listener, parent:any){
		super(game, x, y, key)
		this.anchor.setTo(0.5,0.5)
		this.inputEnabled = true
		this.events.onInputDown.add(handler.f, handler.ctx)
		this.scale.setTo(0.8,0.8)
		parent.addChild(this)
		let ox = this.scale.x
		let oy = this.scale.y
		this.scale.setTo(0,0)
		this.game.add.tween(this.scale).to({x:ox, y:oy}, 200, 'Linear', true, 0, 0, false)
	}
}

export class ToggleButton extends Button {
	ss:string[] = ['mute', 'unmute']
	s:number = 0
	constructor(game:Phaser.Game, x:number, y:number, handler:Listener, parent:any){
		super(game, x, y, 'mute', handler, parent)
		this.s = (this.game.sound.mute) ? 1 : 0
		this.loadTexture(this.ss[this.s])
		this.events.onInputDown.add(() => {
			this.s = (!this.s) ? 1 : 0
			this.loadTexture(this.ss[this.s])
			this.game.sound.mute = (this.s) ? true : false
		}, this)
	}
}