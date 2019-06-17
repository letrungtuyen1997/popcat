import {PhotoFrame} from './frame'
import {ScorePanel} from './panel'
import {Vs} from './vs'
class Base extends Phaser.Group {
	_scale
	photoFrame:PhotoFrame
	nameTxt:Phaser.Text
	scorePanel:ScorePanel
	sliceX: number


	score:number = 0
	photo:string = 'coco'
	constructor(game:Phaser.Game, x:number, y:number, scale:number, name:string, score:number,photo:string, parent:any){
		super(game)
		this.x = x
		this.y = y
		this.game.add.existing(this)
		this.score = score
		this.name = name
		this.photo = photo
		this._scale = scale
		this.render()
		parent.addChild(this)
		this.addChild(this.nameTxt)
		this.addChild(this.photoFrame)
		this.addChild(this.scorePanel)
		setTimeout( () => {this.appear()}, 200)
	}

	render(){}

	appear() {
		this.game.add.tween(this).to({x:this.sliceX}, 400, Phaser.Easing.Back.Out, true, 0, 0, false)
		.onComplete.add( () => {
			this.game.add.tween(this.scorePanel.scale).to({x:1}, 400, Phaser.Easing.Back.Out, true, 0, 0, false)
			this.game.add.tween(this.nameTxt.scale).to({x:1}, 400, Phaser.Easing.Back.Out, true, 0, 0, false)
			.onComplete.add ( () => {
				this.scorePanel.scoreEffect()
			})
		}, this)
	}

	increseScore(delta:number) : Promise<any> {
		this.score += delta
		return this.scorePanel.increateScore(delta)
	}

	changePlayer(photo_key:string){
		this.photoFrame.replaceImage(Vs.ci.photo, () => {
			this.nameTxt.setText(Vs.ci.name)
			this.increseScore(Vs.ci.score - this.score)			
		}, this)
	}

	getScore() : number {
		return this.score
	}
}

export class Player extends Base {
	constructor(game:Phaser.Game, x:number, y:number, scale:number, name:string, score:number, photo:string, parent:any){
		super(game, x, y, scale, name, score, photo, parent)
	}

	render(){
		this.nameTxt = new Phaser.Text(this.game, 54, -28, this.name, {font: "30px Arial", fill: "#ffffff", align: "left"})
		this.nameTxt.anchor.setTo(0, 0.5)
		this.nameTxt.scale.setTo(0, 1)
		this.scorePanel = new ScorePanel(this.game, 54, 20, 'p_score', this.score, 'left')
		this.scorePanel.scale.setTo(0, 1)
		this.photoFrame = new PhotoFrame(this.game, 0, 0, 'p_frame', this.photo, Vs.pi.scale)
		this.sliceX = 84
	}
}

export class Competitor extends Base {
	constructor(game:Phaser.Game, x:number, y:number, scale:number, name:string, score:number, photo:string, parent:any){
		super(game, x, y, scale, name, score, photo, parent)
	}

	render(){
		this.nameTxt = new Phaser.Text(this.game, -54, -28, this.name, {font: "30px Arial", fill: "#ffffff", align: "right"})
		this.nameTxt.anchor.setTo(1, 0.5)
		this.nameTxt.scale.setTo(0, 1)
		this.scorePanel = new ScorePanel(this.game, -54, 20, 'f_score', this.score, 'right')
		this.scorePanel.scale.setTo(0, 1)
		this.photoFrame = new PhotoFrame(this.game, 0, 0, 'f_frame', this.photo, Vs.ci.scale)
		this.sliceX = 566
	}
}