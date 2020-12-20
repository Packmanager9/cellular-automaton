const tutorial_canvas = document.getElementById("tutorial");
const tutorial_canvas_context = tutorial_canvas.getContext('2d');
let totalsaws = 110
let whackout = -1



const pausebtn = document.getElementById("pause");
let pausedvec = 1
pausebtn.onclick = flip
function flip() {
    pausedvec *= -1
    if (pausedvec == -1) {
        pausebtn.innerText = "stop"
    } else {
        pausebtn.innerText = "run"
    }
}

tutorial_canvas.style.background = "black"


let tip = {}
let flex = tutorial_canvas.getBoundingClientRect();
let xs
let ys

window.addEventListener('mousedown', e => {

    flex = tutorial_canvas.getBoundingClientRect();
    xs = e.clientX - flex.left;
    ys = e.clientY - flex.top;
    tip.x = xs
    tip.y = ys
    tip.body = tip

    for (let t = 0; t < rectx.blocks.length; t++) {
        for (let k = 0; k < rectx.blocks[t].length; k++) {
            if (rectx.blocks[t][k].isPointInside(tip)) {
                rectx.blocks[t][k].pile++
                rectx.blocks[t][k].shakeout()

            }
        }
    }

});


class Rectangle {
    constructor(x, y, w, h) {
        this.x = x
        this.y = y
        this.height = h
        this.width = w
        this.color = "white"
        this.pile = 0//Math.floor(Math.random()*4)
        this.t = 0
        this.k = 0
        this.neighbors = 0

    }
    shakeout() {
        if (this.pile >= 4) {
            shakeoutyes = 1
            this.pile = 0
            if (this.t > 0) {
                rectx.blocks[this.t - 1][this.k].pile += 1
            }
            if (this.k > 0) {
                rectx.blocks[this.t][this.k - 1].pile += 1
            }
            if (this.t < rectx.blocks.length) {
                rectx.blocks[this.t + 1][this.k].pile += 1
            }
            if (this.k < rectx.blocks.length) {
                rectx.blocks[this.t][this.k + 1].pile += 1
            }
        }
    }
    draw() {
        tutorial_canvas_context.fillStyle = this.color
        // if (this.dir == 0) {
        //     tutorial_canvas_context.fillStyle = "#FFFFFF"
        // }
        // if (this.dir == 1) {
        //     tutorial_canvas_context.fillStyle = "#F8F8F8"
        // }
        // if (this.dir == 2) {
        //     tutorial_canvas_context.fillStyle = "#F0F0F0"
        // }
        // if (this.dir == 3) {
        //     tutorial_canvas_context.fillStyle = "#E8E8E8"
        // }
        // if (this.dir == 4) {
        //     tutorial_canvas_context.fillStyle = "#e0e0e0"
        // }
        // if (this.dir == 5) {
        //     tutorial_canvas_context.fillStyle = "#d8d8d8"
        // }
        // if (this.dir == 6) {
        //     tutorial_canvas_context.fillStyle = "#d0d0d0"
        // }
        // if (this.dir == 7) {
        //     tutorial_canvas_context.fillStyle = "#c8c8c8"
        // }
        if (this.pile == 0) {
            tutorial_canvas_context.fillStyle = "yellow"
        } else if (this.pile == 1) {
            tutorial_canvas_context.fillStyle = "cyan"
        } else if (this.pile == 2) {
            tutorial_canvas_context.fillStyle = "red"
        } else if (this.pile == 3) {
            tutorial_canvas_context.fillStyle = "white"
        }
        tutorial_canvas_context.strokeStyle = "black"
        tutorial_canvas_context.lineWidth = 2
        tutorial_canvas_context.fillRect(this.x, this.y, this.width, this.height)
        tutorial_canvas_context.strokeRect(this.x, this.y, this.width, this.height)

    }

    isPointInside(point) {
        if (point.x >= this.x) {
            if (point.y >= this.y) {
                if (point.x <= this.x + this.width) {
                    if (point.y <= this.y + this.height) {
                        return true
                    }
                }
            }
        }
        return false
    }
}

class Grid {
    constructor() {
        this.blocks = []
        // this.dirs = []
        for (let t = 0; t < tutorial_canvas.width; t += 10) {
            this.holdblocks = []
            for (let k = 0; k < tutorial_canvas.height; k += 10) {
                const rect = new Rectangle(k, t, 10, 10)
                rect.dir = Math.floor(Math.random() * 8)
                rect.t = Math.floor(t / 10)
                rect.k = Math.floor(k / 10)
                // this.dirs.push(rect.dir)
                // rect.pile = Math.floor(Math.random() * 4)
                this.holdblocks.push(rect)
            }
            this.blocks.push([...this.holdblocks])
        }
        this.counter = 0
    }
    draw() {

        this.counter++

        if (pausedvec != 1) {
            this.automate()
        }
        for (let t = 1; t < this.blocks.length - 1; t++) {
            for (let k = 1; k < this.blocks[t].length - 1; k++) {
                this.blocks[t][k].draw()
                this.blocks[t][k].neighbors = 0
            }
        }
        // if(this.counter < 100){
        // for (let f = 0; f < this.blocks.length; f++) {
        //     for (let t = 0; t < this.blocks.length; t++) {
        //         for (let k = 0; k < this.blocks[t].length; k++) {
        //             this.blocks[t][k].shakeout()
        //         }
        //     }
        // }
        // }
    }
    automate() {
        for (let t = 1; t < this.blocks.length - 1; t++) {
            for (let k = 1; k < this.blocks[t].length - 1; k++) {
                for (let f = t - 1; f < t + 2; f++) {
                    for (let g = k - 1; g < k + 2; g++) {
                        if (this.blocks[t][k].pile > 0) {
                            if (this.blocks[f][g].pile == this.blocks[t][k].pile) {
                                if (t != f || k != g && (f < this.blocks.length - 1 && g < this.blocks[t].length - 1)) {
                                    this.blocks[t][k].neighbors += 1
                                }
                            }
                        } else {
                            if (this.blocks[f][g].pile > 0) {
                                if (t != f || k != g && (f < this.blocks.length - 1 && g < this.blocks[t].length - 1)) {
                                    this.blocks[t][k].neighbors += 1
                                }
                            }
                        }
                    }
                }
            }
        }
        for (let t = 1; t < this.blocks.length - 1; t++) {
            for (let k = 1; k < this.blocks[t].length - 1; k++) {
                if (this.blocks[t][k].pile > 0) {
                    if (this.blocks[t][k].neighbors < 2) {
                        this.blocks[t][k].pile -= 1
                    }
                    if (this.blocks[t][k].neighbors == 2 || this.blocks[t][k].neighbors == 3) {
                        // this.blocks[t][k].pile = 3
                    }
                    if (this.blocks[t][k].neighbors > 3) {
                        if (this)
                            this.blocks[t][k].pile -= 1
                    }
                } else {
                    if (this.blocks[t][k].neighbors == 3) {
                        this.blocks[t][k].pile = 3
                    }
                }

            }
        }


    }

    clone() {
        let clone = new Grid()
        clone.blocks = []
        // let dirindex = 0
        for (let t = 0; t < tutorial_canvas.width; t += 10) {
            clone.holdblocks = []
            for (let k = 0; k < tutorial_canvas.height; k += 10) {
                const rect = new Rectangle(k, t, 10, 10)
                rect.dir = this.blocks[Math.floor(t / 10)][Math.floor(k / 10)].dir
                if (Math.random() < .01) {
                    rect.dir = Math.floor(Math.random() * 8)
                }
                clone.holdblocks.push(rect)

            }
            clone.blocks.push([...clone.holdblocks])
        }
        return clone
    }
    mutate() {
        for (let t = 0; t < tutorial_canvas.width; t += 10) {
            for (let k = 0; k < tutorial_canvas.height; k += 10) {
                if (Math.random() < .01) {
                    this.blocks[Math.floor(t / 10)][Math.floor(k / 10)].dir = Math.floor(Math.random() * 8)
                }
            }
        }
    }
}

class Walker {
    constructor() {
        this.r = 255//Math.random() * 255
        this.g = Math.random() * 9
        this.b = Math.random() * 0

        this.grid = new Grid()
        this.body = new Bosscircle(10, 10, 3, `rgba(${this.r},${this.g},${this.b}, 1)`)
        this.gridspot = [0, 0]

        for (let t = 0; t < this.grid.blocks.length; t++) {
            for (let k = 0; k < this.grid.blocks[t].length; k++) {
                if (this.grid.blocks[t][k].isPointInside(this.body)) {
                    this.gridspot = [t, k]
                }
            }
        }
        this.hit = 0
    }
    draw() {
        this.body.color = `rgba(${this.r},${this.g},${this.b}, 1)`
        if (this.hit == 0) {
            // console.log(this.grid)
            this.hit = 1

        }

        if (this.grid.blocks[this.gridspot[0]][this.gridspot[1]].dir == 0) {
            this.gridspot[1] -= 0
            this.gridspot[0] += 1
        } else if (this.grid.blocks[this.gridspot[0]][this.gridspot[1]].dir == 1) {
            this.gridspot[1] -= 1
            this.gridspot[0] += 1
        } else if (this.grid.blocks[this.gridspot[0]][this.gridspot[1]].dir == 2) {
            this.gridspot[1] -= 1
            this.gridspot[0] += 0
        } else if (this.grid.blocks[this.gridspot[0]][this.gridspot[1]].dir == 3) {
            this.gridspot[1] -= 1
            this.gridspot[0] -= 1
        } else if (this.grid.blocks[this.gridspot[0]][this.gridspot[1]].dir == 4) {
            this.gridspot[1] -= 0
            this.gridspot[0] -= 1
        } else if (this.grid.blocks[this.gridspot[0]][this.gridspot[1]].dir == 5) {
            this.gridspot[1] += 1
            this.gridspot[0] -= 1
        } else if (this.grid.blocks[this.gridspot[0]][this.gridspot[1]].dir == 6) {
            this.gridspot[1] += 1
            this.gridspot[0] -= 0
        } else if (this.grid.blocks[this.gridspot[0]][this.gridspot[1]].dir == 7) {
            this.gridspot[1] += 1
            this.gridspot[0] += 1
        } else {
            console.log(this.grid.blocks[this.gridspot[0]][this.gridspot[1]].dir)
        }
        if (this.gridspot[1] < 0) {
            this.gridspot[1] = 0
        }
        if (this.gridspot[0] < 0) {
            this.gridspot[0] = 0
        }
        if (this.gridspot[1] > this.grid.blocks.length - 1) {
            this.gridspot[1] = this.grid.blocks.length - 1
        }
        if (this.gridspot[0] > this.grid.blocks.length - 1) {
            this.gridspot[0] = this.grid.blocks.length - 1
        }
        this.body.x = this.grid.blocks[this.gridspot[0]][this.gridspot[1]].x + 5
        this.body.y = this.grid.blocks[this.gridspot[0]][this.gridspot[1]].y + 5
        this.body.draw()

    }

}
class Line {
    constructor(x, y, x2, y2, color, width) {
        this.x1 = x
        this.y1 = y
        this.x2 = x2
        this.y2 = y2
        this.color = color
        this.width = width
        this.dir = 0
    }
    hypotenuse() {
        const xdif = this.x1 - this.x2
        const ydif = this.y1 - this.y2
        const hypotenuse = (xdif * xdif) + (ydif * ydif)
        return Math.sqrt(hypotenuse)
    }
    draw() {
        tutorial_canvas_context.strokeStyle = this.color
        tutorial_canvas_context.lineWidth = this.width
        tutorial_canvas_context.beginPath()
        tutorial_canvas_context.moveTo(this.x1, this.y1)
        tutorial_canvas_context.lineTo(this.x2, this.y2)
        tutorial_canvas_context.stroke()
        tutorial_canvas_context.lineWidth = 1
    }
}
class Blade {
    constructor(dis, angle, size, king) {
        this.king = king
        this.dis = dis
        this.angle = angle
        this.spin = (Math.random() - .5) * .1
        this.body = new Bosscircle(this.king.body.x, this.king.body.y, size, "gray")
        this.body.x = this.king.body.x + (Math.cos(this.king.angle + this.angle) * this.dis)
        this.body.y = this.king.body.y + (Math.sin(this.king.angle + this.angle) * this.dis)
    }
    draw() {
        this.body.color = this.king.color
        this.angle += this.spin
        this.body.x = this.king.body.x + (Math.cos(this.king.angle + this.angle) * this.dis)
        this.body.y = this.king.body.y + (Math.sin(this.king.angle + this.angle) * this.dis)
        this.body.draw()
    }

}
class Sawoid {
    constructor(x = Math.random() * tutorial_canvas.width, y = tutorial_canvas.height * Math.random(), r = 5, s = 1, saws = []) {
        this.marked = 0
        this.saws = saws
        // if(s>3){
        //     s=3
        // }
        this.s = s
        this.r = Math.random() * 255
        this.g = Math.random() * 255
        this.b = Math.random() * 255
        this.turns = 0
        this.angle = 0
        this.body = new Bosscircle(x, y, r, `rgba(${this.r},${this.g},${this.b}, 1)`, Math.random() - .5, Math.random() - .5)

        this.sawhold = this.saws.length
        // for(let t = this.saws.length;t<this.s; t++){
        //     this.saws.push(new Blade((this.body.radius*1.5)+Math.random()*25, Math.random()*Math.PI*2, Math.random()+1, this))
        // }


    }
    draw() {
        for (let t = this.sawhold; t < this.s; t++) {
            if (this.saws.length < this.s) {
                this.saws.push(new Blade((this.body.radius * 1.5) + Math.random() * 25, Math.random() * Math.PI * 2, Math.random() + 1, this))

            }
        }

        this.body.color = `rgba(${this.r},${this.g},${this.b}, 1)`
        this.turns
        this.body.draw()
        for (let t = 0; t < this.saws.length; t++) {
            this.saws[t].draw()
        }
        this.body.move()
    }
    clonesaws(target) {
        target.saws = []
        for (let t = 0; t < this.saws.length; t++) {
            let sizer = this.saws[t].body.radius + ((Math.random() - .5) * .1)
            target.saws.push(new Blade(Math.max(sizer, this.saws[t].dis + (Math.random() - .5)), this.saws[t].angle + (Math.random() - .5), sizer, target))
            target.saws[t].spin = this.saws[t].spin
        }


    }
    reproduce() {
        if (this.marked == 2) {
            if (saws.length <= totalsaws) {
                this.marked = 0
                let sawyer = new Sawoid(this.body.x, this.body.y, this.body.radius + ((Math.random() - .5) * .15), (this.saws.length - 1))
                if (Math.random() < (1 / (totalsaws * 3))) {
                    sawyer.s += 2
                }
                sawyer.r = this.r + ((Math.random() - .5) * 16)
                sawyer.g = this.g + ((Math.random() - .5) * 16)
                sawyer.b = this.b + ((Math.random() - .5) * 16)
                if (sawyer.r > 255) {
                    sawyer.r = 255
                }
                if (sawyer.r < 0) {
                    sawyer.r = 0
                }
                if (sawyer.g > 255) {
                    sawyer.g = 255
                }
                if (sawyer.g < 0) {
                    sawyer.g = 0
                }
                if (sawyer.b > 255) {
                    sawyer.b = 255
                }
                if (sawyer.b < 0) {
                    sawyer.b = 0
                }

                sawyer.body.color = this.body.color
                this.clonesaws(sawyer)
                sawyer.sawhold = this.saws.length
                saws.push(sawyer)
            }
        }
    }
    clean() {
        if (this.marked == 1) {
            if (saws.length >= totalsaws - 1) {
                saws.splice(saws.indexOf(this), 1)
            }
        }
    }
    colorDistance(target) {
        let rk = (this.r - target.r) * (this.r - target.r)
        let gk = (this.g - target.g) * (this.g - target.g)
        let bk = (this.b - target.b) * (this.b - target.b)

        return Math.sqrt(rk + bk + gk)

    }
}
class Bosscircle {
    constructor(x, y, radius, color, xmom = 0, ymom = 0) {
        this.height = 0
        this.width = 0
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.xmom = xmom
        this.ymom = ymom
    }
    draw() {
        tutorial_canvas_context.fillStyle = this.color
        tutorial_canvas_context.lineWidth = 0
        tutorial_canvas_context.strokeStyle = this.color
        tutorial_canvas_context.beginPath();
        if (this.radius < 1) {
            this.radius = 1
        }
        tutorial_canvas_context.arc(this.x, this.y, this.radius, 0, (Math.PI * 2), true)
        tutorial_canvas_context.fill()
        tutorial_canvas_context.stroke();
    }
    move() {
        this.x += this.xmom
        this.y += this.ymom
        if (this.x + this.radius > tutorial_canvas.width) {
            this.x = tutorial_canvas.width - this.radius
            if (this.xmom > 0) {
                this.xmom *= -1
            }
        }
        if (this.y + this.radius > tutorial_canvas.height) {
            this.y = tutorial_canvas.height - this.radius
            if (this.ymom > 0) {
                this.ymom *= -1
            }
        }
        if (this.x - this.radius < 0) {
            this.x = 0 + this.radius
            if (this.xmom < 0) {
                this.xmom *= -1
            }
        }
        if (this.y - this.radius < 0) {
            this.y = 0 + this.radius
            if (this.ymom < 0) {
                this.ymom *= -1
            }
        }
    }
    isPointInside(point) {
        let link = new Line(this.x, this.y, point.x, point.y, "red", 1)
        if (link.hypotenuse() <= this.radius) {
            return true
        }
        return false
    }
    repelCheck(point) {
        let link = new Line(this.x, this.y, point.x, point.y, "red", 1)
        if (link.hypotenuse() <= this.radius + point.radius) {
            return true
        }
        return false
    }
}

let saws = []

for (let t = 0; t < totalsaws; t++) {
    let sawyer = new Sawoid(Math.random() * tutorial_canvas.width, tutorial_canvas.height * Math.random(), 10, 1)
    saws.push(sawyer)

}

let shakeoutyes = 0

let gen = 10
let counter = 0
let rectx = new Grid()
rectx.draw()
// console.log(rect)
let walkers = []
for (let t = 0; t < 250; t++) {
    let walker = new Walker()
    walkers.push(walker)
}
let fitnessgoal = new Bosscircle(700, 700, 20, "gold")
let cutindex = 0
window.setInterval(function () {
    tutorial_canvas_context.clearRect(0, 0, tutorial_canvas.width, tutorial_canvas.height)
    shakeoutyes = 0
    rectx.draw()
    if (shakeoutyes == 0) {
        if (pausedvec == 1) {
            // rectx.blocks[35][35].pile+= 10
        }
    }
}, 10)


function refresh() {

    let walkehs = []
    for (let t = 0; t < 250; t++) {
        let walker = new Walker()
        walker.grid = walkers[cutindex].grid.clone()
        walker.r = walkers[cutindex].r + ((Math.random() - .5) * 16)
        walker.g = walkers[cutindex].g + ((Math.random() - .5) * 16)
        walker.b = walkers[cutindex].b + ((Math.random() - .5) * 16)
        if (walker.r > 255) {
            walker.r = 255
        }
        if (walker.r < 0) {
            walker.r = 0
        }
        if (walker.g > 255) {
            walker.g = 255
        }
        if (walker.g < 0) {
            walker.g = 0
        }
        if (walker.b > 255) {
            walker.b = 255
        }
        if (walker.b < 0) {
            walker.b = 0
        }

        if (Math.random() < .1) {
            walker.grid.mutate()
        }
        if (Math.random() < .1) {
            walker.grid.mutate()
        }
        if (Math.random() < .1) {
            walker.grid.mutate()
        }
        if (Math.random() < .1) {
            walker.grid.mutate()
        }
        if (Math.random() < .1) {
            walker.grid.mutate()
        }
        // for(let t = 0; t<100;t++){

        //     walker.grid.mutate()
        // }
        walkehs.push(walker)
    }


    walkers = [...walkehs]

}

function getRandomLightColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[(Math.floor(Math.random() * 14) + 1)];
    }
    return color;
}
