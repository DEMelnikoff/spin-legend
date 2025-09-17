

const exp = (function() {


    var p = {};

    const condition = 0;

    const play = ["play", "watch"][condition];

    const doingOrWatching = ["doing", "watching"][condition];

    const playBool = [true, false][condition];

    jsPsych.data.addProperties({
        condition: play,
    });


   /*
    *
    *   INSTRUCTIONS
    *
    */

    const html = {
        welcome_play: [
            `<div class='parent'>
                <p><strong>Welcome to Wheel of Fortune!</strong></p>
                <p>In Wheel of Fortune, you'll spin a series of prize wheels.</p>
                <p>With each spin, you'll earn tokens.</p>
                <p>Your goal is to earn as many tokens as possible!</p>
            </div>`,
        ],

        welcome_watch: [
            `<div class='parent'>
                <p><strong>Welcome to Wheel of Fortune!</strong></p>
                <p>In Wheel of Fortune, you'll observe a series of spinning prize wheels.</p>
                <p>Each time a prize wheel spins, you'll have a chance of earning tokens.</p>
                <p>Your goal is to earn as many tokens as possible!</p>
            </div>`,
        ],

        how_to_earn: [
            `<div class='parent'>
                <p>The more tokens you earn, the better your chances of winning a <strong>$100.00 bonus prize</strong>.</p>
                <p>The tokens you earn will be entered into a lottery, and if one of your tokens is drawn, you'll win $100.00. 
                To maximize your chances of winning $100.00, you'll need as many tokens as possible.</p>
            </div>`,

            `<div class='parent'>
                <p>Each wheel is divided into four wedges, like this:</p>
                <img src="./img/w2_6.png" style="width:50%; height:50%">
            </div>`,

            `<div class='parent'>
                <p>The wedge the wheel lands on determines how many tokens you win for that spin.</p>
                <img src="./img/w2_6.png" style="width:50%; height:50%">
            </div>`,

            `<div class='parent'>
                <p>For example, if a wheel lands on this wedge...</p>
                <img src="./img/w2.png" style="width:50%; height:50%">
            </div>`,

            `<div class='parent'>
                <p>...you'll win 2 tokens.</p>
                <img src="./img/plus2.png" style="width:50%; height:50%">
            </div>`,

            `<div class='parent'>
                <p>If a wheel lands on this wedge...</p>
                <img src="./img/w6.png" style="width:50%; height:50%">
            </div>`,

            `<div class='parent'>
                <p>...you'll win 6 tokens.</p>
                <img src="./img/plus6.png" style="width:50%; height:50%">
            </div>`,

            `<div class='parent'>
                <p>Some wheels have wedges with multiple numbers, like this:</p>
                <img src="./img/w1357.png" style="width:50%; height:50%">
            </div>`,

            `<div class='parent'>
                <p>If a wheel lands on multiple numbers, one is randomly selected and added to your total.</p>
                <img src="./img/w1357.png" style="width:50%; height:50%">
            </div>`,

            `<div class='parent'>
                <p>For example, if a wheel lands on this wedge...</p>
                <img src="./img/w3_5.png" style="width:50%; height:50%">
            </div>`,

            `<div class='parent'>
                <p>You'll have an equal change of winning 5 tokens...</p>
                <img src="./img/plus5.png" style="width:50%; height:50%">
            </div>`,

            `<div class='parent'>
                <p>...or 3 tokens.</p>
                <img src="./img/plus3.png" style="width:50%; height:50%">
            </div>`,

            `<div class='parent'>
                <p>If a wheel lands on this wedge, you'll have an equal chance of winning 1 or 7 tokens.</p>
                <img src="./img/land17.png" style="width:50%; height:50%">
            </div>`,

            `<div class='parent'>
                <p>If a wheel lands on this wedge, you'll have an equal chance of winning 2 or 6 tokens.</p>
                <img src="./img/land26.png" style="width:50%; height:50%">
            </div>`,

            `<div class='parent'>
                <p>If a wheel lands on this wedge, you'll have an equal chance of winning 1, 3, 5, or 7 tokens.</p>
                <img src="./img/land1357.png" style="width:50%; height:50%">
            </div>`,
        ],

        how_to_spin_play: [
            `<div class='parent'>
                <p>To spin a prize wheel, just grab it with your cursor and give it a spin!
                <br>Watch the animation below to see how it's done.</p>
                <img src="./img/spin-${play}-gif.gif" style="width:60%; height:60%">
            </div>`,

            `<div class='parent'>
                <p>Throughout Wheel of Fortune, you'll answer questions about your feelings.</p>
                <p>Specifically, you'll report how <strong>immersed and engaged</strong> you feel while spinning each wheel,
                as well as how <strong>happy</strong> you currently feel.</p>
            </div>`,      

            `<div class='parent'>
                <p>You're ready to start Wheel of Fortune!</p>
                <p>Continue to the next screen to begin.</p>
            </div>`,      
        ],

        how_to_spin_watch: [
            `<div class='parent'>
                <p>Each prize wheel spins automatically.
                <br>Watch the animation below to see an example.</p>
                <img src="./img/spin-${play}-gif.gif" style="width:60%; height:60%">
            </div>`,

            `<div class='parent'>
                <p>Throughout Wheel of Fortune, you'll answer questions about your feelings.</p>
                <p>Specifically, you'll report how <strong>immersed and engaged</strong> you feel during each round of Wheel of Fortune,
                as well as how <strong>happy</strong> you currently feel.</p>
            </div>`,      

            `<div class='parent'>
                <p>You're ready to start Wheel of Fortune!</p>
                <p>Continue to the next screen to begin.</p>
            </div>`,      
        ],

        postTask: [
            `<div class='parent'>
                <p>Wheel of Fortune is now complete!</p>
                <p>To finish this study, please continue to answer a few final questions.</p>
            </div>`
        ],
    };

    p.consent = {
        type: jsPsychExternalHtml,
        url: "./html/consent.html",
        cont_btn: "advance",
    };

    const intro = {
        type: jsPsychInstructions,
        pages: [[html.welcome_play, html.welcome_watch][condition], ...html.how_to_earn],
        show_clickable_nav: true,
        post_trial_gap: 500,
        allow_keys: false,
    };

    let correctAnswers = ["Earn as many tokens as possible.", "I'll definitely win 5 tokens.", "I'll randomly win 5 or 7 tokens.", "I'll randomly win 1, 3, 5, or 7 tokens."];

    const errorMessage = {
        type: jsPsychInstructions,
        pages: [`<div class='parent'><p>You provided the wrong answer.<br>To make sure you understand the game, please continue to re-read the instructions.</p></div>`],
        show_clickable_nav: true,
        allow_keys: false,
    };

    const attnChk = {
        type: jsPsychSurveyMultiChoice,
        preamble: `<div class='parent'>
            <p>Please answer the following questions.</p>
            </div>`,
        questions: [
            {
                prompt: `What is your goal?`, 
                name: `attnChk1`, 
                options: [`Spin the wheel as fast as possible.`, `Spin the wheel as long as possible.`, `Earn as many tokens as possible.`],
            },
            {
                prompt: `What happens if a wheel lands on a wedge with just a 5?`, 
                name: `attnChk2`, 
                options: ["I'll definitely win 5 tokens.", "I'll randomly win 5 or 7 tokens.", "I'll randomly win 1, 3, 5, or 7 tokens."],
            },
            {
                prompt: `What happens if a wheel lands on a wedge with a 5 and 7?`, 
                name: `attnChk3`, 
                options: ["I'll definitely win 5 tokens.", "I'll randomly win 5 or 7 tokens.", "I'll randomly win 1, 3, 5, or 7 tokens."],
            },
            {
                prompt: `What happens if a wheel lands on a wedge with a 1, 3, 5, and 7?`, 
                name: `attnCh4`, 
                options: ["I'll definitely win 5 tokens.", "I'll randomly win 5 or 7 tokens.", "I'll randomly win 1, 3, 5, or 7 tokens."],
            },
        ],
        scale_width: 500,
        on_finish: (data) => {
              const totalErrors = getTotalErrors(data, correctAnswers);
              data.totalErrors = totalErrors;
        },
    };

    const conditionalNode = {
      timeline: [errorMessage],
      conditional_function: () => {
        const fail = jsPsych.data.get().last(1).select('totalErrors').sum() > 0 ? true : false;
        return fail;
      },
    };

    p.instLoop = {
      timeline: [intro, attnChk, conditionalNode],
      loop_function: () => {
        const fail = jsPsych.data.get().last(2).select('totalErrors').sum() > 0 ? true : false;
        return fail;
      },
    };

    p.postIntro = {
        type: jsPsychInstructions,
        pages: [html.how_to_spin_play, html.how_to_spin_watch][condition],
        show_clickable_nav: true,
        post_trial_gap: 500,
        allow_keys: false,
    };

    
   /*
    *
    *   TASK
    *
    */

    const wedges = {

        w1: { color:"#E41A1C", label:"1", points:[1] },   // blue
        w2: { color:"#377EB8", label:"2", points:[2] },   // orange
        w3: { color:"#4DAF4A", label:"3", points:[3] },   // green
        w4: { color:"#984EA3", label:"4", points:[4] },   // red
        w5: { color:"#FF7F00", label:"5", points:[5] },   // purple
        w6: { color:"#A65628", label:"6", points:[6] },   // brown
        w7: { color:"#F781BF", label:"7", points:[7] },   // cyan

        w2_6:   { color:"#E41A1C", label:"2_6", points:[2,6] },   // teal
        w1_7:   { color:"#E41A1C", label:"1_7", points:[5,7] },   // teal
        w3_5:   { color:"#E41A1C", label:"3_5", points:[1,3] },   // teal

        w1_3_5_7: { color:"#1B9E77", label:"1_3_5_7", points:[1,3,5,7] }, // turquoise (lighter/brighter than teal/green-teal)

    };

    const pairs = {



    };

    // define each wheel
    const wheels = [
        {sectors: [ wedges.w4, wedges.w4, wedges.w4, wedges.w4 ],                         wheel_id: 1, ev: 4, sd: 2, mi: 0, hE: 0, hEM: 0},
        {sectors: [ wedges.w1_3_5_7, wedges.w1_3_5_7, wedges.w1_3_5_7, wedges.w1_3_5_7 ], wheel_id: 2, ev: 4, sd: 2, mi: 0, hE: 2, hEM: 2},
        {sectors: [ wedges.w7, wedges.w1, wedges.w3, wedges.w5 ],                         wheel_id: 3, ev: 4, sd: 2, mi: 2, hE: 2, hEM: 0},
        {sectors: [ wedges.w6, wedges.w2, wedges.w6, wedges.w2 ],                         wheel_id: 4, ev: 4, sd: 2, mi: 1, hE: 1, hEM: 0},
        {sectors: [ wedges.w2_6, wedges.w2_6, wedges.w2_6, wedges.w2_6 ],                 wheel_id: 5, ev: 4, sd: 2, mi: 0, hE: 1, hEM: 1},
        {sectors: [ wedges.w1_7, wedges.w3_5, wedges.w1_7, wedges.w3_5 ],                 wheel_id: 6, ev: 4, sd: 2, mi: 1, hE: 2, hEM: 1},
    ];

    const WHEEL_COLORS = ["#BDBDBD", "#737373", "#BDBDBD", "#737373"];

    let scoreTracker = 0; // track current score

    let round = 1;  // track current round

    const spin = {
        type: jsPsychCanvasButtonResponse,
        stimulus: function(c, spinnerData) {
            const baseSectors = jsPsych.timelineVariable('sectors');
            const sectorsWithFixedColors = baseSectors.map((s, i) => ({ ...s, color: WHEEL_COLORS[i % WHEEL_COLORS.length] }));
            createSpinner(c, spinnerData, scoreTracker, sectorsWithFixedColors, playBool);
        },
        canvas_size: [500, 500],
        score: function() {
            return scoreTracker
        },
        data: {wheel_id: jsPsych.timelineVariable('wheel_id'), ev: jsPsych.timelineVariable('ev'), mi: jsPsych.timelineVariable('mi'), hE: jsPsych.timelineVariable('hE'), hEM: jsPsych.timelineVariable('hEM')},
        on_finish: function(data) {
            data.round = round;
            scoreTracker = data.score;
        },
    };

    // trial: flow DV
    const flowMeasure = {
        type: jsPsychSurveyLikert,
        questions: function () {
            let flow_question = [
                {prompt: `During the last round of Wheel of Fortune,<br>how <b>immersed</b> and <b>engaged</b> did you feel in what you were ${doingOrWatching}?`,
                name: `flow`,
                labels: ['0<br>A little', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10<br>Extremely']},
            ];
            return flow_question;
        },
        randomize_question_order: false,
        scale_width: 600,
        data: {wheel_id: jsPsych.timelineVariable('wheel_id'), ev: jsPsych.timelineVariable('ev'), mi: jsPsych.timelineVariable('mi'), hE: jsPsych.timelineVariable('hE'), hEM: jsPsych.timelineVariable('hEM')},
        on_finish: function(data) {
            data.round = round;
            saveSurveyData(data);
        },
    };

    const happinessMeasure = {
        type: jsPsychSurveyMultiChoice,
        questions: [
            {
                prompt: `How <b>happy</b> are you right now?`, 
                name: `happiness`, 
                options: ['10 (Very Happy)', '9', '8', '7', '6', '5', '4', '3', '2', '1', '0 (Very Unhappy)'],
            },
        ],
        scale_width: 500,
        data: {wheel_id: jsPsych.timelineVariable('wheel_id'), ev: jsPsych.timelineVariable('ev'), mi: jsPsych.timelineVariable('mi'), hE: jsPsych.timelineVariable('hE'), hEM: jsPsych.timelineVariable('hEM')},
        on_finish: (data) => {
            data.round = round;
            saveSurveyData(data);
            round++;
        },
    };

    // timeline: main task
    p.task = {
        timeline: [spin, flowMeasure, happinessMeasure],
        repetitions: 1,
        timeline_variables: wheels,
        randomize_order: true,
    };

   /*
    *
    *   Demographics
    *
    */

    p.demographics = (function() {


        const taskComplete = {
            type: jsPsychInstructions,
            pages: html.postTask,
            show_clickable_nav: true,
            post_trial_gap: 500,
        };

        const gender = {
            type: jsPsychHtmlButtonResponse,
            stimulus: '<p>What is your gender?</p>',
            choices: ['Male', 'Female', 'Other'],
            on_finish: (data) => {
                data.gender = data.response;
            }
        };

        const age = {
            type: jsPsychSurveyText,
            questions: [{prompt: "Age:", name: "age"}],
            on_finish: (data) => {
                saveSurveyData(data); 
            },
        }; 

        const ethnicity = {
            type: jsPsychHtmlButtonResponse,
            stimulus: '<p>What is your race?</p>',
            choices: ['White / Caucasian', 'Black / African American','Asian / Pacific Islander', 'Hispanic', 'Native American', 'Other'],
            on_finish: (data) => {
                data.ethnicity = data.response;
            }
        };

        const english = {
            type: jsPsychHtmlButtonResponse,
            stimulus: '<p>Is English your native language?:</p>',
            choices: ['Yes', 'No'],
            on_finish: (data) => {
                data.english = data.response;
            }
        };  

        const finalWord = {
            type: jsPsychSurveyText,
            questions: [{prompt: "Questions? Comments? Complains? Provide your feedback here!", rows: 10, columns: 100, name: "finalWord"}],
            on_finish: (data) => {
                saveSurveyData(data); 
            },
        }; 

        const demos = {
            timeline: [taskComplete, gender, age, ethnicity, english, finalWord]
        };

        return demos;

    }());


   /*
    *
    *   SAVE DATA
    *
    */

    p.save_data = {
        type: jsPsychPipe,
        action: "save",
        experiment_id: "b74eLqcnWi8q",
        filename: filename,
        data_string: ()=>jsPsych.data.get().csv()
    };

    return p;

}());

const timeline = [exp.consent, exp.instLoop, exp.postIntro, exp.task, exp.demographics, exp.save_data];

jsPsych.run(timeline);
