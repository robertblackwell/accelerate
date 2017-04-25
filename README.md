# Accelerate


## Usage

```js
const initVelocity = 0

const car = new PIXI.Sprite();
const carAccelerator = new Accelerator(initVelocity);

// animate on frame
function ticker(delta) {
    car.position.x += carAccelerator.getDistance(delta)

    window.requestAnimationFrame(ticker);
}
window.requestAnimationFrame(ticker);

// Promise based
carAccelerator.to(newV, overDist, overTime)
.then(carAccelerator.to(newV, overDist))
.then(carAccelerator.to(newV, overTime))
.then(console.log('done'))

```


## Commands

### Test

Run tests

```bash
npm test
```

### Lint

Run the linter

```bash
npm run lint
```