let vol;
let oscillator;
let oscilloscope;

let started = false;

async function setup() {
  // setup should only run once
  if (!started) {
    // add audio scripts after a user interaction (button press) so that it doesn't
    // freak out about automatically playing audio in the browser
    let srcs = ['js/NexusUI.js', 'js/Tone.js'];

    try {
      await Promise.all(loadScripts(srcs));
    } catch (e) {
      console.error(e);
    }

    // these log statements show the difference between the value of the two contexts
    // console.log(Nexus.context);
    // console.log(Tone.context);

    // this does what we'd expect Nexus.context = Tone.context to do
    Nexus.context = Tone.context._context;

    vol = new Tone.Volume(-18).toMaster();
    oscillator = new Tone.Oscillator(330).connect(vol);

    // I think it's usually a good idea to use Tone.connect when using different AudioContexts
    // in this case though (possibly because we set the two AudioContexts to be the same),
    // adding '.connect(Tone.Master)' to the next line has the same effect as the code below
    oscilloscope = new Nexus.Oscilloscope('#oscilloscope', {
      size: [600, 400],
    });
    Tone.connect(oscilloscope, Tone.Master);

    started = true;
  }
}

function play() {
  started ? oscillator.start() : alert('Must start first!');
}

function pause() {
  started ? oscillator.stop() : alert('Must start first!');
}

function loadScripts(srcs) {
  let promises = [];
  for (let src of srcs) {
    let script = document.createElement('script');
    script.setAttribute('src', src);

    promises.push(
      new Promise((resolve, reject) => {
        // adds event listener for script load, then resolves
        script.onload = () => {
          resolve(`Loaded ${src}`);
        };
        // same thing but for errors
        script.onerror = () => {
          reject(new Error(`Error loading script: ${src}`));
        };
        // wait until the event listeners are added to append the script tags,
        // otherwise they might not trigger if the script loads fast
        document.head.appendChild(script);
      })
    );
  }
  return promises;
}
