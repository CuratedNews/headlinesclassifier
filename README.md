# Headlines Classifier
News headlines are some of the most volatile and consumed pieces of information on the planet. We have made a headlines classifier to help users determine when headlines are junking up their content consumption ecosystem. We have also made it open-source so users can see how it works and operates. Our [dataset](https://curatednews.xyz/static/downloads/CuratedNewsDataset.zip) is open-source and freely available.

Check out our [demo](https://curatednews.github.io/headlinesclassifier/) and/or [codebook](https://curatednews.github.io/headlinesclassifier/CuratedNewsDatasetCodeBook.pdf)

## Usage

Models available for testing purposes only [https://raw.githubusercontent.com/CuratedNews/headlinesclassifier/main/headlinesclassifier.tflite](https://raw.githubusercontent.com/CuratedNews/headlinesclassifier/main/headlinesclassifier.tflite) & [https://raw.githubusercontent.com/CuratedNews/headlinesclassifier/main/headlinesclassifier2.tflite](https://raw.githubusercontent.com/CuratedNews/headlinesclassifier/main/headlinesclassifier2.tflite)

## Construction in Python

### install if not already installed
```
!pip install -q tflite-model-maker-nightly
```

### import packages
```
import pandas as pd
from tflite_model_maker import model_spec
from tflite_model_maker import text_classifier
from tflite_model_maker.text_classifier import DataLoader
```

### import dataset and check if dataset imported correctly
```
df = pd.read_csv("headlinesvolatilitydata.csv")
df.head(25)
``` 

### check dataset for total counts of positive, negative, and neutral sentiment labels
```
df['titlesentimentoverall'].value_counts()
```

### set model specifications
```
spec = model_spec.get('average_word_vec')
```
#### for more information on text classification specifications see [tensorflow docs](https://www.tensorflow.org/text/guide/word_embeddings)

### set parameters for model and iterate 10 times
```
train_data = DataLoader.from_csv(
      filename='headlinesvolatilitydata.csv',
      text_column='title',
      label_column='titlesentimentoverall',
      model_spec=spec,
      is_training=True)
model = text_classifier.create(train_data, model_spec=spec, epochs=10)
```

### check model summary
```
model.summary()
```

## How it works?
Check our [demo](https://curatednews.github.io/headlinesclassifier/) for a hands-on with explanations

## Jupyter Notebook
[Do it](https://github.com/CuratedNews/headlinesclassifier/blob/main/headlinesvolatilitynotebook.ipynb) yourself

## Want to know more?
Visit [https://curatednews.xyz](https://curatednews.xyz)
