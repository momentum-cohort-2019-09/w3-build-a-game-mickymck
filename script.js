class Game {
    constructor(canvasId) {
        const canvas = document.getElementById(canvasId)
        this.screen = canvas.getContext("2d")
        this.size = { width: canvas.width, height: canvas.height }
        this.keyboard = new Keyboarder

        this.bodies = []

        let heroSize = {
            width: 20,
            height: 20
        }

        let heroLocation = {
            x: Math.floor(heroSize.width * 2),
            y: Math.floor(this.size.height * .5) - (heroSize.height / 2)
        }

        let flagSize = {
            width: 20,
            height: 20
        }

        let flagLocation = {
            x: Math.floor(this.size.width - (flagSize.width * 3)),
            y: Math.floor(this.size.height * .5) - (flagSize.height / 2)
        }

        let monsterSize = {
            width: 20,
            height: 20
        }

        let monsterLocation = {
            x: Math.floor(this.size.width * .5) - (heroSize.width / 2),
            y: Math.floor(this.size.height * .5) - (heroSize.height / 2)
        }

        this.hero = new Hero(heroLocation, heroSize)
        this.addBody(this.hero)

        this.flag = new Flag(flagLocation, flagSize)
        this.addBody(this.flag)

        this.monster = new Monster(monsterLocation, monsterSize)
        this.addBody(this.monster)
    }

    addBody(body) {
        this.bodies.push(body)
    }

    run() {
        const tick = () => {
            this.update()
            this.draw()
            requestAnimationFrame(tick)
        }

        tick()
    }

    update() {
        for (let body of this.bodies) {
            body.update(this)
        }
    }

    draw() {
        this.screen.fillStyle = "#EEF4DD"
        this.screen.fillRect(0, 0, 1000, 500)

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

    update() {

    }

    draw(screen) {
        screen.fillStyle = "#EEE11A"
        screen.fillRect(this.location.x, this.location.y, this.size.width, this.size.height)
    }
}

class Flag {
    constructor(location, size) {
        this.location = location
        this.size = size
    }

    update() {

    }

    draw(screen) {
        screen.fillStyle = "#8CD1EF"
        screen.fillRect(this.location.x, this.location.y, this.size.width, this.size.height)
    }
}

class Monster {
    constructor(location, size) {
        this.location = location
        this.size = size
    }

    update() {
        this.location.x += 1
    }

    draw(screen) {
        screen.fillStyle = "#146515"
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
