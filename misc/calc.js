const calc = () => {
    let sum = 0

    for(let i=0; i < 3e9; i++) {
        sum += i
    }

    return sum
}

const sum = calc()

process.send(sum)