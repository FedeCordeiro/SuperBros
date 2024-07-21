/** global Phaser */

import { createAnimations } from "./animations.js"

const config = {
    type: Phaser.AUTO, //webgl, canvas, or auto..
    width: 256,
    height: 244,
    backgroundColor: '#049cd8',
    parent: 'game', //donde se va a renderizar (div)
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300},
            debug: false
        }
    },
    scene: {
        preload, //se ejecuta para precargar los recursos
        create, //se ejecuta cuando el juego comienza
        update //se ejecuta en cada frame
    }
}

new Phaser.Game(config)
//this --> game --> el juego que estoy haciendo

function preload () {
    this.load.image(
        'cloud1',
        'assets/scenery/overworld/cloud1.png'
    )

    this.load.spritesheet (
        'mario',
        'assets/entities/mario.png',
        { frameWidth: 18, frameHeight: 16}
    )

    this.load.image (
        'floorbricks',
        'assets/scenery/overworld/floorbricks.png'
    )

    this.load.audio (
        'gameover',
        'assets/sound/music/gameover.mp3'
    )
}

function create () {
    // image(x, y, id-del-asset)
    this.add.image(100,50, 'cloud1')
        .setOrigin(0,0) //origen por defecto, centro pantalla
        .setScale(0.15)


    // CARGAR CON PHYSICS
    this.mario = this.physics.add.sprite(50,100, 'mario')
        .setOrigin(0,1)
        //agregar colision con los bordes de la pantalla
        .setCollideWorldBounds(true)
        //agregar gravedad
        .setGravityY(500)

    this.floor = this.physics.add.staticGroup()

    this.floor
        .create (0, config.height -16, 'floorbricks')
        .setOrigin(0, 0.5)
        .refreshBody()

    this.floor
        .create (170, config.height -16, 'floorbricks')
        .setOrigin(0, 0.5)
        .refreshBody()

    this.floor
        .create (320, config.height, 'floorbricks')
        .setOrigin(0, 0.5)
        .refreshBody()

    this.floor
        .create (400, config.height -32, 'floorbricks')
        .setOrigin(0, 0.5)
        .refreshBody()

    this.keys = this.input.keyboard.createCursorKeys()

    //AGREGAR COLISIONES
    this.physics.add.collider(this.mario, this.floor)

    //AGREGAR LIMITES AL "MUNDO"
    this.physics.world.setBounds(0,0,2000, config.height)

    //AGREGAR LIMITES DE LA CAMARA
    this.cameras.main.setBounds(0,0,2000, config.height)
    this.cameras.main.startFollow(this.mario) //debe seguir a mario

    //ANIMACIONES
    createAnimations(this)
}

function update () {
    if (this.mario.isDead) return
    if (this.keys.left.isDown) {
        this.mario.x -= 2
        this.mario.anims.play('mario-walk', true)
        //girar la imagen
        this.mario.flipX = true
    } else if (this.keys.right.isDown) {
        this.mario.x += 2
        this.mario.anims.play('mario-walk', true)
        this.mario.flipX = false
    } else {
        this.mario.anims.play('mario-idle', true)
    }

    if (this.keys.up.isDown && this.mario.body.touching.down) {
       this.mario.setVelocityY(-300)
       this.mario.anims.play('mario-jump', true) 
    } 

    if (this.mario.y >= config.height) {
        this.mario.isDead = true
        this.mario.anims.play('mario-dead')
        //si mario se muere, se desactivan los limites y se cae
        this.mario.setCollideWorldBounds(false)
        this.sound.add('gameover', {volume: 0.2}).play()

        setTimeout(() => {
            this.mario.setVelocityY(-350)
        }, 100)

        setTimeout(() => {
            this.scene.restart()
        }, 7000)
    }
}