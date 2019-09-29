class Game {
    constructor(canvasId) {
        const canvas = document.getElementById(canvasId)
        this.screen = canvas.getContext("2d")
        this.size = { width: canvas.width, height: canvas.height }
        this.keyboard = new Keyboarder()

        this.monsters = []

        this.players = []

        this.goals = []

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

        let demonSize = {
            width: 20,
            height: 20
        }

        let demonLocation = {
            x: Math.floor(this.size.width * .5) - (heroSize.width / 2),
            y: Math.floor(this.size.height * .5) - (heroSize.height / 2)
        }

        let zombieSize = {
            width: 20,
            height: 20
        }

        let zombieLocation = {
            x: Math.floor(this.size.width * .2) - (heroSize.width / 2),
            y: Math.floor(this.size.height * .8) - (heroSize.height / 2)
        }

        let superHeroSize = {
            width: 20,
            height: 20
        }

        let superHeroLocation = {
            x: Math.floor(this.size.width - (superHeroSize.width * 3)),
            y: Math.floor(this.size.height * .5) - (superHeroSize.height / 2)
        }

        this.hero = new Hero(heroLocation, heroSize)
        this.addPlayer(this.hero)

        this.flag = new Flag(flagLocation, flagSize)
        this.addGoal(this.flag)

        this.demon = new Demon(demonLocation, demonSize)
        this.addMonster(this.demon)

        this.zombie = new Zombie(zombieLocation, zombieSize)
        this.addMonster(this.zombie)

        this.superHero = new SuperHero(superHeroLocation, superHeroSize)
    }

    addMonster(monster) {
        this.monsters.push(monster)
    }

    addPlayer(player) {
        this.players.push(player)
    }

    addGoal(goal) {
        this.goals.push(goal)
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

        let notEaten = (player) => {
            return this.players.filter(function (monster) { return monstersWin(player, monster) }).length === 0
        }

        this.players = this.players.filter(notEaten)

        for (var i = 0; i < this.players.length; i++) {
            this.players[i].update();
        }

        for (var i = 0; i < this.goals.length; i++) {
            this.goals[i].update();
        }

        for (var i = 0; i < this.monsters.length; i++) {
            this.monsters[i].update();
        }
    }

    draw() {
        this.screen.fillStyle = "#EEF4DD"
        this.screen.fillRect(0, 0, 1000, 500)

        for (let player of this.players) {
            player.draw(this.screen)
        }

        for (let goal of this.goals) {
            goal.draw(this.screen)
        }

        for (let monster of this.monsters) {
            monster.draw(this.screen)
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
        if (this.location.x >= 5) {
            this.location.x -= 2
        }
    }

    draw(screen) {
        screen.fillStyle = "#396804"
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

// function flagGrab(hero, flag) {
//     return !(
//         hero === flag ||
//         hero.location.x + hero.size.width / 2 < flag.location.x - flag.size.width / 2 ||
//         hero.location.y + hero.size.height / 2 < flag.location.y - flag.size.height / 2 ||
//         hero.location.x - hero.size.width / 2 > flag.location.x + flag.size.width / 2 ||
//         hero.location.y - hero.size.height / 2 > flag.location.y + flag.size.height / 2
//     )
// }

function collision(b1, b2) {
    return !(
        b1 === b2 ||
        b1.location.x + b1.size.width / 2 < b2.location.x - b2.size.width / 2 ||
        b1.location.y + b1.size.height / 2 < b2.location.y - b2.size.height / 2 ||
        b1.location.x - b1.size.width / 2 > b2.location.x + b2.size.width / 2 ||
        b1.location.y - b1.size.height / 2 > b2.location.y + b2.size.height / 2
    )
}

const game = new Game("capture-the-flag")
game.run()
