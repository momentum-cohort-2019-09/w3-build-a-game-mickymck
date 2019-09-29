class Game {
    constructor(canvasId) {
        const canvas = document.getElementById(canvasId)
        this.screen = canvas.getContext("2d")
        this.size = { width: canvas.width, height: canvas.height }
        this.keyboard = new Keyboarder()
        this.gameOver = false

        this.bodies = []

        this.goodBodies = []

        let heroSize = {
            width: 20,
            height: 20
        }

        let heroLocation = {
            x: Math.floor(heroSize.width * 2),
            y: Math.floor(this.size.height * .5) - (heroSize.height / 2)
        }

        let superHeroSize = {
            width: 20,
            height: 20
        }

        let superHeroLocation = {
            x: Math.floor(this.size.width - (superHeroSize.width * 3)),
            y: Math.floor(this.size.height * .5) - (superHeroSize.height / 2)
        }

        let flagSize = {
            width: 20,
            height: 20
        }

        let flagLocation = {
            x: Math.floor(this.size.width - (flagSize.width * 3)),
            y: Math.floor(this.size.height * .5) - (flagSize.height / 2)
        }

        let homeBaseSize = {
            width: 20,
            height: 20
        }

        let homeBaseLocation = {
            x: Math.floor(flagSize.width * 3),
            y: Math.floor(this.size.height * .5) - (flagSize.height / 2)
        }

        let demonSize = {
            width: 20,
            height: 20
        }

        let demonLocation = {
            x: Math.floor(this.size.width * .9) - (heroSize.width / 2),
            y: Math.floor(this.size.height * .4) - (heroSize.height / 2)
        }

        let zombieSize = {
            width: 20,
            height: 20
        }

        let zombieLocation = {
            x: Math.floor(this.size.width * .1) - (heroSize.width / 2),
            y: Math.floor(this.size.height * .1) - (heroSize.height / 2)
        }

        let ghostSize = {
            width: 20,
            height: 20
        }

        let ghostLocation = {
            x: Math.floor(this.size.width * .3) - (heroSize.width / 2),
            y: Math.floor(this.size.height * .9) - (heroSize.height / 2)
        }

        this.hero = new Hero(heroLocation, heroSize)
        this.addBody(this.hero)
        this.addGoodBody(this.hero)

        this.flag = new Flag(flagLocation, flagSize)
        this.addGoodBody(this.flag)

        this.demon = new Demon(demonLocation, demonSize)
        this.addBody(this.demon)

        this.zombie = new Zombie(zombieLocation, zombieSize)
        this.addBody(this.zombie)

        this.ghost = new Ghost(ghostLocation, ghostSize)
        this.addBody(this.ghost)

        this.superHero = new SuperHero(superHeroLocation, superHeroSize)

        this.homeBase = new HomeBase(homeBaseLocation, homeBaseSize)
    }

    addBody(body) {
        this.bodies.push(body)
    }

    addGoodBody(goodBody) {
        this.goodBodies.push(goodBody)
    }

    run() {
        const tick = () => {
            this.update()
            this.draw()

            if (!this.gameOver) {
                requestAnimationFrame(tick)
            }
        }

        tick()
    }

    update() {
        for (let body of this.bodies) {
            body.update(this)

            // if a bad guy touches hero, he dead
            if (crash(this.hero, this.demon)) {
                this.gameOver = true
            }

            if (crash(this.hero, this.zombie)) {
                this.gameOver = true
            }

            if (crash(this.hero, this.ghost)) {
                this.gameOver = true
            }

            // if a bad guy touches superHero, he dead
            if (crash(this.superHero, this.demon)) {
                this.gameOver = true
            }

            if (crash(this.superHero, this.zombie)) {
                this.gameOver = true
            }

            if (crash(this.superHero, this.ghost)) {
                this.gameOver = true
            }
        }

        for (let goodBody of this.goodBodies) {
            goodBody.update(this)

            // allows hero to turn superHero when he grabs the flag
            let heroHasNoFlag = (hero) => {
                return this.goodBodies.filter(function (flag) { return flagGrab(hero, flag) }).length === 0
            }
            this.goodBodies = this.goodBodies.filter(heroHasNoFlag)

            // if hero grabs the flag, and after hero has been removed from goodBodies once, and a homebase has already been added to the goodBodies array
            if ((crash(this.hero, this.flag)) && (this.goodBodies[0] !== this.hero) && (this.bodies[this.bodies.length - 1] !== this.superHero)) {
                this.addBody(this.superHero)
                this.bodies.splice(0, 1)
                this.addGoodBody(this.homeBase)
            }

            // if he brings the flag home, he wins the game
            if (crash(this.superHero, this.homeBase)) {
                this.gameOver = true
            }
        }
    }

    draw() {
        this.screen.fillStyle = "#423149"
        this.screen.fillRect(0, 0, 1000, 500)

        for (let body of this.bodies) {
            body.draw(this.screen)
        }

        for (let goodBody of this.goodBodies) {
            goodBody.draw(this.screen)
        }
    }
}

class Hero {
    constructor(location, size) {
        this.location = location
        this.size = size
    }

    update() {
        if (game.keyboard.isDown(Keyboarder.KEYS.LEFT) && (this.location.x >= 5)) {
            this.location.x -= 2
        }
        if (game.keyboard.isDown(Keyboarder.KEYS.RIGHT) && (this.location.x <= 975)) {
            this.location.x += 2
        }
        if (game.keyboard.isDown(Keyboarder.KEYS.UP) && (this.location.y >= 5)) {
            this.location.y -= 2
        }
        if (game.keyboard.isDown(Keyboarder.KEYS.DOWN) && (this.location.y <= 475)) {
            this.location.y += 2
        }
    }

    draw(screen) {
        screen.fillStyle = "#EEE11A"
        screen.fillRect(this.location.x, this.location.y, this.size.width, this.size.height)
    }
}

class SuperHero {
    constructor(location, size) {
        this.location = location
        this.size = size
    }


    update() {
        if (game.keyboard.isDown(Keyboarder.KEYS.LEFT) && (this.location.x >= 5)) {
            this.location.x -= 4
        }
        if (game.keyboard.isDown(Keyboarder.KEYS.RIGHT) && (this.location.x <= 975)) {
            this.location.x += 4
        }
        if (game.keyboard.isDown(Keyboarder.KEYS.UP) && (this.location.y >= 5)) {
            this.location.y -= 4
        }
        if (game.keyboard.isDown(Keyboarder.KEYS.DOWN) && (this.location.y <= 475)) {
            this.location.y += 4
        }
    }

    draw(screen) {
        screen.fillStyle = "#EEE11A"
        screen.fillRect(this.location.x, this.location.y, this.size.width, this.size.height)
        screen.fillStyle = "#8CD1EF"
        screen.fillRect(this.location.x + (this.size.width / 2), this.location.y, this.size.width / 2, this.size.height / 2)
        screen.fillStyle = "#8CD1EF"
        screen.fillRect(this.location.x, this.location.y + (this.size.height /2), this.size.width / 2, this.size.height / 2)
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

class HomeBase {
    constructor(location, size) {
        this.location = location
        this.size = size
    }

    update() {

    }

    draw(screen) {
        screen.fillStyle = "#FF9FF9"
        screen.fillRect(this.location.x, this.location.y, this.size.width, this.size.height)
    }
}

class Demon {
    constructor(location, size) {
        this.location = location
        this.size = size
    }

    update() {
        if (this.location.x >= 5) {
            this.location.x -= 2
        }
    }

    draw(screen) {
        screen.fillStyle = "#CC0303"
        screen.fillRect(this.location.x, this.location.y, this.size.width, this.size.height)
    }
}

class Zombie {
    constructor(location, size) {
        this.location = location
        this.size = size
    }

    update() {
        if (this.location.x <= 975) {
            this.location.x += 2
        }
    }

    draw(screen) {
        screen.fillStyle = "#396804"
        screen.fillRect(this.location.x, this.location.y, this.size.width, this.size.height)
    }
}

class Ghost {
    constructor(location, size) {
        this.location = location
        this.size = size
    }

    update() {
        if (this.location.x <= 975) {
            this.location.x += 2
        }
    }

    draw(screen) {
        screen.fillStyle = "#ffffff"
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

function crash(hero, b2) {
    return !(
        hero === b2 ||
        hero.location.x + hero.size.width / 2 < b2.location.x - b2.size.width / 2 ||
        hero.location.y + hero.size.height / 2 < b2.location.y - b2.size.height / 2 ||
        hero.location.x - hero.size.width / 2 > b2.location.x + b2.size.width / 2 ||
        hero.location.y - hero.size.height / 2 > b2.location.y + b2.size.height / 2
    )
}

const game = new Game("capture-the-flag")
game.run()
