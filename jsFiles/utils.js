
// initialize jsPsych
const jsPsych = initJsPsych({
    on_finish: (data) => {
        data.boot = boot;
        if(!boot) {
            document.body.innerHTML = 
                `<div align='center' style="margin: 10%">
                    <p>Thank you for participating!<p>
                    <b>You will be automatically re-directed to Prolific in a few moments.</b>
                </div>`;
            setTimeout(() => { 
                location.href = `https://app.prolific.co/submissions/complete?cc=${completionCode}`
            }, 2000);
        }
    },
});

// set and save subject ID
let subject_id = jsPsych.data.getURLVariable("PROLIFIC_PID");
if (!subject_id) { subject_id = jsPsych.randomization.randomID(10) };
jsPsych.data.addProperties({ subject: subject_id });

// define file name
const filename = `${subject_id}.csv`;

// define completion code for Prolific
const completionCode = "CW0CMZ8Y";

// when true, boot participant from study without redirecting to Prolific
let boot = false;

// function for saving survey data in wide format
const saveSurveyData = (data) => {
    const names = Object.keys(data.response);
    const values = Object.values(data.response);
    for(let i = 0; i < names.length; i++) {
        data[names[i]] = values[i];
    };      
};

const getTotalErrors = (data, correctAnswers) => {
    const answers = Object.values(data.response);
    const errors = answers.map((val, index) => val === correctAnswers[index] ? 0 : 1)
    const totalErrors = errors.reduce((partialSum, a) => partialSum + a, 0);
    return totalErrors;
};

const createSpinner = function(canvas, spinnerData, score, sectors, interactive) {

  /* get context */
  const ctx = canvas.getContext("2d"); 

  /* --- NEW: helpers for multi-number wedges --- */

  const sampleOne = (arr) => arr[Math.floor(Math.random() * arr.length)];

  /* get wheel properties */
  let wheelWidth = canvas.getBoundingClientRect()['width'];
  let wheelHeight = canvas.getBoundingClientRect()['height'];
  let wheelX = canvas.getBoundingClientRect()['x'] + wheelWidth / 2;
  let wheelY = canvas.getBoundingClientRect()['y'] + wheelHeight / 2;
  const tot = sectors.length; // total number of sectors
  const rad = wheelWidth / 2; // radius of wheel
  const PI = Math.PI;
  const arc = (2 * PI) / tot; // arc sizes in radians
  const scoreMsg = document.getElementById("score");

  /* spin dynamics */
  const friction = 0.98;  // 0.995=soft, 0.99=mid, 0.98=hard
  const angVelMin = 5; // Below that number will be treated as a stop
  let angVelMax = 0; // Random ang.vel. to acceletare to 
  let angVel = 0;    // Current angular velocity

  /* state variables */
  let isGrabbed = false;       // true when wheel is grabbed, false otherwise
  let isDragging = false;      // true when wheel is being dragged, false otherwise
  let isSpinning = false;      // true when wheel is spinning, false otherwise
  let isAccelerating = false;  // true when wheel is accelerating, false otherwise
  let lastAngles = [0,0,0];    // store the last three angles
  let correctSpeed = [0]       // speed corrected for 360-degree limit
  let startAngle = null;       // angle of grab
  let oldAngle = 0;            // wheel angle prior to last perturbation
  let oldAngle_corrected;
  let currentAngle = null;     // wheel angle after last perturbation
  let onWheel = false;         // true when cursor is on wheel, false otherwise
  let spin_num = 5             // number of spins
  let direction;
  let animId = null;          // current requestAnimationFrame handle


  /* define spinning functions */

  const onGrab = (x, y) => {
    if (!isSpinning) {
      canvas.style.cursor = "grabbing";
      isGrabbed = true;
      startAngle = calculateAngle(x, y);
    };
  };

  const calculateAngle =  (currentX, currentY) => {
    let xLength = currentX - wheelX;
    let yLength = currentY - wheelY;
    let angle = Math.atan2(xLength, yLength) * (180/Math.PI);
    return 360 - angle;
  };

  const onMove = (x, y) => {
    if(isGrabbed) {
      canvas.style.cursor = "grabbing";
      isDragging = true;
    };
    if(!isDragging)
      return
    lastAngles.shift();
    let deltaAngle = calculateAngle(x, y) - startAngle;
    currentAngle = deltaAngle + oldAngle;
    lastAngles.push(currentAngle);
    let speed = lastAngles[2] - lastAngles[0];
    if (Math.abs(speed) < 200) {
      correctSpeed.shift();
      correctSpeed.push(speed);
    };
    render(currentAngle);
  };

  const render = (deg) => {
    canvas.style.transform = `rotate(${deg}deg)`;
  };


  const onRelease = function() {
    isGrabbed = false;
    if(isDragging){
      isDragging = false;
      oldAngle = currentAngle;
      let speed = correctSpeed[0];
      if (Math.abs(speed) > angVelMin) {
        direction = (speed > 0) ? 1 : -1;
        isAccelerating = true;
        isSpinning = true;
        angVelMax = rand(25, 50);
        giveMoment(speed)
      };
    };   
  };

  const giveMoment = function(initialSpeed) {

    let speed = initialSpeed;
    let lastTimestamp = null;

    function step(timestamp) {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const deltaTime = (timestamp - lastTimestamp) / 1000; // seconds
      lastTimestamp = timestamp;


      if (Math.abs(speed) >= angVelMax) isAccelerating = false;

      let liveSector = sectors[getIndex(oldAngle)];
      oldAngle_corrected = (oldAngle < 0) ? 360 + (oldAngle % 360) : oldAngle % 360;

      // accelerate
      if (isAccelerating) {
        let growthRate = Math.log(1.06) * 60;
        speed *= Math.exp(growthRate * deltaTime);
        animId = requestAnimationFrame(step);
        oldAngle += speed * deltaTime * 60;
        lastAngles.shift();
        lastAngles.push(oldAngle);
        render(oldAngle);
      }
      
      // decelerate and stop
      else {
        let decayRate = Math.log(friction) * 60 * 1.5; // friction < 1, so log is negative
        isAccelerating = false;
        speed *= Math.exp(decayRate * deltaTime); // Exponential decay
        animId = requestAnimationFrame(step);
        if (Math.abs(speed) > angVelMin * .1) {
          oldAngle += speed * deltaTime * 60;
          lastAngles.shift();
          lastAngles.push(oldAngle);
          render(oldAngle);       
        } else {
          // stop spinner
          speed = 0;
          if (animId !== null) {
            cancelAnimationFrame(animId);
            animId = null;
          };
          currentAngle = oldAngle;
          let sectorIdx = getIndex();
          let sector = sectors[sectorIdx];
          let points;
          if (sector.points.length > 1) {
            points = sampleOne(sector.points);
          } else {
            points = sector.points[0]
          }
          spinnerData.outcome_points.push(points);
          spinnerData.outcome_wedge.push(sector.label);
          spinnerData.outcome_color.push(sector.color);
          updateScore(points, sectorIdx);
          drawSector(sectors, sectorIdx, points);
        };
      };
    };
    animId = requestAnimationFrame(step);
  };

  /* generate random float in range min-max */
  const rand = (m, M) => Math.random() * (M - m) + m;

  const updateScore = (points, sectorIdx) => {
    score += points;
    spinnerData.score = score;
    let fontWeight = (points == 0) ? 'normal' : 'bolder';
    scoreMsg.innerHTML = `<span style="color:green; font-weight: bold">${score}</span>`;
    drawSector(sectors, sectorIdx, points);
    if (spinnerData.outcome_points.length < 16) {
      setTimeout(() => {
        scoreMsg.innerHTML = `${score}`
        isSpinning = false;
        drawSector(sectors, null, null);
        onWheel ? canvas.style.cursor = "grab" : canvas.style.cursor = "";
        if (!interactive && spinnerData.outcome_points.length < 16) { setTimeout(startAutoSpin, 1000) };
      }, 1000);
    };
  };

  const getIndex = () => {
    let normAngle = 0;
    let modAngle = currentAngle % 360;
    if (modAngle > 270) {
      normAngle = 360 - modAngle + 270;
    } else if (modAngle < -90) { 
      normAngle =  -modAngle - 90;
    } else {
      normAngle = 270 - modAngle;
    }
    let sector = Math.floor(normAngle / (360 / tot))
    return sector
  }

  //* Draw sectors and prizes texts to canvas */
  function drawWedgeNumbers(sector, wedgeIndex) {
    const vals = Array.isArray(sector.points) ? sector.points : [sector.points];
    const n = Math.min(vals.length, 4); // handle 1,2,4 (cap at 4)
    if (n === 0) return;

    ctx.save();
    ctx.translate(rad, rad);

    // Rotate to the wedge's angular center
    const rotation = (arc / 2) * (1 + 2 * wedgeIndex) + Math.PI / 2;
    ctx.rotate(rotation);

    // Typography
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 50px sans-serif";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "black";
    ctx.fillStyle = "#fff";

    // Geometry (in the rotated frame: +x = tangential, -y = toward rim)
    const r1 = -rad * 0.52;   // first row (closer to center)
    const r2 = -rad * 0.77;   // second row (closer to rim)
    const xOff = rad * 0.1;  // horizontal offset for 2x2

    if (n === 1) {
      const txt = String(vals[0]);
      ctx.strokeText(txt, 0, r1 * 1.15);
      ctx.fillText(txt, 0, r1 * 1.15);
    } else if (n === 2) {
      const [a, b] = vals;
      ctx.strokeText(String(a), 0, r1);
      ctx.fillText(String(a), 0, r1);
      ctx.strokeText(String(b), 0, r2);
      ctx.fillText(String(b), 0, r2);
    } else { // n >= 3 → render as 2x2 grid using first four values
      const [a, b, c, d] = [vals[0], vals[1], vals[2], vals[3]];
      // top row (closer to center), left/right
      ctx.strokeText(String(a), -xOff, r1);
      ctx.fillText(String(a),   -xOff, r1);
      ctx.strokeText(String(b),  xOff, r1);
      ctx.fillText(String(b),    xOff, r1);
      // bottom row (closer to rim), left/right
      ctx.strokeText(String(c), -xOff, r2);
      ctx.fillText(String(c),   -xOff, r2);
      ctx.strokeText(String(d),  xOff, r2);
      ctx.fillText(String(d),    xOff, r2);
    }

    ctx.restore();
  }
  
  //* Draw sectors and prizes texts to canvas */
const drawSector = (sectors, activeIdx = null, activePoints = null, showNumbers = true) => {
  // ---- outline + padding config ----
  const WHEEL_OUTLINE_WIDTH = 2;                     // outer ring thickness
  const WEDGE_OUTLINE_WIDTH = 2;                     // divider lines between wedges
  const WHEEL_OUTLINE_COLOR = "rgba(0,0,0,0.45)";    // outer ring color
  const WEDGE_OUTLINE_COLOR = "rgba(0,0,0,0.45)";    // wedge divider color
  const OUTER_PAD = Math.max(WHEEL_OUTLINE_WIDTH, WEDGE_OUTLINE_WIDTH) + 2; // px
  const R = rad - OUTER_PAD;                         // effective radius we draw to

  // (Optional) clear canvas before redrawing the static wheel layer
  // ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < sectors.length; i++) {
    const ang = arc * i;
    const isActive = (i === activeIdx && activePoints != null);

    ctx.save();

    // ---- WEDGE FILL ----
    ctx.beginPath();
    ctx.moveTo(rad, rad);
    ctx.arc(rad, rad, R, ang, ang + arc, false);
    ctx.lineTo(rad, rad);
    ctx.closePath();

    ctx.fillStyle = isActive ? "green" : sectors[i].color;
    ctx.fill();

    // ---- WEDGE OUTLINE (divider lines + arc edge) ----
    ctx.lineWidth = WEDGE_OUTLINE_WIDTH;
    ctx.strokeStyle = WEDGE_OUTLINE_COLOR;
    ctx.stroke();

    // ---- TEXT ----
    if (isActive) {
      // winner: big +points
      ctx.translate(rad, rad);
      const rotation = (arc / 2) * (1 + 2 * i) + Math.PI / 2;
      ctx.rotate(rotation);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "bolder 80px sans-serif";
      ctx.lineWidth = 3;
      ctx.strokeStyle = "black";
      ctx.fillStyle = "#fff";
      ctx.strokeText(`+${activePoints}`, 0, -R * 0.66);
      ctx.fillText(`+${activePoints}`,   0, -R * 0.66);
    } else if (showNumbers) {
      // non-winners: show their numbers on-wedge
      drawWedgeNumbers(sectors[i], i, R);
    }

    ctx.restore();
  }

  // ---- OUTER WHEEL RING ----
  ctx.save();
  ctx.beginPath();
  ctx.arc(rad, rad, R, 0, 2 * Math.PI, false);
  ctx.lineWidth = WHEEL_OUTLINE_WIDTH;
  ctx.strokeStyle = WHEEL_OUTLINE_COLOR;
  ctx.stroke();
  ctx.restore();
};

  drawSector(sectors, null, null);
  //renderLegend(sectors);

  function startAutoSpin() {
    direction = (Math.random() < 0.5 ? 1 : -1);
    isAccelerating = true;
    isSpinning = true;
    angVelMax = rand(25, 50);                   
    let initialSpeed = direction * rand(8, 15);
    giveMoment(initialSpeed);
  };

  if (interactive) {
    /* add event listners */
    canvas.addEventListener('mousedown', function(e) {
        if (onWheel) { onGrab(e.clientX, e.clientY) };
    });

    canvas.addEventListener('mousemove', function(e) {
        let dist = Math.sqrt( (wheelX - e.clientX)**2 + (wheelY - e.clientY)**2 );
        dist < rad ? onWheel = true : onWheel = false;
        onWheel && !isGrabbed && !isSpinning ? canvas.style.cursor = "grab" : canvas.style.cursor = "";
        if(isGrabbed && onWheel) { onMove(e.clientX, e.clientY) };
    });

    window.addEventListener('mouseup', onRelease);
  } else {
    setTimeout(startAutoSpin, 1000);
  };

  window.addEventListener('resize', function(event) {
    wheelWidth = canvas.getBoundingClientRect()['width'];
    wheelHeight = canvas.getBoundingClientRect()['height'];
    wheelX = canvas.getBoundingClientRect()['x'] + wheelWidth / 2;
    wheelY = canvas.getBoundingClientRect()['y'] + wheelHeight / 2;
  }, true);

};