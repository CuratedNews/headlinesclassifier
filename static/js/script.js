const textarea = document.querySelector("textarea");
const classificationResult = document.querySelector(".classification-result");
const classificationResult2 = document.querySelector(".classification-result2");
let lastModel;
let lastClassName;
let warmedUp = false;
const negativeresult = document.getElementById("negative");
const positiveresult = document.getElementById("positive");
const neutralresult = document.getElementById("neutral");
const searchbox = document.getElementById("search-input");
const loader = document.getElementById('loader');
loader.style.display = 'none';

const result2 = document.getElementById('result');

const seeforyourself = document.getElementById('seeforyourself');

const learnmore = document.getElementById('learnmore');
const previousmodal = document.getElementById('previous-modal');
const nextclosemodal = document.getElementById('next-close-modal');

result2.style.display = 'none';

const homecontent = document.getElementById('home-content');

var sizewidth = window.innerWidth;
var isResult = false;

setupButton(
  "tflite",
  async () =>
    await tfTask.NLClassification.CustomModel.TFLite.load({
      model: "https://raw.githubusercontent.com/CuratedNews/headlinesclassifier/main/headlinesclassifier.tflite"
    })
);

async function setupButton(className, modelCreateFn, needWarmup) {
  document
    .querySelector(`.model.${className} .btn`)
    .classList.remove("disabled");
  const resultEle = document.querySelector(`.model.${className} .result`);
  document
    .querySelector(`.model.${className} .btn`)
    .addEventListener("click", async () => {
      loader.style.display = 'block';
      var headline = searchbox.value;
      textarea.value = headline;
      var length = headline.split(" ").length;
      const result2 = document.getElementById('result');
      result2.style.display = 'flex';
      if (textarea.value === ""){
        classificationResult.innerHTML = `<div class="title">Headline missing...</div>`;
        loader.style.display = 'none';
        return;
      } else if (length < 5){
        classificationResult.innerHTML = `<div class="title">Headline not long enough...</div>`;
        loader.style.display = 'none';
        return;
      } else if (length > 25){
        classificationResult.innerHTML = `<div class="title">Headline too long...</div>`;
        loader.style.display = 'none';
        return;
      }
      let model;
      // Create the model when user clicks on a button.
      if (lastClassName !== className) {
        // Clean up the previous model if existed.
        if (lastModel) {
          lastModel.cleanUp();
        }
        // Create the new model and save it.
        //resultEle.textContent = "Loading...";
        negativeresult.innerHTML = "";
        positiveresult.innerHTML = "";
        neutralresult.innerHTML = "";
        model = await modelCreateFn();
        lastModel = model;
        lastClassName = className;
      }
      // Reuse the model if user clicks on the same button.
      else {
        model = lastModel;
      }

      // Warm up if needed.
      if (needWarmup && !warmedUp) {
        await model.predict(textarea.value);
        warmedUp = true;
      }

      // Run inference and update result.
      const start = Date.now();
      const result = await model.predict(textarea.value);
      const latency = Date.now() - start;
      renderResult(result);
      resultEle.textContent = `Latency: ${latency}ms`;
    });
}

function renderResult(result) {
  /*console.log(result);
  const strResult = result.classes.map(cls => {
    return `${cls.className}: ${cls.score.toFixed(3)}`;
  }).join(', ');*/
  const strResult2 = result.classes.map(cls => {
    return `${cls.score.toFixed(3)*100}%`;
  });
  classificationResult.innerHTML = `<div class="title shimmer_text_animated">${textarea.value}</div>`;
  let values = String(strResult2);
  const scores = values.split(",");
  if (parseFloat(scores[0]) > 80){
  	var negativeper = "<strong class='blue_text_animated'>"+parseFloat(scores[0]).toFixed(1)+"%</strong>";
  } else {
  	var negativeper = parseFloat(scores[0]).toFixed(1)+"%";
  }
  if (parseFloat(scores[1]) > 80){
  	var neutralper = "<strong class='blue_text_animated'>"+parseFloat(scores[1]).toFixed(1)+"%</strong>";
  } else {
  	var neutralper = parseFloat(scores[1]).toFixed(1)+"%";
  }
  if (parseFloat(scores[2]) > 80){
  	var positiveper = "<strong class='blue_text_animated'>"+parseFloat(scores[2]).toFixed(1)+"%</strong>";
  } else {
  	var positiveper = parseFloat(scores[2]).toFixed(1)+"%";
  }
  negativeresult.innerHTML = negativeper;
  positiveresult.innerHTML = positiveper;
  neutralresult.innerHTML = neutralper;
  searchbox.value = "";
  textarea.value = "";
  loader.style.display = 'none';
  isResult = true;
  seeforyourself.style.display = 'none';
}

learnmore.addEventListener("click", function(){
  openModal("How it works?", "Typical text classification methodologies rely on big data. This makes sense. Real world practices sometimes require real world data. Ideal distributions don't always represent the world we live in. Many companies cannot compete with major corporations who have massive technical information collection operations in place.","fa-question-circle","neutralbutton")
  
  previousmodal.style.display = "none";
  
  nextclosemodal.addEventListener("click", function(){
  previousmodal.style.display = "inline-block";
  nextclosemodal.style.display = "none";
  openModal("What we do...", "We rely on better data. Our open-source headlines classifier, showcases our values and commitment to transparency. The data we used to make this model is freely available for use in accordance with the terms and conditions listed in our codebook. It is the largest open-source dataset available when it comes to quality news-related material.","fa-question-circle","neutralbutton")

  
  previousmodal.addEventListener("click", function(){
  
  openModal("How it works?", "Typical text classification methodologies rely on big data. This makes sense. Real world practices sometimes require real world data. Ideal distributions don't always represent the world we live in. Many companies cannot compete with major corporations who have massive technical information collection operations in place.","fa-question-circle","neutralbutton")
  
  previousmodal.style.display = "none";
  nextclosemodal.style.display = "inline-block";
  
  nextclosemodal.addEventListener("click", function(){
  
  openModal("What we do...", "We rely on better data. Our open-source headlines classifier, showcases our values and commitment to transparency. The data we used to make this model is freely available for use in accordance with the terms and conditions listed in our codebook. It is the largest open-source dataset available when it comes to quality news-related material.","fa-question-circle","neutralbutton")
  
  });
  
  });
  
  });
  
});

setupButton2(
  "tflite",
  async () =>
    await tfTask.NLClassification.CustomModel.TFLite.load({
      model: "https://raw.githubusercontent.com/CuratedNews/headlinesclassifier/main/headlinesclassifier2.tflite"
    })
);

async function setupButton2(className, modelCreateFn, needWarmup) {
  document
    .querySelector(`.model.${className} .btn`)
    .classList.remove("disabled");
  const resultEle = document.querySelector(`.model.${className} .result`);
  document
    .querySelector(`.model.${className} .btn`)
    .addEventListener("click", async () => {
      loader.style.display = 'block';
      var headline = searchbox.value;
      textarea.value = headline;
      var length = headline.split(" ").length;
      if (textarea.value === ""){
        return;
      } else if (length < 5){
        return;
      } else if (length > 25){
        return;
      }
      let model;
      // Create the model when user clicks on a button.
      if (lastClassName !== className) {
        // Clean up the previous model if existed.
        if (lastModel) {
          lastModel.cleanUp();
        }
        // Create the new model and save it.
        //resultEle.textContent = "Loading...";
        negativeresult.innerHTML = "";
        positiveresult.innerHTML = "";
        neutralresult.innerHTML = "";
        model = await modelCreateFn();
        lastModel = model;
        lastClassName = className;
      }
      // Reuse the model if user clicks on the same button.
      else {
        model = lastModel;
      }

      // Warm up if needed.
      if (needWarmup && !warmedUp) {
        await model.predict(textarea.value);
        warmedUp = true;
      }

      // Run inference and update result.
      const start = Date.now();
      const result = await model.predict(textarea.value);
      const latency = Date.now() - start;
      renderResult2(result);
      resultEle.textContent = `Latency: ${latency}ms`;
    });
}

function renderResult2(result) {
  /*console.log(result);
  const strResult = result.classes.map(cls => {
    return `${cls.className}: ${cls.score.toFixed(3)}`;
  }).join(', ');*/
  const strResult2 = result.classes.map(cls => {
    return `${cls.score.toFixed(3)*100}%`;
  });
  let values = String(strResult2);
  const scores = values.split(",");
  const unknown = parseFloat(scores[0]).toFixed(1)+"%"
  const academic = parseFloat(scores[1]).toFixed(1)+"%"
  const neutral = parseFloat(scores[2]).toFixed(1)+"%"
  const liberal = parseFloat(scores[3]).toFixed(1)+"%"
  const conservative = parseFloat(scores[4]).toFixed(1)+"%"
  const factchecker = parseFloat(scores[5]).toFixed(1)+"%"
  classificationResult2.innerHTML = `<div class="pollcheckresults"><span class="pollcheckbutton unknownactive">Unknown ${unknown}</span><span class="pollcheckbutton unknownactive academicactive">Academic ${academic}</span><span class="pollcheckbutton neutralidactive">Neutral ${neutral}</span><br><br><span class="pollcheckbutton liberalidactive">Liberal ${liberal}</span><span class="pollcheckbutton conservativeidinactive">Conservative ${conservative}</span><span class="pollcheckbutton unknownactive factcheckeractive">Fact Checker ${factchecker}</span></div>`;
}

function openModal(title, message, icon, colorclass){
    const modal = document.getElementById("modal");
    const closemodal = document.getElementById("close-modal");
    const titlemodal = document.getElementById("title-modal");
    const messagemodal = document.getElementById("message-modal");
    titlemodal.innerHTML = `<i class='fa ${icon} ${colorclass}' aria-hidden='true'></i> ${title}`;
    messagemodal.innerText = message;
    modal.style.display = "block";
    closemodal.addEventListener('click', (event) => {
        modal.classList.add("dissolve");
        setTimeout(function(){
            modal.style.display = "none";
            modal.classList.remove("dissolve");
        },500);
    });
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}
