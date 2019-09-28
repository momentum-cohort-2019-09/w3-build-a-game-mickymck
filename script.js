class Game {
    constructor(canvasId) {
        const canvas = document.getElementById(canvasId)
        this.screen = canvas.getContext("2d")
        this.size = { width: canvas.width, height: canvas.height }
        this.keyboard = new Keyboarder()

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

        let heroWithFlagSize = {
            width: 40,
            height: 40
        }

        let heroWithFlagLocation = {
            x: Math.floor(this.size.width - (heroWithFlagSize.width * 1.75)),
            y: Math.floor(this.size.height * .5) - (heroWithFlagSize.height / 2)
        }

        this.hero = new Hero(heroLocation, heroSize)
        this.addBody(this.hero)

        this.flag = new Flag(flagLocation, flagSize)
        this.addBody(this.flag)

        this.monster = new Monster(monsterLocation, monsterSize)
        this.addBody(this.monster)

        this.heroWithFlag = new HeroWithFlag(heroWithFlagLocation, heroWithFlagSize)
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
        let heroHasNoFlag = (hero) => {
            return this.bodies.filter(function (flag) { return flagGrab(hero, flag) }).length === 0
        }

        this.bodies = this.bodies.filter(heroHasNoFlag)

        for (var i = 0; i < this.bodies.length; i++) {
            this.bodies[i].update();
        }

        if ((this.bodies[0] !== this.hero) && (this.bodies[this.bodies.length - 1] !== this.heroWithFlag)) {
            this.addBody(this.heroWithFlag)
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
        if (game.keyboard.isDown(Keyboarder.KEYS.LEFT)) {
            this.location.x -= 2
        }
        if (game.keyboard.isDown(Keyboarder.KEYS.RIGHT)) {
            this.location.x += 2
        }
        if (game.keyboard.isDown(Keyboarder.KEYS.UP)) {
            this.location.y -= 2
        }
        if (game.keyboard.isDown(Keyboarder.KEYS.DOWN)) {
            this.location.y += 2
        }
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

class HeroWithFlag {
    constructor(location, size) {
        this.location = location
        this.size = size
    }

    update() {
        if (game.keyboard.isDown(Keyboarder.KEYS.LEFT)) {
            this.location.x -= 2
        }
        if (game.keyboard.isDown(Keyboarder.KEYS.RIGHT)) {
            this.location.x += 2
        }
        if (game.keyboard.isDown(Keyboarder.KEYS.UP)) {
            this.location.y -= 2
        }
        if (game.keyboard.isDown(Keyboarder.KEYS.DOWN)) {
            this.location.y += 2
        }
    }

    draw(screen) {
        screen.fillStyle = "#EEE11A"
        screen.fillRect(this.location.x, this.location.y, this.size.width, this.size.height)
        screen.fillStyle = "#8CD1EF"
        screen.fillRect(this.location.x + (this.size.width / 2), this.location.y, this.size.width / 2, this.size.height / 2)
    }
}

class Monster {
    constructor(location, size) {
        this.location = location
        this.size = size
    }

    update() {
        this.location.x -= .5
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

function flagGrab(hero, flag) {
    return !(
        hero === flag ||
        hero.location.x + hero.size.width / 2 < flag.location.x - flag.size.width / 2 ||
        hero.location.y + hero.size.height / 2 < flag.location.y - flag.size.height / 2 ||
        hero.location.x - hero.size.width / 2 > flag.location.x + flag.size.width / 2 ||
        hero.location.y - hero.size.height / 2 > flag.location.y + flag.size.height / 2
    )
}

// function monstersWin(b1, b2) {
//     return !(
//         b1 === b2 ||
//         b1.location.x + b1.size.width / 2 < b2.location.x - b2.size.width / 2 ||
//         b1.location.y + b1.size.height / 2 < b2.location.y - b2.size.height / 2 ||
//         b1.location.x - b1.size.width / 2 > b2.location.x + b2.size.width / 2 ||
//         b1.location.y - b1.size.height / 2 > b2.location.y + b2.size.height / 2
//     )
// }

const game = new Game("capture-the-flag")
game.run()
