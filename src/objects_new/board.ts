import {peices} from './peices'
import { G } from '../app'
export class Board extends Phaser.Group {

	public arr:number[][] = [
						[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
						[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
						[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
						[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
						[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
						[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
						[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
						[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
						[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
						[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
					]

	arrPeices:peices[][] = []
	bg:Phaser.Image
	constructor(game:Phaser.Game, countOfCat: number,level:number) {
		super(game, undefined, 'group', true, false, undefined)
		this.shuffle1(countOfCat,level)
		this.bg = new Phaser.Image(game, 0, 0, 'bg2')
		//let dx = width/this.bg.width
		//let dy = height/this.bg.height
		if(G.ratio>1.9){
			this.bg.scale.setTo(0.8, 1.1)	
		}else{
			this.bg.scale.setTo(0.8, 0.87)	
		}
		this.x = 0
		this.addChild(this.bg)
		this.height = this.bg.height
		this.centerY = game.world.centerY 
		this.exportArr()
		this.game.add.existing(this)

	
	}

	shuffle1(countOfCat:number, level:number){
		for(let i = 0; i < 10; i++) {
			for(let j = 0; j < 10; j++) {
				this.arr[i][j] = Math.floor((Math.random() * countOfCat) +level )				
			}
		}
	}
	// shuffle(){
	// 	for(let i = 0; i < 10; i++) {
	// 		for(let j = 0; j < 10; j++) {
	// 			this.temp = this.arr[i][j]
	// 			this.arr[i][j]= this.arr[i+2][j+2]
	// 			this.arr[i+2][j+2] = this.temp
	// 		}
	// 	}
		
	// }

	exportArr(){
		console.log('arr: ', this.arr)
	}

	getValueArr(i:number, j:number){
		return this.arr[i][j]
	}

}