
declare let process: {
	env: {
		NODE_ENV: string
	}
}

export class G {
	static readonly platform: string = process.env.NODE_ENV
	static readonly ratio = window.innerHeight / window.innerWidth
	static readonly ADS_ID = '392451404877797_393676934755244'
	static ldb: FBInstant.Leaderboard
	static data: any
	static game: Game = null
}

import 'p2'
import 'pixi'
import 'phaser'

import Boot from './states_new/boot'
import Preloader from './states_new/preloader'
import main from './states_new/main'
import playGame from './states_new/playGame'
import GameOver from './states_new/gameover'
import { FBStorage, Storable, MyFBStorage, LocalStorage } from './models/model'

export function launch(platform: string) {
	if (platform === 'facebook') {
		FBInstant.initializeAsync().then(() => {
			FBInstant.setLoadingProgress(100)
			FBInstant.startGameAsync().then(() => {
				FBInstant.getLeaderboardAsync('global_leaderboardnow').then(ldb => {
					G.ldb = ldb
					G.data = new MyFBStorage()
					G.game = new Game(G.data)
				}).catch(e => console.log(e))
			}).catch(e => console.error(e))
		}).catch(e => console.log(e))
	}
	else {
		G.data = new LocalStorage()
		G.game = new Game(G.data)
	}
}

export class Game extends Phaser.Game {
	public data: Storable
	private rewardAds: FBInstant.AdInstance
	private interstitialAds: FBInstant.AdInstance
	public adsLoadCompleted: Promise<any>

	constructor(data: Storable) {
		super(1080, 1080 * window.innerHeight / window.innerWidth, Phaser.CANVAS, 'content', null)
		this.data = data
		G.data = data
		this.data.load().then((obj) => {
			console.log('initial score: ', G.data.score)
			this.state.add('Boot', Boot, false)
			this.state.add('Preloader', Preloader, false)
			this.state.add('playGame', playGame, false)
			this.state.add('main', main, false)
			this.state.add('GameOver', GameOver, false)
			this.state.start('Boot')
		}).catch(e => console.error(e))
	}

	loadRewardAds(): Promise<void> {
		return new Promise<any>((resolve, reject) => {
			FBInstant.getRewardedVideoAsync(G.ADS_ID).then(rewarded => {
				G.game.rewardAds = rewarded
				G.game.rewardAds.loadAsync()
					.then(e => resolve('load ads complete'))
					.catch(e => reject('load ads failed'))
			})
				.catch(e => reject('load ads failed'))
		})
	}

	showRewardAds(): Promise<void> {
		return this.rewardAds.showAsync()
	}

	loadInterstitialAds(): Promise<void> {
		return new Promise<any>((resolve, reject) => {
			FBInstant.getInterstitialAdAsync(G.ADS_ID).then(interstitial => {
				G.game.interstitialAds = interstitial
				G.game.interstitialAds.loadAsync()
					.then(e => resolve('load ads complete'))
					.catch(e => reject('load ads failed'))
			})
				.catch(e => reject('load ads failed'))
		})
	}

	showInterstitialAds(): Promise<void> {
		return this.interstitialAds.showAsync()
	}
}


window.onload = function () {
	launch(G.platform)
}