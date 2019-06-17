import {ScoreCounter} from './score_counter'
export class ScorePanel extends Phaser.Image {
	scoreTxt:ScoreCounter
	score:number
	constructor(game:Phaser.Game, x:number, y:number, key:string, score:number, align:string){
		super(game, x, y, key)
		if (align === 'left')
			this.anchor.setTo(0, 0.5)
		else
			this.anchor.setTo(1, 0.5)
		this.renderScore(score)

	}

	renderScore(score:number){
		let _x = (this.anchor.x === 0)? 60 : -60
		this.scoreTxt = new ScoreCounter(this.game, _x, 0, 'fenshu', '' + score, 12, 'center')
		this.scoreTxt.anchor.setTo(0.5,0.5)
		this.scoreTxt.scale.y = 0
		this.addChild(this.scoreTxt)
	}

	increateScore(delta:number) : Promise<any> {
		return this.scoreTxt.increaseScore(delta)
	}

	scoreEffect(){
		this.game.add.tween(this.scoreTxt.scale).to({y:1}, 200, 'Linear', true, 0, 0, false)
	}
}