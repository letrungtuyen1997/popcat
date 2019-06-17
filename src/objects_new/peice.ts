import { G } from '../app'
export class Peice extends Phaser.Sprite{
	x:number
	y:number
	public color: number
	context: any
	onclick: Function
	peiceShape: any
	game:Phaser.Game
	isDead: boolean = true
	Sound_put: Phaser.Sound
	check:boolean = true


	constructor(game: Phaser.Game, y:number, x:number, color:number) {
		super(game, x, y)
		this.game = game
		this.x = x
		this.y = y
		this.color = color
		this.render(game)
	}
	render(game:Phaser.Game) {
		if(this.color == -1) {
			if(G.ratio>1.9)
			{
				this.peiceShape = this.game.add.sprite(103*this.y + 30, (103*this.x + 1000), 'peices', 1)
				this.peiceShape.destroy()
			}else{
				this.peiceShape = this.game.add.sprite(103*this.y + 30, (103*this.x + 800), 'peices', 1)
				this.peiceShape.destroy()
			}
		}
		else {
			if(G.ratio>1.9){
				this.peiceShape = this.game.add.sprite(103*this.y + 30 , (103*this.x + 1000) , 'peices', this.color)
			//this.peiceShape.scale.set(0.3, 0.3)
			this.peiceShape.inputEnabled = true
			this.peiceShape.events.onInputDown.add(()=>{
				this.onclick.apply(this.context, [this.x, this.y])	
				this.soundPut()
			}, this)
			}else{
				this.peiceShape = this.game.add.sprite(103*this.y + 30 , (103*this.x + 800) , 'peices', this.color)
			//this.peiceShape.scale.set(0.3, 0.3)
			this.peiceShape.inputEnabled = true
			this.peiceShape.events.onInputDown.add(()=>{
				this.onclick.apply(this.context, [this.x, this.y])	
				this.soundPut()
			}, this)
			}
			
		}

		
		
	}

	getColor(){
		return this.color
	}
	soundPut() {
		this.Sound_put = this.game.add.audio('sound_put',1)
		this.Sound_put.play()
		setTimeout(() => {
		this.Sound_put.destroy()	
		}, 100);

	}

	Destroy(){
		this.peiceShape.destroy()
		//this.peiceShape.visible = false
		//this.peiceShape.alive = false
		

	}
}