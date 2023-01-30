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

const evaluation = document.getElementById('evaluation');
const howheadlinesclassifierworks = document.getElementById('howheadlinesclassifierworks');
const codebook = document.getElementById('codebook');
const code = document.getElementById('code');
const result2 = document.getElementById('result');
const evaluationbutton = document.getElementById('evaluationbutton');
const methodologybutton = document.getElementById('methodologybutton');
const codebookbutton = document.getElementById('codebookbutton');
const codebutton = document.getElementById('codebutton');
howheadlinesclassifierworks.style.display = 'none';
codebook.style.display = 'none';
code.style.display = 'none';
result2.style.display = 'none';

const codebookviewer = document.getElementById('codebookviewer');

const bannermenuactual = document.getElementById('bannermenuactual');
const bannermenu = document.getElementById('bannermenu');
const bannermenu2 = document.getElementById('bannermenu2');
const bannermenu3 = document.getElementById('bannermenu3');
const bannermenu4 = document.getElementById('bannermenu4');
bannermenuactual.style.display = 'flex';
bannermenu.classList.add("yellowhighlight");

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
}

evaluationbutton.addEventListener("click", function(){
  howheadlinesclassifierworks.style.display = 'none';
  codebook.style.display = 'none';
  evaluation.style.display = 'flex';
  if (isResult == true){
    result.style.display = 'flex';
  }
  code.style.display = 'none';
  bannermenu.classList.add("yellowhighlight");
  bannermenu2.classList.remove("yellowhighlight");
  bannermenu3.classList.remove("yellowhighlight");
  bannermenu4.classList.remove("yellowhighlight");
});

methodologybutton.addEventListener("click", function(){
  howheadlinesclassifierworks.style.display = 'inline';
  evaluation.style.display = 'none';
  result.style.display = 'none';
  codebook.style.display = 'none';
  code.style.display = 'none';
  bannermenu2.classList.add("yellowhighlight");
  bannermenu.classList.remove("yellowhighlight");
  bannermenu3.classList.remove("yellowhighlight");
  bannermenu4.classList.remove("yellowhighlight");
});

codebookbutton.addEventListener("click", function(){
  howheadlinesclassifierworks.style.display = 'none';
  evaluation.style.display = 'none';
  result.style.display = 'none';
  code.style.display = 'none';
  codebook.style.display = 'inline';
  bannermenu3.classList.add("yellowhighlight");
  bannermenu.classList.remove("yellowhighlight");
  bannermenu2.classList.remove("yellowhighlight");
  bannermenu4.classList.remove("yellowhighlight");
  codebookviewer.style.top = "44px";
});

codebutton.addEventListener("click", function(){
  howheadlinesclassifierworks.style.display = 'none';
  evaluation.style.display = 'none';
  result.style.display = 'none';
  codebook.style.display = 'none';
  code.style.display = 'flex';
  bannermenu4.classList.add("yellowhighlight");
  bannermenu.classList.remove("yellowhighlight");
  bannermenu2.classList.remove("yellowhighlight");
  bannermenu3.classList.remove("yellowhighlight");
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
