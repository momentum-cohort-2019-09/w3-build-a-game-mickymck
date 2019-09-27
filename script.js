class Game {
    constructor(canvasId) {
        const canvas = document.getElementById(canvasId)
        this.screen = canvas.getContext("2d")
        this.size = { width: canvas.width, height: canvas.height }
        this.keyboard = new Keyboarder

        this.bodies = []

        let heroSize = {
            width: 10,
            height: 10
        }

        let heroLocation = {
            x: Math.floor(this.size.width * .5) - (heroSize.width / 2),
            y: Math.floor(this.size.height - (heroSize.height * 2))
        }

        let flagSize = {
            width: 10,
            height: 10
        }

        let flagLocation = {
            x: Math.floor(this.size.width * .5) - (flagSize.width / 2),
            y: Math.floor(flagSize.height * 2)
        }

        console.log(flagLocation)

        this.hero = new Hero(heroLocation, heroSize)
        this.addBody(this.hero)

        this.flag = new Flag(flagLocation, flagSize)
        this.addBody(this.flag)
    }

    addBody(body) {
        this.bodies.push(body)
    }

    // add tick, to give our players the ability to move

    // add keyboardability for our Hero

    run() {
        this.draw()
    }

    draw() {
        this.screen.fillStyle = "#FFFDE8"
        this.screen.fillRect(0, 0, 500, 500)

        for (let body of this.bodies) {
            body.draw(this.screen)
        }
    }
}

class Hero {
    constructor(location, size) {
        this.location = location
        this.size = size
    }

    draw(screen) {
        screen.fillStyle = "#000000"
        screen.fillRect(this.location.x, this.location.y, this.size.width, this.size.height)
    }
}

class Flag {
    constructor(location, size) {
        this.location = location
        this.size = size
    }

    draw(screen) {
        screen.fillStyle = "#8CD1EF"
        screen.fillRect(this.location.x, this.location.y, this.size.width, this.size.height)
    }
}

class Keyboarder {
    constructor() {
        this.keyState = {}

        window.addEventListener('keydown', function (e) {
            this.keyState[e.keyCode] = true
        }.bind(this))

        window.addEventListener('keyup', function (e) {
            this.keyState[e.keyCode] = false
        }.bind(this))
    }

    isDown(keyCode) {
        return this.keyState[keyCode] === true
    }

    on(keyCode, callback) {
        window.addEventListener('keydown', function (e) {
            if (e.keyCode === keyCode) {
                callback()
            }
        })
    }
}

Keyboarder.KEYS = { LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, S: 83 }

const captureGame = new Game("capture-the-flag")
captureGame.run()
