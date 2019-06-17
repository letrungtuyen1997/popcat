import {G} from '../../app'

export class PlayerInfo extends Phaser.Image {
	constructor(parent:any, x:number, y:number){
		super(parent.game, x, y, 'plf')
		this.anchor.setTo(.5,.5)
		this.scale.setTo(-1.6,1.6)
		parent.addChild(this)
	}

	render(entry:FBInstant.LeaderboardEntry): Promise<void>{
		return new Promise<void> ((resolve, reject) => {
			if (entry){
				this.game.add.tween(this.scale).to({x:1.6}, 300, "Linear", true, 0, 0, false)
				.onComplete.add(() => {
					let frame = new Phaser.Image(this.game, 0, -40, 'photoFrame')
					frame.anchor.setTo(.5,.5)
					this.addChild(frame)

					let photo = new Phaser.Image(this.game, 0, -40, entry.getPlayer().getID())
					photo.anchor.setTo(.5,.5)
					photo.scale.setTo(.255,.255)
					this.addChild(photo)

					let name = new Phaser.Text(this.game, 0, 40, entry.getPlayer().getName(), { font: "25px Arial", fill: "#eeeeee"})
					name.anchor.setTo(.5,.5)
					this.addChild(name)

					let sc:number = entry.getScore()
					if (FBInstant.player.getID() === entry.getPlayer().getID()){
						sc = G.data.score
					}
					let score = new Phaser.BitmapText(this.game, 0, 90, 'fenshu', '' + sc, 10)
					score.anchor.setTo(.5,.5)
					this.addChild(score)			

					let rank = new Phaser.BitmapText(this.game, 0, -110, 'fenshu', '' + entry.getRank(), 12)
					rank.anchor.setTo(.5,.5)
					this.addChild(rank)
					resolve()
				}, this)
			}			
		})
	}
}