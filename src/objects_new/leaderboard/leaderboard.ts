import {ScoreCounter} from './score_counter'
import {G} from '../../app'
import {PlayerInfo} from './player_info'

export class LeaderBoard extends Phaser.Group {
	static platform:string

	score: ScoreCounter
	nScore: number
	ldb: Phaser.Image
	constructor(game:Phaser.Game, x:number, y:number, score:number){
		super(game)
		game.add.existing(this)
		this.x = x
		this.y = y
		this.nScore = score
		this.render()
	}

	render(){
		this.score = new ScoreCounter(this.game, 540, -300, 'fenshu', '0', 60, 'center')
		this.score.increaseScore(this.nScore)

		this.ldb = new Phaser.Image(this.game, 540, 100, 'ldb')
		this.ldb.anchor.setTo(0.5, 0)
		this.ldb.scale.setTo(1.6, 1.6)
		this.ldb.scale.y = 0
		this.game.add.existing(this.ldb)
	}

	animation(direction:number): Promise<void>{
		return new Promise<void>( (resolve, reject) => {
			if (direction){			
				this.game.add.tween(this.score).to({y: 450}, 200, Phaser.Easing.Quadratic.Out, true, 0, 0, false)
				this.game.add.tween(this.ldb).to({y: 600}, 200, Phaser.Easing.Quadratic.Out, true, 0, 0, false)
				.onComplete.add( () => {
					this.game.add.tween(this.ldb.scale).to({y:1.6}, 200, 'Linear', true, 0, 0, false)
					.onComplete.add( () => {
						resolve()
					}, this)
				}, this)	
			}		
			else {
				this.game.add.tween(this.ldb.scale).to({y:0}, 200, 'Linear', true, 0, 0, false)
				.onComplete.add( () => {
					this.game.add.tween(this.score).to({y: -300}, 200, Phaser.Easing.Quadratic.Out, true, 0, 0, false)
					this.game.add.tween(this.ldb).to({y: 100}, 200, Phaser.Easing.Quadratic.Out, true, 0, 0, false)
					.onComplete.add( () => {
						resolve()
					}, this)
				}, this)
			}
		})
	}

	loadLeaderBoard(){
		let renderPlayer:Function = (entries, index) => {
			if (index > 2)
				return
			let player = new PlayerInfo(this, -320 + index*320, 920)
			player.render(entries[index]).then(e => renderPlayer(entries, ++index))
		}

		let loader = this.game.load

		let loadPhoto:Function = (entries:FBInstant.LeaderboardEntry[]) : Promise<void> => {
			return new Promise((resolve, reject) => {
				for (let i = 0; i < entries.length; i++){
					loader.image(entries[i].getPlayer().getID(), entries[i].getPlayer().getPhoto())
					loader.start()
					loader.onLoadComplete.add( () => {resolve()})
					loader.onFileError.add( () => {reject('load photo error')})
				}
			})
		}

		G.ldb.getEntriesAsync(3, 0).then(entries => {
			loadPhoto(entries).then(e => renderPlayer(entries, 0)).catch(e => console.log(e))
		})
	}

	static loadAsset(loader:Phaser.State, path:string){
		LeaderBoard.platform = G.platform
		loader.load.image('ldb', path + '/ldb.png')
		loader.load.image('plf', path + '/plf.png')
		loader.load.image('photoFrame', path + '/photoframe.png')
	}
}