import { Vs } from '../objects_new/vs/vs'
import { Greeting } from '../objects_new/greeting/greeting'
import { LeaderBoard } from '../objects_new/leaderboard/leaderboard'

export default class Preloader extends Phaser.State {

	preloadBar: Phaser.Sprite;
	ready: boolean = false;

	preload() {
		this.game.load.crossOrigin = 'anonymous'
		this.preloadBar = this.add.sprite(this.world.centerX - 500 / 2, this.world.centerY, 'preloadBar')
		this.load.setPreloadSprite(this.preloadBar)
		this.load.spritesheet('peices', 'assets/puzzle/game4.png', 100, 100, 14)
		this.load.spritesheet('peices1', 'assets/puzzle/game5.png', 100, 100, 14)
		this.load.spritesheet('sprite_bg', 'assets/puzzle/spritebg.png', 1440, 2280, 8)
		this.load.image('peices2', 'assets/puzzle/game3.png')
		this.load.image('bg', 'assets/puzzle/bg1.jpg')
		this.load.image('bg2', 'assets/puzzle/bg.jpg')
		this.load.bitmapFont('bubble', 'assets/font/font2.png', 'assets/font/font2.fnt')
		this.load.bitmapFont('score', 'assets/font/font/fenshu.png', 'assets/font/font/fenshu.fnt')
		this.load.bitmapFont('desyrel', 'assets/font/desyrel.png', 'assets/font/desyrel.xml')
		this.load.bitmapFont('leveltxt', 'assets/font/leveltxt.png', 'assets/font/atari-sunset.xml')
		this.load.audio('sound_match', 'assets/sound/match.mp3')
		this.load.audio('sound_match_many', 'assets/sound/matchMany.mp3')
		this.load.audio('sound_put', 'assets/sound/put.mp3')
		this.load.audio('sound_Playgame', 'assets/sound/btn.mp3')
		this.load.audio('sound_fade', 'assets/sound/fade.mp3')
		this.load.audio('sound_yeah', 'assets/sound/yeah2.mp3')
		this.load.audio('sound_yeah1', 'assets/sound/yeah1.mp3')
		this.load.audio('sound_clap', 'assets/sound/clap1.mp3')
		this.load.image('btn_start', 'assets/puzzle/btnstart.png')
		this.load.image('btn_leaderboard', 'assets/puzzle/btnleaderboard.png')
		this.load.image('popcat', 'assets/puzzle/popcat.png')
		this.load.image('tee', 'assets/leaderboard/tee.png')
		this.load.image('replayBtn', 'assets/puzzle/replayBtn.png')
		this.load.image('frame_target', 'assets/puzzle/frametarget.png')
		this.load.image('level_complete', 'assets/puzzle/levelcomplete.png')
		this.load.image('level_up', 'assets/puzzle/levelup.png')
		this.load.image('hammer', 'assets/puzzle/hammer.png')
		this.load.image('shuffle', 'assets/puzzle/shuffle.png')
		this.load.image('block', 'assets/puzzle/Table.png')
		this.load.audio('over', 'assets/sound/over.mp3')
		this.load.audio('bg_sound', 'assets/sound/bg1_sound.mp3')
		this.load.image('apple', 'assets/puzzle/apple.png')
		this.load.image('apple_half1', 'assets/puzzle/apple_half1.png')
		this.load.image('apple_half2', 'assets/puzzle/apple_half2.png')









		//	this.load.bitmapFont('greyFnt', 'assets/font/font2.png', './assets/font2.fnt')




		Vs.loadAsset(this, './assets/vs')
		Greeting.loadAsset(this, 'assets/greeting')
		LeaderBoard.loadAsset(this, 'assets/leaderboard')

	}

	create() {
		this.game.state.start('playGame', true, false)
	}
}