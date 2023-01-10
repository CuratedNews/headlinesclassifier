const textarea = document.querySelector("textarea");
const classificationResult = document.querySelector(".classification-result");
let lastModel;
let lastClassName;
let warmedUp = false;
const negativeresult = document.getElementById("negative");
const positiveresult = document.getElementById("positive");
const neutralresult = document.getElementById("neutral");
const searchbox = document.getElementById("search-input");

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
      var headline = searchbox.value;
      textarea.value = headline;
      var length = headline.split(" ").length;
      if (textarea.value === ""){
        classificationResult.innerHTML = `<div class="title">Headline missing...</div>`;
        return;
      } else if (length < 5){
        classificationResult.innerHTML = `<div class="title">Headline not long enough...</div>`;
        return;
      } else if (length > 25){
        classificationResult.innerHTML = `<div class="title">Headline too long...</div>`;
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
  classificationResult.innerHTML = `<div class="title">${textarea.value}</div>`;
  let values = String(strResult2);
  const scores = values.split(",");
  if (parseFloat(scores[0]) > 50){
  	var negativeper = "<mark>"+scores[0]+"</mark>";
  } else {
  	var negativeper = scores[0];
  }
  if (parseFloat(scores[1]) > 50){
  	var neutralper = "<mark>"+scores[1]+"</mark>";
  } else {
  	var neutralper = scores[1];
  }
  if (parseFloat(scores[2]) > 50){
  	var positiveper = "<mark>"+scores[2]+"</mark>";
  } else {
  	var positiveper = scores[2];
  }
  negativeresult.innerHTML = negativeper;
  positiveresult.innerHTML = positiveper;
  neutralresult.innerHTML = neutralper;
  searchbox.value = "";
  textarea.value = "";
}

