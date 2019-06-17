import {Button, ToggleButton} from './buttons'
import {Player, Competitor} from './player'
import {VsIcon} from './vsicon'
import {G} from '../../app'
import { listener } from '../../models/model';

export interface PlayerInfo {
	name:string
	photo:string
	score:number
	scale: number
}

export interface Listener {
	f:Function,
	ctx:any
}

export class Vs extends Phaser.Group{
	replayHandler: Listener
	muteHandler: Listener

	static assetPath:string
	static bots:PlayerInfo[] = [
		{name:'Coco',score:1000,photo:'coco', scale: 1},
		{name:'Lupo',score:2000,photo:'jumbo', scale: 1},
		{name:'Nacho',score:3000,photo:'nacho', scale: 1},
		{name:'Blanco',score:4000,photo:'blanco', scale: 1},
		{name:'Trumpo',score:10000,photo:'trumpo', scale: 1}
	]
	static pi:PlayerInfo = {name:'You',score:0,photo:'coco', scale: 1}
	static ci:PlayerInfo = {name:'Coco',score:0,photo:'coco', scale: 1}
	static platform:string
	static game:Phaser.Game
	static loaded:Promise<string>

	p:Player
	c:Competitor
	i:VsIcon
	muteBtn: Button
	reloadBtn: Button

	constructor(game:Phaser.Game, x:number, y:number, replayHandler:Listener, muteHandler:Listener, scoreOfPlayer: number){
		super(game)
		this.scale.setTo(1.62,1.62)
		this.game.add.existing(this)
		this.replayHandler = replayHandler
		this.muteHandler = muteHandler


		let oy = this.y
		this.y -= 300
		this.game.add.tween(this).to({y:oy}, 400, Phaser.Easing.Back.Out, true, 0, 0, false)
		.onComplete.add(() => {
			this.render(scoreOfPlayer)
		}, this)
	}

	render(scoreOfPlayer:number){
		this.i = new VsIcon(320, 90, this, () => {
			this.p = new Player(this.game, 190, 90, 1, Vs.pi.name, scoreOfPlayer, Vs.pi.photo, this)
			this.c = new Competitor(this.game, 450, 90, 1, Vs.ci.name, Vs.ci.score, Vs.ci.photo, this)
			this.reloadBtn = new Button(this.game, this.x + 56, 200, 'replay', this.replayHandler, this)
			this.muteBtn = new ToggleButton(this.game, this.x + 135, 200, this.muteHandler, this)			
		}, this)
	}

	static loadAsset(loader:Phaser.State, path:string){
		Vs.assetPath = path
		Vs.platform = G.platform
		Vs.game = loader.game

		loader.load.image('mute', path + '/mute.png')
		loader.load.image('unmute', path + '/unmute.png')
		loader.load.image('replay', path + '/replay.png')
		loader.load.image('vs', path + '/vs.png')
		loader.load.image('ko', path + '/ko.png')
		loader.load.image('f_frame', path + '/f_frame.png')
		loader.load.image('p_frame', path + '/p_frame.png')
		loader.load.image('p_score', path + '/p_score.png')
		loader.load.image('f_score', path + '/f_score.png')
		loader.load.bitmapFont('fenshu', path + '/fenshu.png', path + '/fenshu.fnt')
		//loader.load.audio('sndScore', path + '/score.mp3')
		loader.load.audio('sndKo', path + '/ko.mp3')
		//loader.load.audio('sndAppear', path + '/appear.mp3')

		Vs.loadPlayer()
		let initialScore = G.data.score
		Vs.loaded = Vs.loadCompetitor(initialScore)
	}

	static loadPlayer(): Promise<string>{
		return new Promise<string>( (rs, rj) => {
			Vs.pi.name = (G.platform != 'local') ? FBInstant.player.getName() : 'You'
			Vs.pi.score = (G.platform != 'local') ? G.data.score : 0
			Vs.pi.photo = (G.platform != 'local') ? FBInstant.player.getID() : 'coco'
			Vs.pi.scale = (G.platform != 'local') ? 0.24 : 1
			let url = (Vs.platform === 'local') ? Vs.assetPath + '/coco.png' : FBInstant.player.getPhoto()
			let l = Vs.game.load.image(Vs.pi.photo, url)
			l.start()
			l.onLoadComplete.add(() => {
				rs('load player complete')
			})
		})
	}

	static async loadCompetitor(initialScore:number): Promise<string> {
		return new Promise<string>( (rs, rj) => {

			let fecth:Function = (es:FBInstant.LeaderboardEntry[]) => {
				let final = Vs.bots.length - 1
				let url = ''
				let key = ''
				if (es[0].getPlayer().getID() === FBInstant.player.getID()){ //you are the highest one
					Vs.ci.name = Vs.bots[final].name
					Vs.ci.score = Vs.bots[final].score
					url = Vs.assetPath + '/' + Vs.bots[final].photo + '.png'
					key = Vs.bots[final].photo
					Vs.ci.scale = 1
				}
				else {
					if (es){ // the very first one
						if (es.length == 0){
							Vs.ci.name = Vs.bots[final].name
							Vs.ci.score = Vs.bots[final].score
							url = Vs.assetPath + '/' + Vs.bots[final].photo + '.png'
							key = Vs.bots[final].photo
							Vs.ci.scale = 1
						}
					}
					for (let i = es.length - 1; i >=0; i--){
						if (es[i].getScore() > initialScore){
							Vs.ci.name = es[i].getPlayer().getName()
							Vs.ci.score = es[i].getScore()
							url = es[i].getPlayer().getPhoto()
							key = es[i].getPlayer().getID()
							Vs.ci.scale = 0.24
							break						
						}
					}

				}

				let l = Vs.game.load.image(key, url)
				if (l.cache.checkImageKey(key)){
					l.removeFile('image', key)
				}
				l.onLoadComplete.removeAll()
				l.onFileError.removeAll()
				l.onLoadComplete.add(() => {
					Vs.ci.photo = key
					rs('load competitor complete')
				}, this)
				l.onFileError.add(() => {
					Vs.ci.photo = 'coco'
					rs('load competitor failed')
				}, this)
				l.start()
			}

			if (Vs.platform === 'facebook'){
				G.ldb.getEntryCountAsync().then(count => {
					G.ldb.getPlayerEntryAsync().then( e => {
						G.ldb.getEntriesAsync(100, e.getRank() - 101).then(es => fecth(es))
					}).catch( e => { //you never play before
						G.ldb.getEntriesAsync(100, count - 100).then(es => fecth(es))
					})
				})
			}
			else{
				for (let i = 0; i < Vs.bots.length; i++){
					if (Vs.bots[i].score > initialScore){
						Vs.ci.name = Vs.bots[i].name
						Vs.ci.score = Vs.bots[i].score
						Vs.ci.photo = Vs.bots[i].photo
						Vs.ci.scale = 1
						let l = Vs.game.load.image(Vs.ci.photo, Vs.assetPath + '/' + Vs.ci.photo + '.png')
						l.start()
						l.onLoadComplete.add(() => {
							rs('load competitor complete')
						}, this)
						break
					}
				}
			}
		})		
	}

	increateScore(delta:number){
		this.p.increseScore(delta).then(e => {
			if (this.p.score > this.c.score)
				Vs.loadCompetitor(this.p.score).then(e => {
					this.i.KOEffect(() => {
						this.c.changePlayer(Vs.ci.photo)
					}, this)
				})
		})
	}

	getPlayerScore():number {
		return this.p.getScore()
	}

	disableInput(){
		this.muteBtn.inputEnabled = false
		this.reloadBtn.inputEnabled = false
	}
}